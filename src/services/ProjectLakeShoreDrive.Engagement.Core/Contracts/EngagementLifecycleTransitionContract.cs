using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Public shape of a single auditable lifecycle transition (BR-022).
public sealed record EngagementLifecycleTransitionContract
{
    public required EngagementStatus FromStatus { get; init; }

    public required EngagementStatus ToStatus { get; init; }

    public required string PerformedBy { get; init; }

    public string? Reason { get; init; }

    public required DateTimeOffset OccurredAtUtc { get; init; }
}
