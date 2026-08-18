using Microsoft.EntityFrameworkCore;

namespace ProjectLakeShoreDrive.Engagement.Core.Persistence;

// Owns the Engagement bounded domain's relational schema only (ADR-0008: each bounded domain
// owns its own database/migrations). No other domain's tables are mapped here.
public sealed class EngagementDbContext(DbContextOptions<EngagementDbContext> options) : DbContext(options)
{
    public DbSet<Domain.Engagement> Engagements => Set<Domain.Engagement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new EngagementConfiguration());
    }
}
