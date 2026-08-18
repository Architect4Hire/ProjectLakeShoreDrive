using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementConfigurationTests
{
    // In-memory provider is used only to build and read EF model metadata (table/column
    // mapping, required-ness, concurrency token, index shape) — not to assert SQL Server
    // query/transaction behavior, which database.md reserves for a real SQL provider.
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<Domain.Engagement> Engagements => Set<Domain.Engagement>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new EngagementConfiguration());
        }
    }

    private static TestDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TestDbContext(options);
    }

    private static IReadOnlyEntityType EngagementEntityType(TestDbContext context) =>
        context.Model.FindEntityType(typeof(Domain.Engagement))!;

    [Fact]
    public void Engagement_MapsToEngagementsTable()
    {
        using var context = CreateContext();

        Assert.Equal("Engagements", EngagementEntityType(context).GetTableName());
    }

    [Fact]
    public void Engagement_HasIdAsPrimaryKey()
    {
        using var context = CreateContext();

        var primaryKey = EngagementEntityType(context).FindPrimaryKey();

        Assert.NotNull(primaryKey);
        Assert.Equal([nameof(Domain.Engagement.Id)], primaryKey.Properties.Select(p => p.Name));
    }

    [Fact]
    public void Engagement_Id_IsConvertedFromEngagementIdToGuid_AndNeverDatabaseGenerated()
    {
        using var context = CreateContext();

        var idProperty = EngagementEntityType(context).FindProperty(nameof(Domain.Engagement.Id))!;

        Assert.Equal(ValueGenerated.Never, idProperty.ValueGenerated);
        Assert.NotNull(idProperty.GetValueConverter());
        Assert.Equal(typeof(Guid), idProperty.GetValueConverter()!.ProviderClrType);
    }

    [Theory]
    [InlineData(nameof(Domain.Engagement.Name))]
    [InlineData(nameof(Domain.Engagement.Type))]
    [InlineData(nameof(Domain.Engagement.BusinessProblem))]
    [InlineData(nameof(Domain.Engagement.Confidentiality))]
    [InlineData(nameof(Domain.Engagement.Status))]
    [InlineData(nameof(Domain.Engagement.CreatedAtUtc))]
    public void Engagement_RequiredFields_AreNotNullable(string propertyName)
    {
        using var context = CreateContext();

        var property = EngagementEntityType(context).FindProperty(propertyName)!;

        Assert.False(property.IsNullable, $"{propertyName} must be mapped as non-nullable (BR-020 required fields).");
    }

    [Theory]
    [InlineData(nameof(Domain.Engagement.CurrentStateSummary))]
    [InlineData(nameof(Domain.Engagement.TargetStateSummary))]
    [InlineData(nameof(Domain.Engagement.ArchivedAtUtc))]
    public void Engagement_OptionalFields_AreNullable(string propertyName)
    {
        using var context = CreateContext();

        var property = EngagementEntityType(context).FindProperty(propertyName)!;

        Assert.True(property.IsNullable, $"{propertyName} is optional and must not be captured at creation.");
    }

    [Fact]
    public void Engagement_RowVersion_IsConfiguredAsConcurrencyToken()
    {
        using var context = CreateContext();

        var property = EngagementEntityType(context).FindProperty(nameof(Domain.Engagement.RowVersion))!;

        Assert.True(property.IsConcurrencyToken,
            "RowVersion must be a concurrency token so concurrent lifecycle transitions are detected (TR-DATA-001).");
    }

    [Fact]
    public void Engagement_Client_IsOwnedInTheSameTable()
    {
        using var context = CreateContext();

        var navigation = EngagementEntityType(context).FindNavigation(nameof(Domain.Engagement.Client))!;

        Assert.True(navigation.TargetEntityType.IsOwned());
        Assert.Equal("Engagements", navigation.TargetEntityType.GetTableName());
        Assert.False(navigation.TargetEntityType.FindProperty(nameof(ClientReference.ClientId))!.IsNullable);
        Assert.False(navigation.TargetEntityType.FindProperty(nameof(ClientReference.Name))!.IsNullable);
    }

    [Fact]
    public void Engagement_Client_IsRequired()
    {
        using var context = CreateContext();

        var navigation = EngagementEntityType(context).FindNavigation(nameof(Domain.Engagement.Client))!;

        Assert.True(navigation.ForeignKey.IsRequired, "Every engagement must reference a client (BR-020).");
    }

    [Fact]
    public void Engagement_HasIndexOnClientId()
    {
        using var context = CreateContext();

        var hasClientIndex = EngagementEntityType(context)
            .FindNavigation(nameof(Domain.Engagement.Client))!
            .TargetEntityType
            .GetIndexes()
            .Any(index => index.GetDatabaseName() == "IX_Engagements_ClientId");

        Assert.True(hasClientIndex, "A ClientId index is required to list engagements for a given client.");
    }

    [Fact]
    public void Engagement_Timeline_IsOptional()
    {
        using var context = CreateContext();

        var navigation = EngagementEntityType(context).FindNavigation(nameof(Domain.Engagement.Timeline))!;

        Assert.True(navigation.TargetEntityType.IsOwned());
        Assert.Equal("Engagements", navigation.TargetEntityType.GetTableName());
        Assert.False(navigation.ForeignKey.IsRequiredDependent,
            "An engagement may not have a timeline yet (still in Draft), so Timeline must be optional.");
    }

    [Theory]
    [InlineData(nameof(Domain.Engagement.BusinessObjectives), "_businessObjectives")]
    [InlineData(nameof(Domain.Engagement.KnownTechnologyLandscape), "_knownTechnologyLandscape")]
    [InlineData(nameof(Domain.Engagement.Constraints), "_constraints")]
    [InlineData(nameof(Domain.Engagement.RequestedDeliverables), "_requestedDeliverables")]
    public void Engagement_StringListFields_AreMappedAsPrimitiveCollectionsViaBackingField(
        string propertyName, string fieldName)
    {
        using var context = CreateContext();

        var property = EngagementEntityType(context).FindProperty(propertyName)!;

        Assert.True(property.IsPrimitiveCollection);
        Assert.Equal(fieldName, property.FieldInfo?.Name);
        Assert.Equal(PropertyAccessMode.Field, property.GetPropertyAccessMode());
    }

    [Fact]
    public void Engagement_Stakeholders_AreOwnedInASeparateTable_KeyedByEngagementId()
    {
        using var context = CreateContext();

        var navigation = EngagementEntityType(context).FindNavigation(nameof(Domain.Engagement.Stakeholders))!;
        var target = navigation.TargetEntityType;

        Assert.Equal("EngagementStakeholders", target.GetTableName());
        Assert.Equal("_stakeholders", navigation.FieldInfo?.Name);
        Assert.Contains("EngagementId", navigation.ForeignKey.Properties.Select(p => p.Name));
        Assert.False(target.FindProperty(nameof(Stakeholder.Name))!.IsNullable);
        Assert.False(target.FindProperty(nameof(Stakeholder.Role))!.IsNullable);
        Assert.True(target.FindProperty(nameof(Stakeholder.Email))!.IsNullable);
    }

    [Fact]
    public void Engagement_LifecycleHistory_AreOwnedInASeparateTable_KeyedByEngagementId()
    {
        using var context = CreateContext();

        var navigation = EngagementEntityType(context).FindNavigation(nameof(Domain.Engagement.LifecycleHistory))!;
        var target = navigation.TargetEntityType;

        Assert.Equal("EngagementLifecycleTransitions", target.GetTableName());
        Assert.Equal("_lifecycleHistory", navigation.FieldInfo?.Name);
        Assert.Contains("EngagementId", navigation.ForeignKey.Properties.Select(p => p.Name));
        Assert.False(target.FindProperty(nameof(EngagementLifecycleTransition.FromStatus))!.IsNullable);
        Assert.False(target.FindProperty(nameof(EngagementLifecycleTransition.ToStatus))!.IsNullable);
        Assert.False(target.FindProperty(nameof(EngagementLifecycleTransition.PerformedBy))!.IsNullable);
        Assert.True(target.FindProperty(nameof(EngagementLifecycleTransition.Reason))!.IsNullable);
    }

    [Fact]
    public void Engagement_LifecycleHistory_HasIndexOnEngagementIdAndOccurredAtUtc()
    {
        using var context = CreateContext();

        var target = EngagementEntityType(context)
            .FindNavigation(nameof(Domain.Engagement.LifecycleHistory))!
            .TargetEntityType;

        var hasIndex = target.GetIndexes()
            .Any(index => index.GetDatabaseName() == "IX_EngagementLifecycleTransitions_EngagementId_OccurredAtUtc");

        Assert.True(hasIndex, "An (EngagementId, OccurredAtUtc) index supports reading a workspace's audit history in order (BR-023).");
    }

    [Fact]
    public void Engagement_HasIndexOnStatusAndCreatedAtUtc()
    {
        using var context = CreateContext();

        var hasIndex = EngagementEntityType(context)
            .GetIndexes()
            .Any(index => index.GetDatabaseName() == "IX_Engagements_Status_CreatedAtUtc");

        Assert.True(hasIndex, "A (Status, CreatedAtUtc) index supports listing engagements by lifecycle phase (BR-023).");
    }
}
