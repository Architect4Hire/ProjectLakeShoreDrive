using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ProjectLakeShoreDrive.Engagement.Authentication;
using ProjectLakeShoreDrive.Engagement.Core.Facades;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;

namespace ProjectLakeShoreDrive.Engagement.Api.Integration.Tests;

// Runs the real host (first WebApplicationFactory use in this repo) against a real, migrated
// LocalDB instance (database.md: no EF InMemory as proof of SQL behavior) with the
// Development-only header auth seam active, so 401/403/404/409/422 assertions exercise real
// middleware rather than a hand-simulated pipeline.
public sealed class EngagementApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_engagement_api_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:engagement-db"] = _connectionString
            });
        });
    }

    async Task IAsyncLifetime.InitializeAsync()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EngagementDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        using (var scope = Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<EngagementDbContext>();
            await dbContext.Database.EnsureDeletedAsync();
        }

        await base.DisposeAsync();
    }

    public HttpClient CreateClientAs(string userId, EngagementRole role)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Add(DevelopmentHeaderAuthenticationDefaults.UserHeader, userId);
        client.DefaultRequestHeaders.Add(DevelopmentHeaderAuthenticationDefaults.RoleHeader, role.ToString());
        return client;
    }

    public HttpClient CreateAnonymousClient() => CreateClient();

    // Swaps the real facade for a stub so a test can force a specific outcome (e.g. a
    // ConcurrencyConflict) without racing two real SQL writers. The underlying host still
    // shares this instance's migrated connection string, so authorization's scope query (which
    // reads the real database, not the stub) keeps working.
    public HttpClient CreateClientWithStubFacade(IEngagementFacade stub, string userId, EngagementRole role)
    {
        var factory = WithWebHostBuilder(builder => builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IEngagementFacade>();
            services.AddScoped(_ => stub);
        }));

        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add(DevelopmentHeaderAuthenticationDefaults.UserHeader, userId);
        client.DefaultRequestHeaders.Add(DevelopmentHeaderAuthenticationDefaults.RoleHeader, role.ToString());
        return client;
    }
}
