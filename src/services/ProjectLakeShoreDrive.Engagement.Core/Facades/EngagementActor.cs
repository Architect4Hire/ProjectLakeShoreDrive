namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

// Roles per ADR-0011's authorization matrix for the Engagement bounded domain.
public enum EngagementRole
{
    PrincipalArchitect,
    ConsultingContributor,
    Reviewer,
    KnowledgeCurator,
    Administrator
}

// The authenticated caller performing an Engagement operation. Callers (HTTP controllers,
// Semantic Kernel plugins) resolve this from their own identity boundary and pass it in; the
// Facade never derives identity from request-body fields (SEC-002).
public sealed record EngagementActor(string UserId, string DisplayName, EngagementRole Role);
