using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Text-search input over engagements within this domain (BR-023 workspace navigation).
// Results share EngagementListResult's shape with EngagementListQuery.
public sealed record SearchEngagementsQuery
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string SearchText { get; init; }

    public EngagementStatus? Status { get; init; }

    public Guid? ClientId { get; init; }

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 25;
}
