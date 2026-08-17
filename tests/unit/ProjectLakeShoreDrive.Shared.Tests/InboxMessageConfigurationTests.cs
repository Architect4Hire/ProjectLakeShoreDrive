using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ProjectLakeShoreDrive.Shared.Persistence.Inbox;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class InboxMessageConfigurationTests
{
    // In-memory provider is used only to build and read EF model metadata (table/column
    // mapping, required-ness, concurrency token, index shape) — not to assert SQL Server
    // query/transaction behavior, which database.md reserves for a real SQL provider.
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<InboxMessage> InboxMessages => Set<InboxMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new InboxMessageConfiguration());
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
    public void InboxMessage_MapsToInboxMessagesTable()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;

        Assert.Equal("InboxMessages", entityType.GetTableName());
    }

    [Fact]
    public void InboxMessage_HasMessageIdAsPrimaryKey()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;
        var primaryKey = entityType.FindPrimaryKey();

        Assert.NotNull(primaryKey);
        Assert.Equal([nameof(InboxMessage.MessageId)], primaryKey.Properties.Select(p => p.Name));
    }

    [Fact]
    public void InboxMessage_MessageId_IsNeverDatabaseGenerated()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;
        var idProperty = entityType.FindProperty(nameof(InboxMessage.MessageId))!;

        Assert.Equal(ValueGenerated.Never, idProperty.ValueGenerated);
    }

    [Theory]
    [InlineData(nameof(InboxMessage.MessageId))]
    [InlineData(nameof(InboxMessage.EventType))]
    [InlineData(nameof(InboxMessage.EventVersion))]
    [InlineData(nameof(InboxMessage.Consumer))]
    [InlineData(nameof(InboxMessage.ReceivedAtUtc))]
    [InlineData(nameof(InboxMessage.Status))]
    [InlineData(nameof(InboxMessage.AttemptCount))]
    public void InboxMessage_RequiredFields_AreNotNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.False(property.IsNullable, $"{propertyName} should be mapped as non-nullable (dedup identity and processing-state fields must always be present).");
    }

    [Theory]
    [InlineData(nameof(InboxMessage.ProcessingStartedAtUtc))]
    [InlineData(nameof(InboxMessage.CompletedAtUtc))]
    [InlineData(nameof(InboxMessage.Outcome))]
    [InlineData(nameof(InboxMessage.FailureReason))]
    public void InboxMessage_OptionalFields_AreNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.True(property.IsNullable, $"{propertyName} is optional (not every message has started/completed processing, or has an outcome/failure yet).");
    }

    [Fact]
    public void InboxMessage_RowVersion_IsConfiguredAsConcurrencyToken()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;
        var property = entityType.FindProperty(nameof(InboxMessage.RowVersion))!;

        Assert.True(property.IsConcurrencyToken, "RowVersion must be a concurrency token so concurrent processing-state updates do not silently overwrite each other.");
    }

    [Fact]
    public void InboxMessage_HasIndexOnStatusAndReceivedAtUtc()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(InboxMessage))!;

        var hasStatusIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual([nameof(InboxMessage.Status), nameof(InboxMessage.ReceivedAtUtc)]));

        Assert.True(hasStatusIndex, "A (Status, ReceivedAtUtc) index is required to support a future consumer's processing-state lookup without a full table scan.");
    }
}
