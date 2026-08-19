using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Business;

// Result of evaluating a proposed lifecycle transition (BR-022).
public sealed record EngagementTransitionEvaluation(bool IsAllowed, string? BlockedReason);

// Business-layer view of the domain's lifecycle rules: no EF/Redis/HTTP, just decisions the
// application service and UI need (allowed transitions, human-readable blocked reasons).
public interface IEngagementLifecyclePolicy
{
    IReadOnlyList<EngagementStatus> AllowedTransitionsFrom(EngagementStatus current);

    EngagementTransitionEvaluation Evaluate(EngagementStatus current, EngagementStatus target);
}
