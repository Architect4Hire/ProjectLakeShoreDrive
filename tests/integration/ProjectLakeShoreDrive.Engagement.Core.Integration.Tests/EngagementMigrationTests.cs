using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Core.Integration.Tests;

// Smoke test for the InitialEngagementSchema migration itself (not just the EF model), run
// against a real SQL Server (LocalDB) instance. EngagementPersistenceTests uses
// EnsureCreatedAsync (schema derived straight from the model); this test instead runs
// Database.MigrateAsync so the actual generated migration SQL is what gets exercised.
public sealed class EngagementMigrationTests : IAsyncLifetime
{
    // Migrations are scoped to EngagementDbContext specifically (the Designer file records
    // [DbContext(typeof(EngagementDbContext))]), so the smoke test must run migrations
    // against that exact context type rather than a locally-declared stand-in.
    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_engagement_migration_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

    private EngagementDbContext _context = null!;

    public Task InitializeAsync()
    {
        _context = CreateContext();
        return Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.DisposeAsync();
    }

    private EngagementDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<EngagementDbContext>()
            .UseSqlServer(_connectionString,
                sql => sql.MigrationsAssembly("ProjectLakeShoreDrive.Engagement"))
            .Options;

        return new EngagementDbContext(options);
    }

    [Fact]
    public async Task Migrate_CreatesEngagementSchema_OnAFreshDatabase()
    {
        await _context.Database.MigrateAsync();

        var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();
        Assert.Contains("InitialEngagementSchema", appliedMigrations.Select(StripTimestamp));

        var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
        Assert.Empty(pendingMigrations);
    }

    [Fact]
    public async Task Migrate_ThenRoundTripAnEngagement_ThroughTheMigratedSchema()
    {
        await _context.Database.MigrateAsync();

        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso Retail"),
            "Contoso Cloud Migration",
            EngagementType.CloudMigration,
            "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            EngagementConfidentiality.ClientConfidential);

        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        var loaded = await verifyContext.Engagements.SingleAsync(e => e.Id == engagement.Id);

        Assert.Equal(engagement.Name, loaded.Name);
    }

    [Fact]
    public async Task Migrate_IsIdempotent_WhenRunTwice()
    {
        await _context.Database.MigrateAsync();

        // Re-running against an already-migrated database must be a no-op, not an error
        // (USAGE: rollback/repeat safety).
        await _context.Database.MigrateAsync();

        var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
        Assert.Empty(pendingMigrations);
    }

    private static string StripTimestamp(string migrationId) => migrationId[(migrationId.IndexOf('_') + 1)..];
}
