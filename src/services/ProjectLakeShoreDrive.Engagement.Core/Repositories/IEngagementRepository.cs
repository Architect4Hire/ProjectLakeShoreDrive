using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Repositories;

// Service-owned persistence operations for the Engagement aggregate. No business decisions,
// no SaveChanges (that is a Data-layer/unit-of-work responsibility) — queries and mutations
// against the tracked EF change set only.
public interface IEngagementRepository
{
    // Tracked read, including Stakeholders and LifecycleHistory, for mutation flows.
    Task<Domain.Engagement?> GetAsync(EngagementId id, CancellationToken cancellationToken);

    // Untracked read, including Stakeholders and LifecycleHistory, for pure read flows.
    Task<Domain.Engagement?> GetForReadAsync(EngagementId id, CancellationToken cancellationToken);

    void Add(Domain.Engagement engagement);

    Task<EngagementPage> ListAsync(EngagementListCriteria criteria, CancellationToken cancellationToken);

    Task<EngagementPage> SearchAsync(EngagementSearchCriteria criteria, CancellationToken cancellationToken);

    Task<EngagementAccessSnapshot?> GetAccessSnapshotAsync(EngagementId id, CancellationToken cancellationToken);
}
