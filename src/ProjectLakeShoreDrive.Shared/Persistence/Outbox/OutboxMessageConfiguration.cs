using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjectLakeShoreDrive.Shared.Persistence.Outbox;

// Applied by an owning domain's DbContext (e.g. modelBuilder.ApplyConfiguration(new
// OutboxMessageConfiguration())) so every domain's outbox table has the same durable
// shape. This class configures mapping only; it does not itself own a DbContext or
// connection, so it creates no cross-domain database.
public sealed class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.ToTable("OutboxMessages");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).ValueGeneratedNever();

        builder.Property(m => m.EventType).IsRequired().HasMaxLength(200);
        builder.Property(m => m.EventVersion).IsRequired();
        builder.Property(m => m.PayloadJson).IsRequired();

        builder.Property(m => m.CorrelationId).IsRequired();
        builder.Property(m => m.CausationId);

        builder.Property(m => m.Producer).IsRequired().HasMaxLength(200);
        builder.Property(m => m.BusinessKey).HasMaxLength(200);

        builder.Property(m => m.OccurredAtUtc).IsRequired();
        builder.Property(m => m.CreatedAtUtc).IsRequired();

        builder.Property(m => m.Status).IsRequired().HasConversion<int>();
        builder.Property(m => m.AttemptCount).IsRequired();
        builder.Property(m => m.LastAttemptAtUtc);
        builder.Property(m => m.LastError).HasMaxLength(4000);
        builder.Property(m => m.DispatchedAtUtc);

        builder.Property(m => m.LeasedBy).HasMaxLength(200);
        builder.Property(m => m.LeasedUntilUtc);

        builder.Property(m => m.RowVersion).IsRowVersion();

        // Supports the relay's future "claim the next pending batch" query; the relay
        // itself is a separate seam and is not implemented here.
        builder.HasIndex(m => new { m.Status, m.CreatedAtUtc });
    }
}
