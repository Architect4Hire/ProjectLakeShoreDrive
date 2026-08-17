using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Shared.Integration.Tests;

// Runs against a real SQL Server (LocalDB) instance, not EF InMemory (database.md: "Do not
// treat EF InMemory as proof of SQL behavior"). Concurrency-safe leasing depends on real
// SQL Server rowversion/optimistic-concurrency semantics, which InMemory does not enforce.
public sealed class OutboxRepositoryTests : IAsyncLifetime
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
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_outbox_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

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
        PayloadJson = "{}",
        CorrelationId = Guid.NewGuid(),
        Producer = "Engagement",
        OccurredAtUtc = createdAtUtc,
        CreatedAtUtc = createdAtUtc,
    };

    [Fact]
    public async Task LeasePendingBatchAsync_LeasesOnlyUpToBatchSize()
    {
        var now = DateTimeOffset.UtcNow;
        _context.OutboxMessages.AddRange(NewMessage(now), NewMessage(now.AddSeconds(1)), NewMessage(now.AddSeconds(2)));
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        var leased = await repository.LeasePendingBatchAsync("relay-1", batchSize: 2, TimeSpan.FromMinutes(1), now.AddSeconds(3));

        Assert.Equal(2, leased.Count);
    }

    [Fact]
    public async Task LeasePendingBatchAsync_LeasesOldestFirst()
    {
        var now = DateTimeOffset.UtcNow;
        var older = NewMessage(now);
        var newer = NewMessage(now.AddSeconds(5));
        _context.OutboxMessages.AddRange(newer, older);
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        var leased = await repository.LeasePendingBatchAsync("relay-1", batchSize: 1, TimeSpan.FromMinutes(1), now.AddSeconds(10));

        Assert.Equal(older.Id, Assert.Single(leased).Id);
    }

    [Fact]
    public async Task LeasePendingBatchAsync_DoesNotRelease_ActivelyLeasedRow()
    {
        var now = DateTimeOffset.UtcNow;
        _context.OutboxMessages.Add(NewMessage(now));
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        await repository.LeasePendingBatchAsync("relay-1", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));

        await using var secondContext = CreateContext();
        var secondRepository = new OutboxRepository(secondContext);
        var leasedAgain = await secondRepository.LeasePendingBatchAsync("relay-2", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(2));

        Assert.Empty(leasedAgain);
    }

    [Fact]
    public async Task LeasePendingBatchAsync_ReLeasesRow_AfterLeaseExpires()
    {
        var now = DateTimeOffset.UtcNow;
        _context.OutboxMessages.Add(NewMessage(now));
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        await repository.LeasePendingBatchAsync("relay-1", batchSize: 10, TimeSpan.FromSeconds(1), now);

        await using var secondContext = CreateContext();
        var secondRepository = new OutboxRepository(secondContext);
        var leasedAfterExpiry = await secondRepository.LeasePendingBatchAsync("relay-2", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(2));

        Assert.Single(leasedAfterExpiry);
        Assert.Equal("relay-2", leasedAfterExpiry[0].LeasedBy);
    }

    [Fact]
    public async Task LeasePendingBatchAsync_IsConcurrencySafe_WhenTwoLeasesRaceForTheSameRow()
    {
        var now = DateTimeOffset.UtcNow;
        _context.OutboxMessages.Add(NewMessage(now));
        await _context.SaveChangesAsync();

        await using var contextA = CreateContext();
        await using var contextB = CreateContext();

        var repositoryA = new OutboxRepository(contextA);
        var repositoryB = new OutboxRepository(contextB);

        var taskA = repositoryA.LeasePendingBatchAsync("relay-a", 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));
        var taskB = repositoryB.LeasePendingBatchAsync("relay-b", 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));

        var results = await Task.WhenAll(taskA, taskB);

        Assert.Equal(1, results.Sum(r => r.Count));
    }

    [Fact]
    public async Task MarkDispatchedAsync_SetsStatusAndClearsLease_WithoutDeletingTheRow()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        await repository.LeasePendingBatchAsync("relay-1", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));
        await repository.MarkDispatchedAsync(message.Id, now.AddSeconds(2));

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.Set<OutboxMessage>().SingleAsync(m => m.Id == message.Id);

        Assert.Equal(OutboxMessageStatus.Dispatched, stored.Status);
        Assert.Equal(now.AddSeconds(2), stored.DispatchedAtUtc);
        Assert.Null(stored.LeasedBy);
        Assert.Null(stored.LeasedUntilUtc);
    }

    [Fact]
    public async Task RecordFailedAttemptAsync_IncrementsAttemptCountAndRecordsFailureMetadata()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        await repository.LeasePendingBatchAsync("relay-1", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));
        await repository.RecordFailedAttemptAsync(message.Id, "broker unavailable", now.AddSeconds(2));

        await using var verifyContext = CreateContext();
        var stored = await verifyContext.Set<OutboxMessage>().SingleAsync(m => m.Id == message.Id);

        Assert.Equal(1, stored.AttemptCount);
        Assert.Equal(now.AddSeconds(2), stored.LastAttemptAtUtc);
        Assert.Equal("broker unavailable", stored.LastError);
        Assert.Equal(OutboxMessageStatus.Pending, stored.Status);
        Assert.Null(stored.LeasedBy);
        Assert.Null(stored.LeasedUntilUtc);
    }

    [Fact]
    public async Task RecordFailedAttemptAsync_ReleasesLease_SoTheRowIsImmediatelyEligibleAgain()
    {
        var now = DateTimeOffset.UtcNow;
        var message = NewMessage(now);
        _context.OutboxMessages.Add(message);
        await _context.SaveChangesAsync();

        var repository = new OutboxRepository(_context);
        await repository.LeasePendingBatchAsync("relay-1", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(1));
        await repository.RecordFailedAttemptAsync(message.Id, "broker unavailable", now.AddSeconds(2));

        await using var secondContext = CreateContext();
        var secondRepository = new OutboxRepository(secondContext);
        var leasedAgain = await secondRepository.LeasePendingBatchAsync("relay-2", batchSize: 10, TimeSpan.FromMinutes(5), now.AddSeconds(3));

        Assert.Single(leasedAgain);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task LeasePendingBatchAsync_Throws_ForNonPositiveBatchSize(int batchSize)
    {
        var repository = new OutboxRepository(_context);

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
            repository.LeasePendingBatchAsync("relay-1", batchSize, TimeSpan.FromMinutes(1), DateTimeOffset.UtcNow));
    }

    [Fact]
    public async Task LeasePendingBatchAsync_Throws_ForNonPositiveLeaseDuration()
    {
        var repository = new OutboxRepository(_context);

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
            repository.LeasePendingBatchAsync("relay-1", 1, TimeSpan.Zero, DateTimeOffset.UtcNow));
    }
}
