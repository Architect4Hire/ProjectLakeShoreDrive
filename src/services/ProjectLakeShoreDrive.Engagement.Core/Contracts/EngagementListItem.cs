using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Lightweight row for engagement listing/workspace navigation (BR-023). Deliberately excludes
// narrative fields and collections that EngagementDetail carries, to keep list responses cheap.
public sealed record EngagementListItem
{
    public required Guid Id { get; init; }

    public required Guid ClientId { get; init; }

    public required string ClientName { get; init; }

    public required string Name { get; init; }

    public required EngagementType Type { get; init; }

    public required EngagementConfidentiality Confidentiality { get; init; }

    public required EngagementStatus Status { get; init; }

    public required DateTimeOffset CreatedAtUtc { get; init; }
}
