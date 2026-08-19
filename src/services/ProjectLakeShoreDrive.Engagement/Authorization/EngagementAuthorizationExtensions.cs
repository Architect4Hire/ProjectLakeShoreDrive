using Microsoft.AspNetCore.Authorization;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Authorization;

// Role -> policy matrix per ADR-0011. TransitionPhase/ArchiveEngagement require
// PrincipalArchitect specifically; the scope requirement is redundant for that role (the
// handler always succeeds for it) but keeps every protected action shaped the same way.
public static class EngagementAuthorizationExtensions
{
    public static IServiceCollection AddEngagementAuthorization(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        // Scoped, not Singleton: this handler depends on IEngagementAccessQuery, which is
        // scoped (it ultimately holds a DbContext-backed repository).
        services.AddScoped<IAuthorizationHandler, EngagementScopeAuthorizationHandler>();

        services.AddAuthorizationBuilder()
            .AddPolicy(EngagementPolicies.ReadEngagements, policy => policy.RequireRole(
                EngagementRole.PrincipalArchitect.ToString(),
                EngagementRole.ConsultingContributor.ToString(),
                EngagementRole.Reviewer.ToString(),
                EngagementRole.Administrator.ToString()))
            .AddPolicy(EngagementPolicies.CreateEngagement, policy =>
                policy.RequireRole(EngagementRole.PrincipalArchitect.ToString()))
            .AddPolicy(EngagementPolicies.ViewEngagement, policy => policy
                .RequireRole(
                    EngagementRole.PrincipalArchitect.ToString(),
                    EngagementRole.ConsultingContributor.ToString(),
                    EngagementRole.Reviewer.ToString())
                .AddRequirements(new EngagementScopeRequirement()))
            .AddPolicy(EngagementPolicies.EditEngagement, policy => policy
                .RequireRole(EngagementRole.PrincipalArchitect.ToString(), EngagementRole.ConsultingContributor.ToString())
                .AddRequirements(new EngagementScopeRequirement()))
            .AddPolicy(EngagementPolicies.TransitionPhase, policy => policy
                .RequireRole(EngagementRole.PrincipalArchitect.ToString())
                .AddRequirements(new EngagementScopeRequirement()))
            .AddPolicy(EngagementPolicies.ArchiveEngagement, policy => policy
                .RequireRole(EngagementRole.PrincipalArchitect.ToString())
                .AddRequirements(new EngagementScopeRequirement()));

        return services;
    }
}
