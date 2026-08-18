using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Input for updating an engagement's structured data (BR-020). Client identity is not
// included: the client an engagement is for is set at creation and is not part of this seam.
public sealed record UpdateEngagementRequest
{
    [Required]
    public required Guid EngagementId { get; init; }

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
