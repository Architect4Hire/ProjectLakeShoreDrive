using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Mapping;

namespace ProjectLakeShoreDrive.Engagement.Core.Business;

// Model translation from CreateEngagementRequest into the Engagement aggregate (BR-020).
public static class EngagementFactory
{
    public static Domain.Engagement Create(CreateEngagementRequest request, DateTimeOffset createdAtUtc) =>
        Domain.Engagement.Create(
            new ClientReference(request.ClientId, request.ClientName),
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
            request.RequestedDeliverables,
            createdAtUtc);
}
