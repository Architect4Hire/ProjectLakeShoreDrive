using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Authentication;

// Development-only: reads X-Debug-User / X-Debug-Role headers into a ClaimsPrincipal. A
// missing/blank user header yields NoResult (a real 401), and an unparseable role header
// yields Fail (also a 401) rather than silently defaulting to a privileged role.
public sealed class DevelopmentHeaderAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(DevelopmentHeaderAuthenticationDefaults.UserHeader, out var userValues) ||
            string.IsNullOrWhiteSpace(userValues.ToString()))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var userId = userValues.ToString().Trim();
        var role = EngagementRole.PrincipalArchitect;

        if (Request.Headers.TryGetValue(DevelopmentHeaderAuthenticationDefaults.RoleHeader, out var roleValues) &&
            !string.IsNullOrWhiteSpace(roleValues.ToString()))
        {
            if (!Enum.TryParse(roleValues.ToString().Trim(), ignoreCase: true, out role))
            {
                return Task.FromResult(AuthenticateResult.Fail(
                    $"Unrecognized {DevelopmentHeaderAuthenticationDefaults.RoleHeader} value '{roleValues}'."));
            }
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, userId),
            new Claim(ClaimTypes.Role, role.ToString())
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
