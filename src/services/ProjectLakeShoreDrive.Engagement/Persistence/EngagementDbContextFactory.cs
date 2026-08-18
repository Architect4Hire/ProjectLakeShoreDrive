using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Persistence;

// Design-time only: lets `dotnet ef migrations`/`dotnet ef database update` scaffold and apply
// against SQL Server without running the full Aspire-orchestrated app (which only receives the
// "engagement-db" connection string when launched through AppHost). Never referenced at
// runtime — the running service will get its real connection string through Aspire service
// discovery when that wiring seam is added.
public sealed class EngagementDbContextFactory : IDesignTimeDbContextFactory<EngagementDbContext>
{
    // Local SQL Server instance used only for offline migration authoring/verification.
    private const string DesignTimeConnectionString =
        "Server=(localdb)\\MSSQLLocalDB;Database=lsd_engagement_design;Trusted_Connection=True;TrustServerCertificate=True";

    public EngagementDbContext CreateDbContext(string[] args)
    {
        // Migrations are compiled here (the host), not in Engagement.Core, because the
        // generated code uses SQL Server-specific annotations (rowversion, identity columns)
        // and Engagement.Core must stay provider-agnostic (backend.md: "no provider leakage
        // into domain"). EF's default migrations-assembly-matches-DbContext-assembly
        // convention is overridden accordingly.
        var optionsBuilder = new DbContextOptionsBuilder<EngagementDbContext>()
            .UseSqlServer(DesignTimeConnectionString,
                sql => sql.MigrationsAssembly(typeof(EngagementDbContextFactory).Assembly.GetName().Name));

        return new EngagementDbContext(optionsBuilder.Options);
    }
}
