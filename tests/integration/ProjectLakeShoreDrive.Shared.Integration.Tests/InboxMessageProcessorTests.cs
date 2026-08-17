using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Shared.Persistence.Inbox;

namespace ProjectLakeShoreDrive.Shared.Integration.Tests;

// Runs against real SQL Server (LocalDB), not EF InMemory (database.md), because
// duplicate/concurrency safety depends on real primary-key and optimistic-concurrency
// enforcement, which InMemory does not provide.
public sealed class InboxMessageProcessorTests : IAsyncLifetime
{
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<InboxMessage> InboxMessages => Set<InboxMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new InboxMessageConfiguration());
        }
    }

    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_inbox_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

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

    private static Task NoOpHandler(CancellationToken _) => Task.CompletedTask;

    [Fact]
    public async Task ProcessAsync_InvokesHandler_AndMarksCompleted_OnFirstDelivery()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var handlerCalls = 0;

        var processor = new InboxMessageProcessor(_context);

        var result = await processor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now,
            _ => { handlerCalls++; return Task.CompletedTask; });

        Assert.Equal(MessageProcessingOutcome.Processed, result.Outcome);
        Assert.Equal(1, handlerCalls);

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.InboxMessages.SingleAsync(m => m.MessageId == messageId);
        Assert.Equal(InboxMessageStatus.Completed, stored.Status);
        Assert.Equal(now, stored.CompletedAtUtc);
    }

    [Fact]
    public async Task ProcessAsync_DuplicateDeliveryAfterCompletion_DoesNotInvokeHandlerAgain()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var handlerCalls = 0;

        var processor = new InboxMessageProcessor(_context);
        Task Handler(CancellationToken _) { handlerCalls++; return Task.CompletedTask; }

        await processor.ProcessAsync(messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now, Handler);

        await using var secondContext = CreateContext();
        var secondProcessor = new InboxMessageProcessor(secondContext);
        var secondResult = await secondProcessor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now.AddSeconds(1), Handler);

        Assert.Equal(MessageProcessingOutcome.AlreadyProcessed, secondResult.Outcome);
        Assert.Equal(1, handlerCalls);
    }

    [Fact]
    public async Task ProcessAsync_TransientFailure_ReleasesForRetry_AndSucceedsOnRedelivery()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;

        var processor = new InboxMessageProcessor(_context);

        var firstResult = await processor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now,
            _ => throw new InvalidOperationException("downstream unavailable"));

        Assert.Equal(MessageProcessingOutcome.TransientFailure, firstResult.Outcome);
        Assert.Equal("downstream unavailable", firstResult.FailureReason);

        await using var midContext = CreateContext();
        var midStored = await midContext.InboxMessages.SingleAsync(m => m.MessageId == messageId);
        Assert.Equal(InboxMessageStatus.Received, midStored.Status);
        Assert.Equal(1, midStored.AttemptCount);

        await using var secondContext = CreateContext();
        var secondProcessor = new InboxMessageProcessor(secondContext);
        var handlerCalls = 0;

        var secondResult = await secondProcessor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now.AddSeconds(1),
            _ => { handlerCalls++; return Task.CompletedTask; });

        Assert.Equal(MessageProcessingOutcome.Processed, secondResult.Outcome);
        Assert.Equal(1, handlerCalls);

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.InboxMessages.SingleAsync(m => m.MessageId == messageId);
        Assert.Equal(InboxMessageStatus.Completed, stored.Status);
        Assert.Equal(1, stored.AttemptCount);
    }

    [Fact]
    public async Task ProcessAsync_PermanentFailure_MarksFailed_AndDoesNotRetryOnRedelivery()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var handlerCalls = 0;

        var processor = new InboxMessageProcessor(_context);
        Task Handler(CancellationToken _)
        {
            handlerCalls++;
            throw new PermanentMessageProcessingException("validation failed");
        }

        var firstResult = await processor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now, Handler);

        Assert.Equal(MessageProcessingOutcome.PermanentFailure, firstResult.Outcome);
        Assert.Equal("validation failed", firstResult.FailureReason);

        await using var secondContext = CreateContext();
        var secondProcessor = new InboxMessageProcessor(secondContext);

        var secondResult = await secondProcessor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now.AddSeconds(1), Handler);

        Assert.Equal(MessageProcessingOutcome.AlreadyPermanentlyFailed, secondResult.Outcome);
        Assert.Equal(1, handlerCalls);

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.InboxMessages.SingleAsync(m => m.MessageId == messageId);
        Assert.Equal(InboxMessageStatus.Failed, stored.Status);
    }

    [Fact]
    public async Task ProcessAsync_ConcurrentFirstDelivery_OnlyOneCallerInvokesTheHandler()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var handlerCalls = 0;

        await using var contextA = CreateContext();
        await using var contextB = CreateContext();

        var processorA = new InboxMessageProcessor(contextA);
        var processorB = new InboxMessageProcessor(contextB);

        Task Handler(CancellationToken _) { Interlocked.Increment(ref handlerCalls); return Task.CompletedTask; }

        var taskA = processorA.ProcessAsync(messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now, Handler);
        var taskB = processorB.ProcessAsync(messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now, Handler);

        var results = await Task.WhenAll(taskA, taskB);

        Assert.Equal(1, handlerCalls);
        Assert.Contains(results, r => r.Outcome == MessageProcessingOutcome.Processed);
        Assert.Contains(results, r => r.Outcome == MessageProcessingOutcome.ConcurrentlyProcessing);
    }

    [Fact]
    public async Task ProcessAsync_ConcurrentRetryAfterTransientFailure_IsConcurrencySafe()
    {
        var messageId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;

        var setupProcessor = new InboxMessageProcessor(_context);
        await setupProcessor.ProcessAsync(
            messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now,
            _ => throw new InvalidOperationException("downstream unavailable"));

        var handlerCalls = 0;
        Task Handler(CancellationToken _) { Interlocked.Increment(ref handlerCalls); return Task.CompletedTask; }

        await using var contextA = CreateContext();
        await using var contextB = CreateContext();

        var processorA = new InboxMessageProcessor(contextA);
        var processorB = new InboxMessageProcessor(contextB);

        var taskA = processorA.ProcessAsync(messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now.AddSeconds(1), Handler);
        var taskB = processorB.ProcessAsync(messageId, "EngagementPhaseChanged", 1, "engagement-consumer", now.AddSeconds(1), Handler);

        var results = await Task.WhenAll(taskA, taskB);

        Assert.Equal(1, handlerCalls);
        Assert.Contains(results, r => r.Outcome == MessageProcessingOutcome.Processed);
        Assert.Contains(results, r => r.Outcome == MessageProcessingOutcome.ConcurrentlyProcessing);
    }
}
