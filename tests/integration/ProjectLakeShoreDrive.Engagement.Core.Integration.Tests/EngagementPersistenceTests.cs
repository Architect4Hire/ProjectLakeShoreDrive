using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Core.Integration.Tests;

// Runs against a real SQL Server (LocalDB) instance, not EF InMemory (database.md: "Do not
// treat EF InMemory as proof of SQL behavior"). This proves the Engagement mapping produces
// valid SQL Server/Azure SQL schema (owned tables, JSON primitive-collection columns,
// rowversion concurrency token) and that the aggregate round-trips through EF Core.
public sealed class EngagementPersistenceTests : IAsyncLifetime
{
    private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
    {
        public DbSet<Domain.Engagement> Engagements => Set<Domain.Engagement>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new EngagementConfiguration());
        }
    }

    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_engagement_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

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

    private static Domain.Engagement NewEngagement()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso Retail"),
            "Contoso Cloud Migration",
            EngagementType.CloudMigration,
            "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            EngagementConfidentiality.ClientConfidential,
            currentStateSummary: "Monolithic ASP.NET app on-prem.",
            targetStateSummary: "Containerized services on Azure.",
            timeline: new EngagementTimeline(new DateOnly(2026, 1, 5), new DateOnly(2026, 6, 30)),
            businessObjectives: ["Reduce peak-season downtime", "Cut infrastructure cost by 20%"],
            knownTechnologyLandscape: [".NET Framework 4.8", "SQL Server 2016"],
            stakeholders: [new Stakeholder("Jane Doe", "VP Engineering", "jane@contoso.example")],
            constraints: ["Must remain PCI compliant"],
            requestedDeliverables: ["Architecture Vision", "Migration Roadmap"]);

        engagement.TransitionTo(EngagementStatus.Discovery, "pm@architect4hire.com", "Kickoff complete");

        return engagement;
    }

    [Fact]
    public async Task Engagement_RoundTripsThroughSqlServer_WithAllStructuredFields()
    {
        var engagement = NewEngagement();
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        var loaded = await verifyContext.Engagements
            .Include(e => e.Stakeholders)
            .Include(e => e.LifecycleHistory)
            .SingleAsync(e => e.Id == engagement.Id);

        Assert.Equal("Contoso Cloud Migration", loaded.Name);
        Assert.Equal(EngagementType.CloudMigration, loaded.Type);
        Assert.Equal(EngagementConfidentiality.ClientConfidential, loaded.Confidentiality);
        Assert.Equal(EngagementStatus.Discovery, loaded.Status);
        Assert.Equal("Contoso Retail", loaded.Client.Name);
        Assert.NotNull(loaded.Timeline);
        Assert.Equal(new DateOnly(2026, 1, 5), loaded.Timeline!.StartDate);
        Assert.Equal(
            new[] { "Reduce peak-season downtime", "Cut infrastructure cost by 20%" },
            loaded.BusinessObjectives);
        Assert.Equal([".NET Framework 4.8", "SQL Server 2016"], loaded.KnownTechnologyLandscape);
        Assert.Equal(["Must remain PCI compliant"], loaded.Constraints);
        Assert.Equal(["Architecture Vision", "Migration Roadmap"], loaded.RequestedDeliverables);
        Assert.Single(loaded.Stakeholders);
        Assert.Equal("Jane Doe", loaded.Stakeholders[0].Name);
        Assert.Single(loaded.LifecycleHistory);
        Assert.Equal(EngagementStatus.Draft, loaded.LifecycleHistory[0].FromStatus);
        Assert.Equal(EngagementStatus.Discovery, loaded.LifecycleHistory[0].ToStatus);
        Assert.NotNull(loaded.RowVersion);
    }

    [Fact]
    public async Task Engagement_WithoutTimeline_PersistsAsNullOwnedType()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Fabrikam"),
            "Fabrikam Assessment",
            EngagementType.ArchitectureAssessment,
            "Need an independent review before the next funding round.",
            EngagementConfidentiality.EngagementRestricted);

        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        var loaded = await verifyContext.Engagements.SingleAsync(e => e.Id == engagement.Id);

        Assert.Null(loaded.Timeline);
        Assert.Empty(loaded.BusinessObjectives);
    }

    [Fact]
    public async Task Engagement_ConcurrentUpdates_AreDetectedViaRowVersion()
    {
        var engagement = NewEngagement();
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var contextA = CreateContext();
        await using var contextB = CreateContext();

        var engagementA = await contextA.Engagements.SingleAsync(e => e.Id == engagement.Id);
        var engagementB = await contextB.Engagements.SingleAsync(e => e.Id == engagement.Id);

        engagementA.TransitionTo(EngagementStatus.Analysis, "pm-a@architect4hire.com");
        await contextA.SaveChangesAsync();

        engagementB.TransitionTo(EngagementStatus.Analysis, "pm-b@architect4hire.com");

        await Assert.ThrowsAsync<DbUpdateConcurrencyException>(() => contextB.SaveChangesAsync());
    }
}
