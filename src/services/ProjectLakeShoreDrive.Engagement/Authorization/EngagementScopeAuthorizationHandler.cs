using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Authorization;

// Resource-based check driven by the "id" route value rather than context.Resource, so it
// works uniformly for every action decorated with an engagement-scope policy without each
// controller action needing to pass the loaded aggregate through explicitly.
public sealed class EngagementScopeAuthorizationHandler(
    IEngagementAccessQuery accessQuery, IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<EngagementScopeRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, EngagementScopeRequirement requirement)
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            return;
        }

        if (httpContext.GetRouteValue("id") is not { } routeId || !Guid.TryParse(routeId.ToString(), out var engagementId))
        {
            return;
        }

        // PrincipalArchitect holds blanket authority across engagements per ADR-0011's matrix.
        if (context.User.IsInRole(EngagementRole.PrincipalArchitect.ToString()))
        {
            context.Succeed(requirement);
            return;
        }

        var snapshot = await accessQuery.GetAccessAsync(engagementId, httpContext.RequestAborted);
        if (snapshot is null)
        {
            // Let the controller return an honest 404 rather than disclosing existence via 403.
            context.Succeed(requirement);
            return;
        }

        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is not null && snapshot.MemberIdentifiers.Contains(userId, StringComparer.OrdinalIgnoreCase))
        {
            context.Succeed(requirement);
        }
    }
}
