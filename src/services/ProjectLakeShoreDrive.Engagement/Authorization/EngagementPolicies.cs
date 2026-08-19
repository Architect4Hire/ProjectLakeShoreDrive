namespace ProjectLakeShoreDrive.Engagement.Authorization;

public static class EngagementPolicies
{
    public const string ReadEngagements = "engagement:read";
    public const string CreateEngagement = "engagement:create";
    public const string ViewEngagement = "engagement:view";
    public const string EditEngagement = "engagement:edit";
    public const string TransitionPhase = "engagement:transition-phase";
    public const string ArchiveEngagement = "engagement:archive";
}
