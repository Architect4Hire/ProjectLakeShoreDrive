namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// Baseline engagement lifecycle per BR-022.
public enum EngagementStatus
{
    Draft,
    Discovery,
    Analysis,
    Architecture,
    Estimation,
    PackageGeneration,
    Review,
    Approved,
    Delivery,
    Closed,
    Archived
}
