using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Repositories;

// Cheap row shape for list/search queries (BR-023). Deliberately excludes narrative fields
// and collections so listing never materializes the full aggregate.
public sealed record EngagementListProjection(
    Guid Id,
    Guid ClientId,
    string ClientName,
    string Name,
    EngagementType Type,
    EngagementConfidentiality Confidentiality,
    EngagementStatus Status,
    DateTimeOffset CreatedAtUtc);

// A bounded, deterministically ordered page of EngagementListProjection rows.
public sealed record EngagementPage(
    IReadOnlyList<EngagementListProjection> Items,
    int TotalCount,
    int Page,
    int PageSize);

// Filter/pagination input for the repository's list query. Page/PageSize are re-clamped by
// the repository itself (independent of any upstream validation) so this layer can never run
// an unbounded query.
public sealed record EngagementListCriteria(
    EngagementStatus? Status,
    Guid? ClientId,
    bool IncludeArchived,
    int Page,
    int PageSize);

// Text-search input over Name, Client.Name, and BusinessProblem.
public sealed record EngagementSearchCriteria(
    string SearchText,
    EngagementStatus? Status,
    Guid? ClientId,
    bool IncludeArchived,
    int Page,
    int PageSize);
