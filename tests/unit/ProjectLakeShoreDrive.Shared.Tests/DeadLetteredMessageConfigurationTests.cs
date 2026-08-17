using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class DeadLetteredMessageConfigurationTests
{
    // In-memory provider is used only to build and read EF model metadata (table/column
    // mapping, required-ness, concurrency token, index shape) — not to assert SQL Server
    // query/transaction behavior, which database.md reserves for a real SQL provider.
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
    public void DeadLetteredMessage_MapsToDeadLetteredMessagesTable()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;

        Assert.Equal("DeadLetteredMessages", entityType.GetTableName());
    }

    [Fact]
    public void DeadLetteredMessage_HasMessageIdAsPrimaryKey()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;
        var primaryKey = entityType.FindPrimaryKey();

        Assert.NotNull(primaryKey);
        Assert.Equal([nameof(DeadLetteredMessage.MessageId)], primaryKey.Properties.Select(p => p.Name));
    }

    [Fact]
    public void DeadLetteredMessage_MessageId_IsNeverDatabaseGenerated()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;
        var idProperty = entityType.FindProperty(nameof(DeadLetteredMessage.MessageId))!;

        Assert.Equal(ValueGenerated.Never, idProperty.ValueGenerated);
    }

    [Theory]
    [InlineData(nameof(DeadLetteredMessage.MessageId))]
    [InlineData(nameof(DeadLetteredMessage.CorrelationId))]
    [InlineData(nameof(DeadLetteredMessage.EventType))]
    [InlineData(nameof(DeadLetteredMessage.EventVersion))]
    [InlineData(nameof(DeadLetteredMessage.Consumer))]
    [InlineData(nameof(DeadLetteredMessage.Producer))]
    [InlineData(nameof(DeadLetteredMessage.OccurredAtUtc))]
    [InlineData(nameof(DeadLetteredMessage.ReceivedAtUtc))]
    [InlineData(nameof(DeadLetteredMessage.DeadLetteredAtUtc))]
    [InlineData(nameof(DeadLetteredMessage.AttemptCount))]
    [InlineData(nameof(DeadLetteredMessage.DeadLetterReason))]
    [InlineData(nameof(DeadLetteredMessage.TriageStatus))]
    public void DeadLetteredMessage_RequiredFields_AreNotNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.False(property.IsNullable,
            $"{propertyName} should be mapped as non-nullable (dedup, triage state, and operational fields must always be present).");
    }

    [Theory]
    [InlineData(nameof(DeadLetteredMessage.CausationId))]
    [InlineData(nameof(DeadLetteredMessage.DeadLetterDescription))]
    [InlineData(nameof(DeadLetteredMessage.BusinessKey))]
    [InlineData(nameof(DeadLetteredMessage.TriageNotes))]
    [InlineData(nameof(DeadLetteredMessage.ReviewedBy))]
    [InlineData(nameof(DeadLetteredMessage.ReviewedAtUtc))]
    public void DeadLetteredMessage_OptionalFields_AreNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.True(property.IsNullable,
            $"{propertyName} is optional (not every message has causation, description, business key, or triage notes yet).");
    }

    [Fact]
    public void DeadLetteredMessage_RowVersion_IsConfiguredAsConcurrencyToken()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;
        var property = entityType.FindProperty(nameof(DeadLetteredMessage.RowVersion))!;

        Assert.True(property.IsConcurrencyToken,
            "RowVersion must be a concurrency token so concurrent triage-state updates do not silently overwrite each other.");
    }

    [Fact]
    public void DeadLetteredMessage_HasIndexOnTriageStatusAndDeadLetteredAtUtc()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;

        var hasTriageIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual(
                [nameof(DeadLetteredMessage.TriageStatus), nameof(DeadLetteredMessage.DeadLetteredAtUtc)]));

        Assert.True(hasTriageIndex,
            "A (TriageStatus, DeadLetteredAtUtc) index is required for efficient triage queue queries.");
    }

    [Fact]
    public void DeadLetteredMessage_HasIndexOnCorrelationId()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;

        var hasCorrelationIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual([nameof(DeadLetteredMessage.CorrelationId)]));

        Assert.True(hasCorrelationIndex,
            "A CorrelationId index is required for tracing across asynchronous boundaries.");
    }

    [Fact]
    public void DeadLetteredMessage_HasIndexOnConsumerAndDeadLetteredAtUtc()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;

        var hasConsumerIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual(
                [nameof(DeadLetteredMessage.Consumer), nameof(DeadLetteredMessage.DeadLetteredAtUtc)]));

        Assert.True(hasConsumerIndex,
            "A (Consumer, DeadLetteredAtUtc) index is required for operational grouping by subscriber.");
    }

    [Fact]
    public void DeadLetteredMessage_HasIndexOnBusinessKey()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(DeadLetteredMessage))!;

        var hasBusinessKeyIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual([nameof(DeadLetteredMessage.BusinessKey)]));

        Assert.True(hasBusinessKeyIndex,
            "A BusinessKey index is required for domain-level impact analysis.");
    }
}
