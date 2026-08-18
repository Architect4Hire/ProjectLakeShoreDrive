using System.ComponentModel.DataAnnotations;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Public shape of an engagement stakeholder (BR-020).
public sealed record EngagementStakeholderContract
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; init; }

    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Role { get; init; }

    [EmailAddress]
    [StringLength(320)]
    public string? Email { get; init; }
}
