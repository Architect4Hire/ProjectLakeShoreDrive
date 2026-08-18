namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

public sealed class InvalidEngagementLifecycleTransitionException : Exception
{
    public EngagementStatus FromStatus { get; }
    public EngagementStatus ToStatus { get; }

    public InvalidEngagementLifecycleTransitionException(EngagementStatus fromStatus, EngagementStatus toStatus)
        : base($"Cannot transition an engagement from '{fromStatus}' to '{toStatus}'.")
    {
        FromStatus = fromStatus;
        ToStatus = toStatus;
    }
}
