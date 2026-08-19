using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Core.Repositories;

public sealed class EngagementRepository(EngagementDbContext dbContext) : IEngagementRepository
{
    public Task<Domain.Engagement?> GetAsync(EngagementId id, CancellationToken cancellationToken) =>
        dbContext.Engagements
            .Include(e => e.Stakeholders)
            .Include(e => e.LifecycleHistory)
            .AsSplitQuery()
            .SingleOrDefaultAsync(e => e.Id == id, cancellationToken);

    public Task<Domain.Engagement?> GetForReadAsync(EngagementId id, CancellationToken cancellationToken) =>
        dbContext.Engagements
            .AsNoTracking()
            .Include(e => e.Stakeholders)
            .Include(e => e.LifecycleHistory)
            .AsSplitQuery()
            .SingleOrDefaultAsync(e => e.Id == id, cancellationToken);

    public void Add(Domain.Engagement engagement) => dbContext.Engagements.Add(engagement);

    public Task<EngagementPage> ListAsync(EngagementListCriteria criteria, CancellationToken cancellationToken)
    {
        var query = dbContext.Engagements.AsNoTracking().AsQueryable();

        if (!criteria.IncludeArchived)
        {
            query = query.Where(e => e.Status != EngagementStatus.Archived);
        }

        if (criteria.Status is { } status)
        {
            query = query.Where(e => e.Status == status);
        }

        if (criteria.ClientId is { } clientId)
        {
            query = query.Where(e => e.Client.ClientId == clientId);
        }

        return ProjectAndPageAsync(query, criteria.Page, criteria.PageSize, cancellationToken);
    }

    public Task<EngagementPage> SearchAsync(EngagementSearchCriteria criteria, CancellationToken cancellationToken)
    {
        var query = dbContext.Engagements.AsNoTracking().AsQueryable();

        if (!criteria.IncludeArchived)
        {
            query = query.Where(e => e.Status != EngagementStatus.Archived);
        }

        if (criteria.Status is { } status)
        {
            query = query.Where(e => e.Status == status);
        }

        if (criteria.ClientId is { } clientId)
        {
            query = query.Where(e => e.Client.ClientId == clientId);
        }

        var pattern = $"%{EscapeLikePattern(criteria.SearchText.Trim())}%";
        query = query.Where(e =>
            EF.Functions.Like(e.Name, pattern) ||
            EF.Functions.Like(e.Client.Name, pattern) ||
            EF.Functions.Like(e.BusinessProblem, pattern));

        return ProjectAndPageAsync(query, criteria.Page, criteria.PageSize, cancellationToken);
    }

    public async Task<EngagementAccessSnapshot?> GetAccessSnapshotAsync(EngagementId id, CancellationToken cancellationToken)
    {
        var row = await dbContext.Engagements
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new
            {
                e.Id,
                e.Status,
                StakeholderEmails = e.Stakeholders.Where(s => s.Email != null).Select(s => s.Email!),
                Actors = e.LifecycleHistory.Select(t => t.PerformedBy)
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (row is null)
        {
            return null;
        }

        var members = row.StakeholderEmails
            .Concat(row.Actors)
            .Where(m => !string.IsNullOrWhiteSpace(m))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return new EngagementAccessSnapshot(row.Id.Value, row.Status, members);
    }

    // Bounded pagination and deterministic sorting live here so this repository can never
    // run an unbounded or non-deterministic query, independent of any upstream validation.
    private static async Task<EngagementPage> ProjectAndPageAsync(
        IQueryable<Domain.Engagement> query, int page, int pageSize, CancellationToken cancellationToken)
    {
        var (normalizedPage, normalizedPageSize) = Normalize(page, pageSize);

        var ordered = query
            .OrderByDescending(e => e.CreatedAtUtc)
            .ThenByDescending(e => e.Id);

        var totalCount = await ordered.CountAsync(cancellationToken);

        // Select only the scalar columns a list row needs; the Id -> Guid unwrap happens
        // in-memory after materialization so no Stakeholders/LifecycleHistory are joined in.
        var rows = await ordered
            .Skip((normalizedPage - 1) * normalizedPageSize)
            .Take(normalizedPageSize)
            .Select(e => new
            {
                e.Id,
                ClientId = e.Client.ClientId,
                ClientName = e.Client.Name,
                e.Name,
                e.Type,
                e.Confidentiality,
                e.Status,
                e.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);

        var items = rows
            .Select(r => new EngagementListProjection(
                r.Id.Value, r.ClientId, r.ClientName, r.Name, r.Type, r.Confidentiality, r.Status, r.CreatedAtUtc))
            .ToList();

        return new EngagementPage(items, totalCount, normalizedPage, normalizedPageSize);
    }

    private static (int Page, int PageSize) Normalize(int page, int pageSize)
    {
        var normalizedPage = page < 1 ? 1 : page;
        var normalizedPageSize = pageSize switch
        {
            < 1 => 1,
            > 100 => 100,
            _ => pageSize
        };

        return (normalizedPage, normalizedPageSize);
    }

    // SQL Server LIKE treats [, %, and _ as pattern metacharacters; bracket-wrapping them
    // makes the search text a literal match with no ESCAPE clause required.
    private static string EscapeLikePattern(string value) =>
        value.Replace("[", "[[]").Replace("%", "[%]").Replace("_", "[_]");
}
