using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Security;

// Resolves the authenticated caller as an EngagementActor for the Facade. Isolated so the
// controller never reads ClaimsPrincipal directly (SEC-002: identity resolution lives in one
// place, swappable later when ADR-0011's real edge-token scheme replaces the dev header seam).
public interface IEngagementActorAccessor
{
    EngagementActor GetCurrentActor();
}
