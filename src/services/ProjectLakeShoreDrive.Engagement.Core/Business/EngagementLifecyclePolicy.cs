using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Business;

// Delegates to the domain's internal EngagementLifecycle.IsValidTransition so the rule table
// is defined exactly once (Domain owns the invariant; Business exposes it for orchestration
// and UI decisions).
public sealed class EngagementLifecyclePolicy : IEngagementLifecyclePolicy
{
    public IReadOnlyList<EngagementStatus> AllowedTransitionsFrom(EngagementStatus current) =>
        Enum.GetValues<EngagementStatus>()
            .Where(target => EngagementLifecycle.IsValidTransition(current, target))
            .ToList();

    public EngagementTransitionEvaluation Evaluate(EngagementStatus current, EngagementStatus target)
    {
        if (EngagementLifecycle.IsValidTransition(current, target))
        {
            return new EngagementTransitionEvaluation(true, null);
        }

        var reason = current == EngagementStatus.Archived
            ? "An archived engagement cannot change phase."
            : $"Cannot move from '{current}' to '{target}'. Allowed next phases: " +
              string.Join(", ", AllowedTransitionsFrom(current));

        return new EngagementTransitionEvaluation(false, reason);
    }
}
