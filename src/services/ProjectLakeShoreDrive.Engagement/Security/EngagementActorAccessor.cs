using System.Security.Claims;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Security;

public sealed class EngagementActorAccessor(IHttpContextAccessor httpContextAccessor) : IEngagementActorAccessor
{
    public EngagementActor GetCurrentActor()
    {
        var user = httpContextAccessor.HttpContext?.User
            ?? throw new InvalidOperationException("No HTTP context is available to resolve the current actor.");

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("The authenticated principal has no user identifier claim.");

        var displayName = user.FindFirstValue(ClaimTypes.Name) ?? userId;

        var roleClaim = user.FindFirstValue(ClaimTypes.Role)
            ?? throw new InvalidOperationException("The authenticated principal has no role claim.");

        if (!Enum.TryParse<EngagementRole>(roleClaim, ignoreCase: true, out var role))
        {
            throw new InvalidOperationException($"Unrecognized role claim value '{roleClaim}'.");
        }

        return new EngagementActor(userId, displayName, role);
    }
}
