using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

// Applied by an owning domain's DbContext (e.g. modelBuilder.ApplyConfiguration(new
// InboxMessageConfiguration())) so every domain's inbox table has the same durable,
// deduplicating shape. This class configures mapping only; it does not itself own a
// DbContext or connection, so it creates no central cross-domain inbox database.
public sealed class InboxMessageConfiguration : IEntityTypeConfiguration<InboxMessage>
{
    public void Configure(EntityTypeBuilder<InboxMessage> builder)
    {
        builder.ToTable("InboxMessages");

        // MessageId is both the identity and the dedup key: duplicate delivery of the same
        // broker message must resolve to this same row (README inbox/idempotency rule).
        builder.HasKey(m => m.MessageId);
        builder.Property(m => m.MessageId).ValueGeneratedNever();

        builder.Property(m => m.EventType).IsRequired().HasMaxLength(200);
        builder.Property(m => m.EventVersion).IsRequired();
        builder.Property(m => m.Consumer).IsRequired().HasMaxLength(200);

        builder.Property(m => m.ReceivedAtUtc).IsRequired();
        builder.Property(m => m.ProcessingStartedAtUtc);
        builder.Property(m => m.CompletedAtUtc);

        builder.Property(m => m.Status).IsRequired().HasConversion<int>();
        builder.Property(m => m.AttemptCount).IsRequired();

        builder.Property(m => m.Outcome).HasMaxLength(2000);
        builder.Property(m => m.FailureReason).HasMaxLength(4000);

        builder.Property(m => m.RowVersion).IsRowVersion();

        // Supports a future consumer's "has this message already been processed?" lookup
        // by status; the consumer itself is a separate seam and is not implemented here.
        builder.HasIndex(m => new { m.Status, m.ReceivedAtUtc });
    }
}
