using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class OutboxMessageConfigurationTests
{
    // In-memory provider is used only to build and read EF model metadata (table/column
    // mapping, required-ness, concurrency token, index shape) — not to assert SQL Server
    // query/transaction behavior, which database.md reserves for a real SQL provider.
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OutboxMessageConfiguration());
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
    public void OutboxMessage_MapsToOutboxMessagesTable()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;

        Assert.Equal("OutboxMessages", entityType.GetTableName());
    }

    [Fact]
    public void OutboxMessage_HasIdAsPrimaryKey()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;
        var primaryKey = entityType.FindPrimaryKey();

        Assert.NotNull(primaryKey);
        Assert.Equal([nameof(OutboxMessage.Id)], primaryKey.Properties.Select(p => p.Name));
    }

    [Theory]
    [InlineData(nameof(OutboxMessage.Id))]
    [InlineData(nameof(OutboxMessage.EventType))]
    [InlineData(nameof(OutboxMessage.EventVersion))]
    [InlineData(nameof(OutboxMessage.PayloadJson))]
    [InlineData(nameof(OutboxMessage.CorrelationId))]
    [InlineData(nameof(OutboxMessage.Producer))]
    [InlineData(nameof(OutboxMessage.OccurredAtUtc))]
    [InlineData(nameof(OutboxMessage.CreatedAtUtc))]
    [InlineData(nameof(OutboxMessage.Status))]
    [InlineData(nameof(OutboxMessage.AttemptCount))]
    public void OutboxMessage_RequiredFields_AreNotNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.False(property.IsNullable, $"{propertyName} should be mapped as non-nullable (tracing/status durability fields must always be present).");
    }

    [Theory]
    [InlineData(nameof(OutboxMessage.CausationId))]
    [InlineData(nameof(OutboxMessage.BusinessKey))]
    [InlineData(nameof(OutboxMessage.LastAttemptAtUtc))]
    [InlineData(nameof(OutboxMessage.LastError))]
    [InlineData(nameof(OutboxMessage.DispatchedAtUtc))]
    [InlineData(nameof(OutboxMessage.LeasedBy))]
    [InlineData(nameof(OutboxMessage.LeasedUntilUtc))]
    public void OutboxMessage_OptionalFields_AreNullable(string propertyName)
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;
        var property = entityType.FindProperty(propertyName)!;

        Assert.True(property.IsNullable, $"{propertyName} is optional (not every message has a causation, error, dispatch, or active lease).");
    }

    [Fact]
    public void OutboxMessage_RowVersion_IsConfiguredAsConcurrencyToken()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;
        var property = entityType.FindProperty(nameof(OutboxMessage.RowVersion))!;

        Assert.True(property.IsConcurrencyToken, "RowVersion must be a concurrency token so concurrent lease/status updates from a relay do not silently overwrite each other.");
    }

    [Fact]
    public void OutboxMessage_HasIndexOnStatusAndCreatedAtUtc()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;

        var hasStatusIndex = entityType.GetIndexes().Any(index =>
            index.Properties.Select(p => p.Name).SequenceEqual([nameof(OutboxMessage.Status), nameof(OutboxMessage.CreatedAtUtc)]));

        Assert.True(hasStatusIndex, "A (Status, CreatedAtUtc) index is required to support a future relay's pending-batch query without a full table scan.");
    }

    [Fact]
    public void OutboxMessage_Id_IsNeverDatabaseGenerated()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(OutboxMessage))!;
        var idProperty = entityType.FindProperty(nameof(OutboxMessage.Id))!;

        Assert.Equal(ValueGenerated.Never, idProperty.ValueGenerated);
    }
}
