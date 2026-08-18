using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Full engagement workspace read model (BR-023). Returned by create, update, phase
// transition, and archive operations, and by the single-engagement read.
public sealed record EngagementDetail
{
    public required Guid Id { get; init; }

    public required Guid ClientId { get; init; }

    public required string ClientName { get; init; }

    public required string Name { get; init; }

    public required EngagementType Type { get; init; }

    public required string BusinessProblem { get; init; }

    public string? CurrentStateSummary { get; init; }

    public string? TargetStateSummary { get; init; }

    public EngagementTimelineContract? Timeline { get; init; }

    public IReadOnlyList<string> BusinessObjectives { get; init; } = [];

    public IReadOnlyList<string> KnownTechnologyLandscape { get; init; } = [];

    public IReadOnlyList<EngagementStakeholderContract> Stakeholders { get; init; } = [];

    public IReadOnlyList<string> Constraints { get; init; } = [];

    public IReadOnlyList<string> RequestedDeliverables { get; init; } = [];

    public required EngagementConfidentiality Confidentiality { get; init; }

    public required EngagementStatus Status { get; init; }

    public required DateTimeOffset CreatedAtUtc { get; init; }

    public DateTimeOffset? ArchivedAtUtc { get; init; }

    public IReadOnlyList<EngagementLifecycleTransitionContract> LifecycleHistory { get; init; } = [];
}
