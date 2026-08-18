using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Input for creating an engagement (BR-020). Field set mirrors the aggregate's required-at-
// creation structured data; the client identity is supplied by the caller (this domain does
// not own client master data).
public sealed record CreateEngagementRequest
{
    [Required]
    public required Guid ClientId { get; init; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string ClientName { get; init; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; init; }

    [Required]
    public required EngagementType Type { get; init; }

    [Required]
    [StringLength(4000, MinimumLength = 1)]
    public required string BusinessProblem { get; init; }

    [Required]
    public required EngagementConfidentiality Confidentiality { get; init; }

    [StringLength(4000)]
    public string? CurrentStateSummary { get; init; }

    [StringLength(4000)]
    public string? TargetStateSummary { get; init; }

    public EngagementTimelineContract? Timeline { get; init; }

    public IReadOnlyList<string> BusinessObjectives { get; init; } = [];

    public IReadOnlyList<string> KnownTechnologyLandscape { get; init; } = [];

    public IReadOnlyList<EngagementStakeholderContract> Stakeholders { get; init; } = [];

    public IReadOnlyList<string> Constraints { get; init; } = [];

    public IReadOnlyList<string> RequestedDeliverables { get; init; } = [];
}
