namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// A single auditable lifecycle transition (BR-022).
public sealed record EngagementLifecycleTransition
{
    public EngagementStatus FromStatus { get; }
    public EngagementStatus ToStatus { get; }
    public string PerformedBy { get; }
    public string? Reason { get; }
    public DateTimeOffset OccurredAtUtc { get; }

    public EngagementLifecycleTransition(
        EngagementStatus fromStatus,
        EngagementStatus toStatus,
        string performedBy,
        string? reason,
        DateTimeOffset occurredAtUtc)
    {
        if (string.IsNullOrWhiteSpace(performedBy))
        {
            throw new ArgumentException("The actor performing the transition is required.", nameof(performedBy));
        }

        FromStatus = fromStatus;
        ToStatus = toStatus;
        PerformedBy = performedBy.Trim();
        Reason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim();
        OccurredAtUtc = occurredAtUtc;
    }
}
