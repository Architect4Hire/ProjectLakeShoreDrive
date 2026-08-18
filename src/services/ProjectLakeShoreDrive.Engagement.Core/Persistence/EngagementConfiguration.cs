using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Persistence;

// Maps the Engagement aggregate directly (TR-DATA-001, BR-020..023) rather than through a
// separate persistence model. Only provider-agnostic Microsoft.EntityFrameworkCore.Relational
// APIs are used here; no SQL Server-specific types appear in this configuration or in the
// domain model (backend.md: "Business code does not directly access EF ... "; this class is
// the service's Data-layer mapping, not business logic).
public sealed class EngagementConfiguration : IEntityTypeConfiguration<Domain.Engagement>
{
    public void Configure(EntityTypeBuilder<Domain.Engagement> builder)
    {
        builder.ToTable("Engagements");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasConversion(id => id.Value, value => new EngagementId(value))
            .ValueGeneratedNever();

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(e => e.BusinessProblem)
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(e => e.CurrentStateSummary)
            .HasMaxLength(4000);

        builder.Property(e => e.TargetStateSummary)
            .HasMaxLength(4000);

        builder.Property(e => e.Confidentiality)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(e => e.CreatedAtUtc)
            .IsRequired();

        builder.Property(e => e.ArchivedAtUtc);

        builder.Property(e => e.RowVersion)
            .IsRowVersion();

        // Client is a stable reference (id + display name), not a separate aggregate this
        // service owns, so it is stored inline as an owned type (same table) rather than a
        // foreign key relationship into another domain's data.
        builder.OwnsOne(e => e.Client, client =>
        {
            client.Property(c => c.ClientId)
                .HasColumnName("ClientId")
                .IsRequired();

            client.Property(c => c.Name)
                .HasColumnName("ClientName")
                .IsRequired()
                .HasMaxLength(200);

            client.HasIndex(c => c.ClientId)
                .HasDatabaseName("IX_Engagements_ClientId");
        });

        builder.Navigation(e => e.Client).IsRequired();

        // Optional owned type: an engagement may not have a timeline yet (e.g. still in Draft).
        builder.OwnsOne(e => e.Timeline, timeline =>
        {
            timeline.Property(t => t.StartDate).HasColumnName("TimelineStartDate");
            timeline.Property(t => t.TargetEndDate).HasColumnName("TimelineTargetEndDate");
        });

        // Simple string lists captured at creation (BR-020). Encapsulated collections with
        // no public setter are mapped through their backing field.
        ConfigurePrimitiveCollection(builder, e => e.BusinessObjectives, "_businessObjectives");
        ConfigurePrimitiveCollection(builder, e => e.KnownTechnologyLandscape, "_knownTechnologyLandscape");
        ConfigurePrimitiveCollection(builder, e => e.Constraints, "_constraints");
        ConfigurePrimitiveCollection(builder, e => e.RequestedDeliverables, "_requestedDeliverables");

        // Stakeholders: a bounded list of value objects, owned by the engagement, stored in
        // their own table keyed by a shadow "Id" plus the owning EngagementId foreign key.
        builder.Navigation(e => e.Stakeholders)
            .HasField("_stakeholders")
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.OwnsMany(e => e.Stakeholders, stakeholder =>
        {
            stakeholder.ToTable("EngagementStakeholders");
            stakeholder.WithOwner().HasForeignKey("EngagementId");
            stakeholder.Property<int>("Id");
            stakeholder.HasKey("Id");

            stakeholder.Property(s => s.Name).IsRequired().HasMaxLength(200);
            stakeholder.Property(s => s.Role).IsRequired().HasMaxLength(200);
            stakeholder.Property(s => s.Email).HasMaxLength(320);
        });

        // Lifecycle transitions: the auditable history required by BR-022. Append-only, so a
        // separate table keyed the same way as Stakeholders is sufficient.
        builder.Navigation(e => e.LifecycleHistory)
            .HasField("_lifecycleHistory")
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.OwnsMany(e => e.LifecycleHistory, transition =>
        {
            transition.ToTable("EngagementLifecycleTransitions");
            transition.WithOwner().HasForeignKey("EngagementId");
            transition.Property<int>("Id");
            transition.HasKey("Id");

            transition.Property(t => t.FromStatus).IsRequired().HasConversion<int>();
            transition.Property(t => t.ToStatus).IsRequired().HasConversion<int>();
            transition.Property(t => t.PerformedBy).IsRequired().HasMaxLength(200);
            transition.Property(t => t.Reason).HasMaxLength(2000);
            transition.Property(t => t.OccurredAtUtc).IsRequired();

            transition.HasIndex("EngagementId", nameof(EngagementLifecycleTransition.OccurredAtUtc))
                .HasDatabaseName("IX_EngagementLifecycleTransitions_EngagementId_OccurredAtUtc");
        });

        // BR-023 workspace/dashboard: list engagements by current phase, most recent first.
        builder.HasIndex(e => new { e.Status, e.CreatedAtUtc })
            .HasDatabaseName("IX_Engagements_Status_CreatedAtUtc");
    }

    private static void ConfigurePrimitiveCollection(
        EntityTypeBuilder<Domain.Engagement> builder,
        System.Linq.Expressions.Expression<Func<Domain.Engagement, IReadOnlyList<string>>> propertyExpression,
        string fieldName)
    {
        builder.PrimitiveCollection(propertyExpression)
            .HasField(fieldName)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
