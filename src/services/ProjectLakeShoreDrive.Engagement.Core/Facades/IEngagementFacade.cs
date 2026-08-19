using ProjectLakeShoreDrive.Engagement.Core.Contracts;

namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

// Use-case orchestration for the Engagement bounded domain: validates, calls Business then
// Data, and maps results to public Contracts (BR-020..023). This is the single entry point
// both HTTP controllers and any future Semantic Kernel plugin must call (ADR-0011) — neither
// gets a looser authorization or validation check than the other.
public interface IEngagementFacade
{
    Task<EngagementResult<EngagementDetail>> CreateAsync(
        CreateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementDetail>> UpdateAsync(
        UpdateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementDetail>> GetAsync(Guid engagementId, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementListResult>> ListAsync(
        EngagementListQuery query, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementListResult>> SearchAsync(
        SearchEngagementsQuery query, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementDetail>> TransitionPhaseAsync(
        TransitionEngagementPhaseRequest request, EngagementActor actor, CancellationToken cancellationToken);

    Task<EngagementResult<EngagementDetail>> ArchiveAsync(
        ArchiveEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken);
}
