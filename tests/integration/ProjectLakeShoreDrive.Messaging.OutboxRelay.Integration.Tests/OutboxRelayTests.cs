using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Integration.Tests;

// Runs against real SQL Server (LocalDB), not EF InMemory (database.md), since the relay's
// duplicate-safety guarantees depend on the same optimistic-concurrency lease behavior the
// outbox repository's own SQL integration tests exercise.
public sealed class OutboxRelayTests : IAsyncLifetime
{
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OutboxMessageConfiguration());
        }
    }

    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_relay_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

    private TestDbContext _context = null!;

    public async Task InitializeAsync()
    {
        _context = CreateContext();
        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.DisposeAsync();
    }

    private TestDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseSqlServer(_connectionString)
            .Options;

        return new TestDbContext(options);
    }

    private static OutboxMessage NewMessage(DateTimeOffset createdAtUtc) => new()
    {
        Id = Guid.NewGuid(),
        EventType = "EngagementPhaseChanged",
        EventVersion = 1,
        PayloadJson = """{"engagementId":"engagement-42"}""",
        CorrelationId = Guid.NewGuid(),
        Producer = "Engagement",
        OccurredAtUtc = createdAtUtc,
        CreatedAtUtc = createdAtUtc,
    };

    private static Messaging.OutboxRelay.OutboxRelay CreateRelay(
        OutboxRepository repository,
        IIntegrationEventPublisher publisher,
        int maxAttempts = 3) => new(
            repository,
            publisher,
            _ => new PublishDestination("engagement-events"),
            leaseOwner: "relay-under-test",
            leaseDuration: TimeSpan.FromMinutes(5),
            maxAttempts: maxAttempts);

    [Fact]
    public async Task RunOnceAsync_PublishesAndMarksDispatched_WithoutDeletingTheRow()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var publisher = new FakeIntegrationEventPublisher();
        var relay = CreateRelay(new OutboxRepository(_context), publisher);

        var result = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(1));

        Assert.Single(result.Dispatched);
        Assert.Equal(message.Id, result.Dispatched[0]);

        var call = Assert.Single(publisher.Calls);
        Assert.Equal(message.Id, call.Message.MessageId);
        Assert.Equal(message.PayloadJson, call.Message.Body);
        Assert.Equal(message.CorrelationId, call.Message.CorrelationId);

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.Set<OutboxMessage>().SingleAsync(m => m.Id == message.Id);
        Assert.Equal(OutboxMessageStatus.Dispatched, stored.Status);
    }

    [Fact]
    public async Task RunOnceAsync_RunTwice_DoesNotRepublish_AnAlreadyDispatchedMessage()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var publisher = new FakeIntegrationEventPublisher();
        var relay = CreateRelay(new OutboxRepository(_context), publisher);

        await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(1));
        var secondResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(2));

        Assert.Empty(secondResult.Dispatched);
        Assert.Single(publisher.Calls);
    }

    [Fact]
    public async Task RunOnceAsync_OnTransientFailure_RetriesLater_WithTheSameStableMessageId()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var publisher = new FakeIntegrationEventPublisher();
        publisher.FailNextAttempts(message.Id, times: 1);

        var repository = new OutboxRepository(_context);
        var relay = CreateRelay(repository, publisher, maxAttempts: 3);

        var firstResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(1));
        Assert.Single(firstResult.RetriedFailures);
        Assert.Empty(firstResult.Dispatched);

        // Lease was released on failure, so the row is immediately eligible again.
        var secondResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(2));
        Assert.Single(secondResult.Dispatched);

        Assert.Equal(2, publisher.Calls.Count);
        Assert.All(publisher.Calls, call => Assert.Equal(message.Id, call.Message.MessageId));
    }

    [Fact]
    public async Task RunOnceAsync_ExhaustsRetryBudget_MarksPermanentlyFailed_AndStopsLeasingTheRow()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var publisher = new FakeIntegrationEventPublisher();
        publisher.FailNextAttempts(message.Id, times: 10);

        var repository = new OutboxRepository(_context);
        var relay = CreateRelay(repository, publisher, maxAttempts: 2);

        var firstResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(1));
        Assert.Single(firstResult.RetriedFailures);

        var secondResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(2));
        Assert.Single(secondResult.PermanentlyFailed);

        var thirdResult = await relay.RunOnceAsync(batchSize: 10, now.AddSeconds(3));
        Assert.Empty(thirdResult.Dispatched);
        Assert.Empty(thirdResult.RetriedFailures);
        Assert.Empty(thirdResult.PermanentlyFailed);

        Assert.Equal(2, publisher.Calls.Count);

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.Set<OutboxMessage>().SingleAsync(m => m.Id == message.Id);
        Assert.Equal(OutboxMessageStatus.Failed, stored.Status);
    }

    [Fact]
    public async Task RunOnceAsync_Cancellation_PropagatesAndLeavesUnprocessedRowsLeasedNotFailed()
    {
        var now = DateTimeOffset.UtcNow;
        var first = NewMessage(now);
        var second = NewMessage(now.AddSeconds(1));
        _context.OutboxMessages.AddRange(first, second);
        await _context.SaveChangesAsync();

        using var cts = new CancellationTokenSource();

        await Assert.ThrowsAsync<OperationCanceledException>(async () =>
        {
            // Cancel once the first message has been published, before the second is processed.
            var repository = new OutboxRepository(_context);
            var cancelingPublisher = new CancelAfterFirstCallPublisher(cts);
            var cancelingRelay = CreateRelay(repository, cancelingPublisher);

            await cancelingRelay.RunOnceAsync(batchSize: 10, now.AddSeconds(2), cts.Token);
        });

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.Set<OutboxMessage>().ToListAsync();

        // Neither row was recorded as a failed publish attempt because of cancellation.
        Assert.All(stored, m => Assert.Equal(0, m.AttemptCount));
    }

    private sealed class CancelAfterFirstCallPublisher(CancellationTokenSource cancellationTokenSource) : IIntegrationEventPublisher
    {
        private bool _calledOnce;

        public Task PublishAsync(PublishDestination destination, PreparedIntegrationMessage message, CancellationToken cancellationToken = default)
        {
            if (_calledOnce)
            {
                cancellationTokenSource.Cancel();
                cancellationToken.ThrowIfCancellationRequested();
            }

            _calledOnce = true;
            return Task.CompletedTask;
        }
    }
}
