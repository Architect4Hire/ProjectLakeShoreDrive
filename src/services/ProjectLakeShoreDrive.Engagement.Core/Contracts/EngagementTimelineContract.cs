namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Public shape of an engagement's timeline (BR-020). Deliberately a plain data record, not
// the Domain.EngagementTimeline value object, so this wire contract does not depend on
// domain invariants/behavior and can evolve independently of it.
public sealed record EngagementTimelineContract
{
    public required DateOnly StartDate { get; init; }

    public DateOnly? TargetEndDate { get; init; }
}
