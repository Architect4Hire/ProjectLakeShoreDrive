using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.Engagement.Authentication;

// Registered under the same scheme name outside Development so a misconfigured
// ASPNETCORE_ENVIRONMENT fails closed instead of silently activating the debug auth seam.
public sealed class DeniedAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync() =>
        Task.FromResult(AuthenticateResult.Fail("Authentication is not configured for this environment."));
}
