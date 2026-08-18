using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Input for moving an engagement to its next lifecycle phase (BR-022). The actor and reason
// are required so the resulting transition is auditable.
public sealed record TransitionEngagementPhaseRequest
{
    [Required]
    public required Guid EngagementId { get; init; }

    [Required]
    public required EngagementStatus TargetStatus { get; init; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string PerformedBy { get; init; }

    [StringLength(2000)]
    public string? Reason { get; init; }
}
