using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Mapping;

// Domain <-> Contracts translation only (BR-020..023). No persistence, no business rules.
public static class EngagementContractMapper
{
    public static EngagementTimeline? ToDomain(EngagementTimelineContract? timeline) =>
        timeline is null ? null : new EngagementTimeline(timeline.StartDate, timeline.TargetEndDate);

    public static Stakeholder ToDomain(EngagementStakeholderContract stakeholder) =>
        new(stakeholder.Name, stakeholder.Role, stakeholder.Email);

    public static IReadOnlyList<Stakeholder> ToDomain(IEnumerable<EngagementStakeholderContract> stakeholders) =>
        stakeholders.Select(ToDomain).ToList();

    public static EngagementTimelineContract? ToContract(EngagementTimeline? timeline) =>
        timeline is null ? null : new EngagementTimelineContract
        {
            StartDate = timeline.StartDate,
            TargetEndDate = timeline.TargetEndDate
        };

    public static EngagementStakeholderContract ToContract(Stakeholder stakeholder) =>
        new()
        {
            Name = stakeholder.Name,
            Role = stakeholder.Role,
            Email = stakeholder.Email
        };

    public static EngagementLifecycleTransitionContract ToContract(EngagementLifecycleTransition transition) =>
        new()
        {
            FromStatus = transition.FromStatus,
            ToStatus = transition.ToStatus,
            PerformedBy = transition.PerformedBy,
            Reason = transition.Reason,
            OccurredAtUtc = transition.OccurredAtUtc
        };

    public static EngagementDetail ToDetail(Domain.Engagement engagement) =>
        new()
        {
            Id = engagement.Id.Value,
            ClientId = engagement.Client.ClientId,
            ClientName = engagement.Client.Name,
            Name = engagement.Name,
            Type = engagement.Type,
            BusinessProblem = engagement.BusinessProblem,
            CurrentStateSummary = engagement.CurrentStateSummary,
            TargetStateSummary = engagement.TargetStateSummary,
            Timeline = ToContract(engagement.Timeline),
            BusinessObjectives = engagement.BusinessObjectives,
            KnownTechnologyLandscape = engagement.KnownTechnologyLandscape,
            Stakeholders = engagement.Stakeholders.Select(ToContract).ToList(),
            Constraints = engagement.Constraints,
            RequestedDeliverables = engagement.RequestedDeliverables,
            Confidentiality = engagement.Confidentiality,
            Status = engagement.Status,
            CreatedAtUtc = engagement.CreatedAtUtc,
            ArchivedAtUtc = engagement.ArchivedAtUtc,
            // BR-022/GOV-001: audit trail is returned in deterministic chronological order.
            LifecycleHistory = engagement.LifecycleHistory
                .OrderBy(t => t.OccurredAtUtc)
                .Select(ToContract)
                .ToList()
        };

    public static EngagementListItem ToListItem(EngagementListProjection projection) =>
        new()
        {
            Id = projection.Id,
            ClientId = projection.ClientId,
            ClientName = projection.ClientName,
            Name = projection.Name,
            Type = projection.Type,
            Confidentiality = projection.Confidentiality,
            Status = projection.Status,
            CreatedAtUtc = projection.CreatedAtUtc
        };

    public static EngagementListResult ToListResult(EngagementPage page) =>
        new()
        {
            Items = page.Items.Select(ToListItem).ToList(),
            TotalCount = page.TotalCount,
            Page = page.Page,
            PageSize = page.PageSize
        };
}
