namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

public sealed record EngagementTimeline
{
    public DateOnly StartDate { get; }
    public DateOnly? TargetEndDate { get; }

    public EngagementTimeline(DateOnly startDate, DateOnly? targetEndDate = null)
    {
        if (targetEndDate is not null && targetEndDate < startDate)
        {
            throw new ArgumentException("Target end date cannot precede the start date.", nameof(targetEndDate));
        }

        StartDate = startDate;
        TargetEndDate = targetEndDate;
    }
}
