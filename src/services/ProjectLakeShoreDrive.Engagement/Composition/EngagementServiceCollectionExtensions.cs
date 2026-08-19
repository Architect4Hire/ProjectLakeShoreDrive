using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ProjectLakeShoreDrive.Engagement.Core.Business;
using ProjectLakeShoreDrive.Engagement.Core.Data;
using ProjectLakeShoreDrive.Engagement.Core.Facades;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;
using ProjectLakeShoreDrive.Engagement.Persistence;
using ProjectLakeShoreDrive.Engagement.Security;

namespace ProjectLakeShoreDrive.Engagement.Composition;

public static class EngagementServiceCollectionExtensions
{
    public static IServiceCollection AddEngagementDomain(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<EngagementDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("engagement-db")
                    ?? throw new InvalidOperationException("Connection string 'engagement-db' is required."),
                sql => sql.MigrationsAssembly(typeof(EngagementDbContextFactory).Assembly.GetName().Name)));

        services.AddScoped<IEngagementRepository, EngagementRepository>();
        services.AddScoped<IEngagementUnitOfWork, EngagementUnitOfWork>();
        services.AddScoped<IEngagementAccessQuery, EngagementAccessQuery>();
        services.AddScoped<IEngagementFacade, EngagementFacade>();
        services.AddScoped<IEngagementActorAccessor, EngagementActorAccessor>();
        services.AddSingleton<IEngagementLifecyclePolicy, EngagementLifecyclePolicy>();
        services.TryAddSingleton(TimeProvider.System);

        return services;
    }
}
