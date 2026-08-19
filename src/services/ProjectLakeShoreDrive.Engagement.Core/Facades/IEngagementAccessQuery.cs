using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

// Read-only access-check seam consumed by the host's authorization handler (ADR-0011:
// engagement-scope policies must be evaluated against the engagement's own membership data).
// Kept separate from IEngagementFacade so the transport layer's authorization pipeline never
// needs the full facade (and its validation/mutation surface) just to answer "can this caller
// see this engagement".
public interface IEngagementAccessQuery
{
    Task<EngagementAccessSnapshot?> GetAccessAsync(Guid engagementId, CancellationToken cancellationToken);
}
