namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// Classification values per SEC-006, applied to the engagement record itself (BR-020).
public enum EngagementConfidentiality
{
    InternalReusable,
    ClientConfidential,
    EngagementRestricted,
    ApprovedReusableKnowledge
}
