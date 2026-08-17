using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

public sealed class DeadLetteredMessageConfiguration : IEntityTypeConfiguration<DeadLetteredMessage>
{
    public void Configure(EntityTypeBuilder<DeadLetteredMessage> builder)
    {
        builder.ToTable("DeadLetteredMessages");

        builder.HasKey(m => m.MessageId);

        builder.Property(m => m.MessageId)
            .ValueGeneratedNever();

        builder.Property(m => m.DeadLetterReason)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.EventType)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.Consumer)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.Producer)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(m => m.DeadLetterDescription)
            .HasMaxLength(1024);

        builder.Property(m => m.TriageNotes)
            .HasMaxLength(2048);

        builder.Property(m => m.ReviewedBy)
            .HasMaxLength(256);

        builder.Property(m => m.BusinessKey)
            .HasMaxLength(256);

        builder.Property(m => m.RowVersion)
            .IsRowVersion();

        // Index for efficient triage queries: find unreviewed or in-diagnosis messages.
        builder.HasIndex(m => new { m.TriageStatus, m.DeadLetteredAtUtc })
            .HasDatabaseName("IX_DeadLetteredMessages_TriageStatus_DeadLetteredAtUtc");

        // Index for correlation tracing.
        builder.HasIndex(m => m.CorrelationId)
            .HasDatabaseName("IX_DeadLetteredMessages_CorrelationId");

        // Index for finding messages by consumer (operational grouping).
        builder.HasIndex(m => new { m.Consumer, m.DeadLetteredAtUtc })
            .HasDatabaseName("IX_DeadLetteredMessages_Consumer_DeadLetteredAtUtc");

        // Index for finding messages by business key (domain-level impact analysis).
        builder.HasIndex(m => m.BusinessKey)
            .HasDatabaseName("IX_DeadLetteredMessages_BusinessKey")
            .IsUnique(false);
    }
}
