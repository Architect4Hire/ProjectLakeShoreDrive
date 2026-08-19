using Microsoft.AspNetCore.Authentication;

namespace ProjectLakeShoreDrive.Engagement.Authentication;

public static class EngagementAuthenticationExtensions
{
    public static IServiceCollection AddEngagementAuthentication(
        this IServiceCollection services, IWebHostEnvironment environment)
    {
        var builder = services.AddAuthentication(DevelopmentHeaderAuthenticationDefaults.Scheme);

        if (environment.IsDevelopment())
        {
            builder.AddScheme<AuthenticationSchemeOptions, DevelopmentHeaderAuthenticationHandler>(
                DevelopmentHeaderAuthenticationDefaults.Scheme, _ => { });
        }
        else
        {
            builder.AddScheme<AuthenticationSchemeOptions, DeniedAuthenticationHandler>(
                DevelopmentHeaderAuthenticationDefaults.Scheme, _ => { });
        }

        return services;
    }
}
