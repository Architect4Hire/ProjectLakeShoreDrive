using Microsoft.EntityFrameworkCore;

namespace ProjectLakeShoreDrive.Shared.Persistence.Outbox;

// Minimal, reusable DbContext scoped to only the outbox table, for hosts (such as a relay
// worker) that need to operate on an owning domain's outbox without depending on that
// domain's full business schema. A domain's own DbContext maps OutboxMessage the same way
// via OutboxMessageConfiguration; this type does not replace or own that domain's database
// model, it only gives a generic host a way to point at the same table.
public sealed class OutboxDbContext(DbContextOptions<OutboxDbContext> options) : DbContext(options)
{
    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new OutboxMessageConfiguration());
    }
}
