namespace ProjectLakeShoreDrive.Engagement.Authentication;

// Development-only authentication seam (ADR-0011 explicitly defers real identity/middleware).
// Shaped so it is swappable later for the ADR-0011 cookie/API-edge-token scheme without
// touching controllers or authorization policies: both read ClaimsPrincipal, never headers.
public static class DevelopmentHeaderAuthenticationDefaults
{
    public const string Scheme = "DevelopmentHeader";
    public const string UserHeader = "X-Debug-User";
    public const string RoleHeader = "X-Debug-Role";
}
