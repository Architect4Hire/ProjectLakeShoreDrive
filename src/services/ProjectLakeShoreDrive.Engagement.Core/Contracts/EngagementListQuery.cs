using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Contracts;

// Filter/pagination input for listing engagements (BR-023 workspace navigation).
public sealed record EngagementListQuery
{
    public EngagementStatus? Status { get; init; }

    public Guid? ClientId { get; init; }

    public bool IncludeArchived { get; init; }

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 25;
}
