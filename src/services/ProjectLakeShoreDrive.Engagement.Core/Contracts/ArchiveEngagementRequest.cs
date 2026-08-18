using System.ComponentModel.DataAnnotations;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Input for archiving an engagement (TR-DATA-004: archived rather than physically deleted).
public sealed record ArchiveEngagementRequest
{
    [Required]
    public required Guid EngagementId { get; init; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string PerformedBy { get; init; }

    [StringLength(2000)]
    public string? Reason { get; init; }
}
