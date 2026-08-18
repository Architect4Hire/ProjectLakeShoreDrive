namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Paged result for EngagementListQuery and SearchEngagementsQuery (BR-023).
public sealed record EngagementListResult
{
    public required IReadOnlyList<EngagementListItem> Items { get; init; }

    public required int TotalCount { get; init; }

    public required int Page { get; init; }

    public required int PageSize { get; init; }
}
