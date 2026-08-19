using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Mapping;

namespace ProjectLakeShoreDrive.Engagement.Core.Business;

// Model translation from UpdateEngagementRequest onto an existing Engagement aggregate
// (BR-020). Thrown InvalidOperationException (archived engagement) propagates to the Facade.
public static class EngagementDetailsMutation
{
    public static void Apply(Domain.Engagement engagement, UpdateEngagementRequest request) =>
        engagement.UpdateDetails(
            request.Name,
            request.Type,
            request.BusinessProblem,
            request.Confidentiality,
            request.CurrentStateSummary,
            request.TargetStateSummary,
            EngagementContractMapper.ToDomain(request.Timeline),
            request.BusinessObjectives,
            request.KnownTechnologyLandscape,
            EngagementContractMapper.ToDomain(request.Stakeholders),
            request.Constraints,
            request.RequestedDeliverables);
}
