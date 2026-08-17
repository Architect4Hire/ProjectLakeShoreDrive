using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class DeadLetterRegistryTests
{
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<DeadLetteredMessage> DeadLetteredMessages => Set<DeadLetteredMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new DeadLetteredMessageConfiguration());
        }
    }

    private static TestDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TestDbContext(options);
    }

    [Fact]
    public async Task RecordDeadLetteredMessageAsync_CreatesRecord()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var messageId = Guid.NewGuid();
        var correlationId = Guid.NewGuid();
        var causationId = Guid.NewGuid();

        await registry.RecordDeadLetteredMessageAsync(
            messageId: messageId,
            correlationId: correlationId,
            causationId: causationId,
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "OrderService",
            occurredAtUtc: DateTimeOffset.UtcNow.AddHours(-1),
            receivedAtUtc: DateTimeOffset.UtcNow.AddMinutes(-30),
            attemptCount: 5,
            deadLetterReason: "timeout",
            deadLetterDescription: "Service timeout after 30s",
            businessKey: "order-123");

        var record = await registry.GetByMessageIdAsync(messageId);

        Assert.NotNull(record);
        Assert.Equal(messageId, record.MessageId);
        Assert.Equal(correlationId, record.CorrelationId);
        Assert.Equal(causationId, record.CausationId);
        Assert.Equal("OrderCreated", record.EventType);
        Assert.Equal(1, record.EventVersion);
        Assert.Equal("OrderProcessor", record.Consumer);
        Assert.Equal("OrderService", record.Producer);
        Assert.Equal(5, record.AttemptCount);
        Assert.Equal("timeout", record.DeadLetterReason);
        Assert.Equal("Service timeout after 30s", record.DeadLetterDescription);
        Assert.Equal("order-123", record.BusinessKey);
        Assert.Equal(DeadLetterTriageStatus.Unreviewed, record.TriageStatus);
    }

    [Fact]
    public async Task RecordDeadLetteredMessageAsync_IsIdempotent()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var messageId = Guid.NewGuid();
        var correlationId = Guid.NewGuid();

        // Record the same message twice.
        await registry.RecordDeadLetteredMessageAsync(
            messageId: messageId,
            correlationId: correlationId,
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "OrderService",
            occurredAtUtc: DateTimeOffset.UtcNow.AddHours(-1),
            receivedAtUtc: DateTimeOffset.UtcNow.AddMinutes(-30),
            attemptCount: 5,
            deadLetterReason: "timeout");

        // Should not throw; second call is silently idempotent.
        await registry.RecordDeadLetteredMessageAsync(
            messageId: messageId,
            correlationId: correlationId,
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "OrderService",
            occurredAtUtc: DateTimeOffset.UtcNow.AddHours(-1),
            receivedAtUtc: DateTimeOffset.UtcNow.AddMinutes(-30),
            attemptCount: 5,
            deadLetterReason: "timeout");

        var records = await _countRecordsAsync(context);
        Assert.Equal(1, records);
    }

    [Fact]
    public async Task GetUnreviewedAsync_ReturnsUnreviewedMessagesInOrder()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var now = DateTimeOffset.UtcNow;

        // Create messages with staggered timestamps.
        for (int i = 0; i < 3; i++)
        {
            await registry.RecordDeadLetteredMessageAsync(
                messageId: Guid.NewGuid(),
                correlationId: Guid.NewGuid(),
                eventType: "OrderCreated",
                eventVersion: 1,
                consumer: "OrderProcessor",
                producer: "OrderService",
                occurredAtUtc: now,
                receivedAtUtc: now.AddSeconds(i * 10),
                attemptCount: 5,
                deadLetterReason: "timeout");
        }

        var unreviewed = await registry.GetUnreviewedAsync();

        Assert.Equal(3, unreviewed.Count);
        // Ordered oldest first.
        Assert.True(unreviewed[0].DeadLetteredAtUtc <= unreviewed[1].DeadLetteredAtUtc);
        Assert.True(unreviewed[1].DeadLetteredAtUtc <= unreviewed[2].DeadLetteredAtUtc);
    }

    [Fact]
    public async Task GetUnreviewedAsync_RespectsMaxResults()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        for (int i = 0; i < 5; i++)
        {
            await registry.RecordDeadLetteredMessageAsync(
                messageId: Guid.NewGuid(),
                correlationId: Guid.NewGuid(),
                eventType: "OrderCreated",
                eventVersion: 1,
                consumer: "OrderProcessor",
                producer: "OrderService",
                occurredAtUtc: DateTimeOffset.UtcNow,
                receivedAtUtc: DateTimeOffset.UtcNow,
                attemptCount: 5,
                deadLetterReason: "timeout");
        }

        var unreviewed = await registry.GetUnreviewedAsync(maxResults: 2);

        Assert.Equal(2, unreviewed.Count);
    }

    [Fact]
    public async Task GetByConsumerAsync_FiltersMessages()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        for (int i = 0; i < 3; i++)
        {
            await registry.RecordDeadLetteredMessageAsync(
                messageId: Guid.NewGuid(),
                correlationId: Guid.NewGuid(),
                eventType: "OrderCreated",
                eventVersion: 1,
                consumer: i % 2 == 0 ? "OrderProcessor" : "PaymentProcessor",
                producer: "Service",
                occurredAtUtc: DateTimeOffset.UtcNow,
                receivedAtUtc: DateTimeOffset.UtcNow,
                attemptCount: 5,
                deadLetterReason: "timeout");
        }

        var orderProcessorMessages = await registry.GetByConsumerAsync("OrderProcessor");

        Assert.Equal(2, orderProcessorMessages.Count);
        Assert.All(orderProcessorMessages, m => Assert.Equal("OrderProcessor", m.Consumer));
    }

    [Fact]
    public async Task GetByBusinessKeyAsync_FiltersMessages()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        for (int i = 0; i < 3; i++)
        {
            await registry.RecordDeadLetteredMessageAsync(
                messageId: Guid.NewGuid(),
                correlationId: Guid.NewGuid(),
                eventType: "OrderCreated",
                eventVersion: 1,
                consumer: "OrderProcessor",
                producer: "Service",
                occurredAtUtc: DateTimeOffset.UtcNow,
                receivedAtUtc: DateTimeOffset.UtcNow,
                attemptCount: 5,
                deadLetterReason: "timeout",
                businessKey: "order-123");
        }

        var messages = await registry.GetByBusinessKeyAsync("order-123");

        Assert.Equal(3, messages.Count);
    }

    [Fact]
    public async Task UpdateTriageAsync_UpdatesStatusAndNotes()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var messageId = Guid.NewGuid();

        await registry.RecordDeadLetteredMessageAsync(
            messageId: messageId,
            correlationId: Guid.NewGuid(),
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "Service",
            occurredAtUtc: DateTimeOffset.UtcNow,
            receivedAtUtc: DateTimeOffset.UtcNow,
            attemptCount: 5,
            deadLetterReason: "timeout");

        await registry.UpdateTriageAsync(
            messageId: messageId,
            triageStatus: DeadLetterTriageStatus.EligibleForReplay,
            triageNotes: "Service recovered; message can be replayed.",
            reviewedBy: "ops-team");

        var updated = await registry.GetByMessageIdAsync(messageId);

        Assert.NotNull(updated);
        Assert.Equal(DeadLetterTriageStatus.EligibleForReplay, updated.TriageStatus);
        Assert.Equal("Service recovered; message can be replayed.", updated.TriageNotes);
        Assert.Equal("ops-team", updated.ReviewedBy);
        Assert.NotNull(updated.ReviewedAtUtc);
    }

    [Fact]
    public async Task UpdateTriageAsync_ThrowsIfMessageNotFound()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await registry.UpdateTriageAsync(
                messageId: Guid.NewGuid(),
                triageStatus: DeadLetterTriageStatus.EligibleForReplay,
                triageNotes: null,
                reviewedBy: "ops-team"));

        Assert.Contains("not found", ex.Message);
    }

    [Fact]
    public async Task GetEligibleForReplayAsync_ReturnsEligibleMessages()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var message1Id = Guid.NewGuid();
        var message2Id = Guid.NewGuid();

        await registry.RecordDeadLetteredMessageAsync(
            messageId: message1Id,
            correlationId: Guid.NewGuid(),
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "Service",
            occurredAtUtc: DateTimeOffset.UtcNow,
            receivedAtUtc: DateTimeOffset.UtcNow,
            attemptCount: 5,
            deadLetterReason: "timeout");

        await registry.RecordDeadLetteredMessageAsync(
            messageId: message2Id,
            correlationId: Guid.NewGuid(),
            eventType: "PaymentCreated",
            eventVersion: 1,
            consumer: "PaymentProcessor",
            producer: "Service",
            occurredAtUtc: DateTimeOffset.UtcNow,
            receivedAtUtc: DateTimeOffset.UtcNow,
            attemptCount: 5,
            deadLetterReason: "timeout");

        // Mark one as eligible.
        await registry.UpdateTriageAsync(
            messageId: message1Id,
            triageStatus: DeadLetterTriageStatus.EligibleForReplay,
            triageNotes: null,
            reviewedBy: "ops");

        var eligible = await registry.GetEligibleForReplayAsync();

        Assert.Single(eligible);
        Assert.Equal(message1Id, eligible[0].MessageId);
    }

    [Fact]
    public async Task GetByTriageStatusAsync_ReturnsMessagesInStatus()
    {
        using var context = CreateContext();
        var registry = new DeadLetterRegistry(context);

        var message1Id = Guid.NewGuid();
        var message2Id = Guid.NewGuid();

        await registry.RecordDeadLetteredMessageAsync(
            messageId: message1Id,
            correlationId: Guid.NewGuid(),
            eventType: "OrderCreated",
            eventVersion: 1,
            consumer: "OrderProcessor",
            producer: "Service",
            occurredAtUtc: DateTimeOffset.UtcNow,
            receivedAtUtc: DateTimeOffset.UtcNow,
            attemptCount: 5,
            deadLetterReason: "timeout");

        await registry.RecordDeadLetteredMessageAsync(
            messageId: message2Id,
            correlationId: Guid.NewGuid(),
            eventType: "PaymentCreated",
            eventVersion: 1,
            consumer: "PaymentProcessor",
            producer: "Service",
            occurredAtUtc: DateTimeOffset.UtcNow,
            receivedAtUtc: DateTimeOffset.UtcNow,
            attemptCount: 5,
            deadLetterReason: "timeout");

        // Mark one as ineligible.
        await registry.UpdateTriageAsync(
            messageId: message2Id,
            triageStatus: DeadLetterTriageStatus.IneligibleForReplay,
            triageNotes: null,
            reviewedBy: "ops");

        var ineligible = await registry.GetByTriageStatusAsync(DeadLetterTriageStatus.IneligibleForReplay);

        Assert.Single(ineligible);
        Assert.Equal(message2Id, ineligible[0].MessageId);
    }

    private static async Task<int> _countRecordsAsync(TestDbContext context)
    {
        return await context.DeadLetteredMessages.CountAsync();
    }
}
