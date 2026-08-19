using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

public sealed class EngagementAccessQuery(IEngagementRepository repository) : IEngagementAccessQuery
{
    public Task<EngagementAccessSnapshot?> GetAccessAsync(Guid engagementId, CancellationToken cancellationToken) =>
        repository.GetAccessSnapshotAsync(new EngagementId(engagementId), cancellationToken);
}
