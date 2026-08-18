namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// Encodes the valid transitions of the baseline engagement lifecycle (BR-022).
internal static class EngagementLifecycle
{
    // Baseline order: Draft -> Discovery -> Analysis -> Architecture -> Estimation ->
    // PackageGeneration -> Review -> Approved -> Delivery -> Closed -> Archived.
    private static readonly EngagementStatus[] Sequence =
    [
        EngagementStatus.Draft,
        EngagementStatus.Discovery,
        EngagementStatus.Analysis,
        EngagementStatus.Architecture,
        EngagementStatus.Estimation,
        EngagementStatus.PackageGeneration,
        EngagementStatus.Review,
        EngagementStatus.Approved,
        EngagementStatus.Delivery,
        EngagementStatus.Closed,
        EngagementStatus.Archived
    ];

    public static bool IsValidTransition(EngagementStatus from, EngagementStatus to)
    {
        // Archived is terminal: no further transitions once archived.
        if (from == EngagementStatus.Archived)
        {
            return false;
        }

        // TR-DATA-004: an engagement is archived rather than physically deleted, so any
        // non-archived, non-terminal state may move directly to Archived.
        if (to == EngagementStatus.Archived)
        {
            return true;
        }

        var fromIndex = Array.IndexOf(Sequence, from);
        var toIndex = Array.IndexOf(Sequence, to);

        return toIndex == fromIndex + 1;
    }
}
