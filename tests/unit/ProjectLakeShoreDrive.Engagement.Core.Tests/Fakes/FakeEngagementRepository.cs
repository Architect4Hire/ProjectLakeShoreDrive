using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests.Fakes;

// Hand-written in-memory fake (this solution's convention is no mocking library) that
// implements exactly the persistence semantics EngagementFacade relies on, so facade unit
// tests exercise real orchestration logic against predictable, controllable state.
public sealed class FakeEngagementRepository : IEngagementRepository
{
    public Dictionary<EngagementId, Domain.Engagement> Store { get; } = [];

    public Task<Domain.Engagement?> GetAsync(EngagementId id, CancellationToken cancellationToken) =>
        Task.FromResult(Store.GetValueOrDefault(id));

    public Task<Domain.Engagement?> GetForReadAsync(EngagementId id, CancellationToken cancellationToken) =>
        Task.FromResult(Store.GetValueOrDefault(id));

    public void Add(Domain.Engagement engagement) => Store[engagement.Id] = engagement;

    public Task<EngagementPage> ListAsync(EngagementListCriteria criteria, CancellationToken cancellationToken)
    {
        var items = Store.Values
            .Where(e => criteria.IncludeArchived || e.Status != EngagementStatus.Archived)
            .Where(e => criteria.Status is null || e.Status == criteria.Status)
            .Where(e => criteria.ClientId is null || e.Client.ClientId == criteria.ClientId)
            .OrderByDescending(e => e.CreatedAtUtc)
            .Select(ToProjection)
            .ToList();

        return Task.FromResult(new EngagementPage(items, items.Count, criteria.Page, criteria.PageSize));
    }

    public Task<EngagementPage> SearchAsync(EngagementSearchCriteria criteria, CancellationToken cancellationToken)
    {
        var items = Store.Values
            .Where(e => criteria.IncludeArchived || e.Status != EngagementStatus.Archived)
            .Where(e => e.Name.Contains(criteria.SearchText, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(e => e.CreatedAtUtc)
            .Select(ToProjection)
            .ToList();

        return Task.FromResult(new EngagementPage(items, items.Count, criteria.Page, criteria.PageSize));
    }

    public Task<EngagementAccessSnapshot?> GetAccessSnapshotAsync(EngagementId id, CancellationToken cancellationToken)
    {
        if (!Store.TryGetValue(id, out var engagement))
        {
            return Task.FromResult<EngagementAccessSnapshot?>(null);
        }

        var members = engagement.Stakeholders
            .Where(s => s.Email is not null)
            .Select(s => s.Email!)
            .Concat(engagement.LifecycleHistory.Select(t => t.PerformedBy))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return Task.FromResult<EngagementAccessSnapshot?>(
            new EngagementAccessSnapshot(engagement.Id.Value, engagement.Status, members));
    }

    private static EngagementListProjection ToProjection(Domain.Engagement engagement) => new(
        engagement.Id.Value,
        engagement.Client.ClientId,
        engagement.Client.Name,
        engagement.Name,
        engagement.Type,
        engagement.Confidentiality,
        engagement.Status,
        engagement.CreatedAtUtc);
}
