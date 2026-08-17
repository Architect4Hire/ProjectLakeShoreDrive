using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Messaging.AzureServiceBus;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions.Tests;

// Proves the host's DI composition is correct without starting the Functions runtime or
// touching a real SQL Server/Service Bus (ServiceBusClient/DbContext do not connect until
// first used, so construction alone is safe here).
public class OutboxRelayHostServiceCollectionExtensionsTests
{
    private static IConfiguration BuildValidConfiguration() => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:OutboxDatabase"] = "Server=(localdb)\\MSSQLLocalDB;Database=lsd_relay_host_tests;Trusted_Connection=True;",
            ["ConnectionStrings:ServiceBus"] = "Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=x;SharedAccessKey=y",
            ["OutboxRelay:LeaseOwner"] = "relay-1",
            ["OutboxRelay:DestinationName"] = "engagement-events",
        })
        .Build();

    [Fact]
    public void AddOutboxRelayHost_ResolvesOutboxRepository()
    {
        var services = new ServiceCollection();
        services.AddOutboxRelayHost(BuildValidConfiguration());

        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();

        var repository = scope.ServiceProvider.GetRequiredService<OutboxRepository>();

        Assert.NotNull(repository);
    }

    [Fact]
    public async Task AddOutboxRelayHost_ResolvesIntegrationEventPublisher_AsAzureServiceBusImplementation()
    {
        var services = new ServiceCollection();
        services.AddOutboxRelayHost(BuildValidConfiguration());

        await using var provider = services.BuildServiceProvider();

        var publisher = provider.GetRequiredService<IIntegrationEventPublisher>();

        Assert.IsType<AzureServiceBusIntegrationEventPublisher>(publisher);
    }

    [Fact]
    public async Task AddOutboxRelayHost_ResolvesConfiguredOutboxRelay()
    {
        var services = new ServiceCollection();
        services.AddOutboxRelayHost(BuildValidConfiguration());

        await using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();

        var relay = scope.ServiceProvider.GetRequiredService<Messaging.OutboxRelay.OutboxRelay>();

        Assert.NotNull(relay);
    }

    [Fact]
    public void AddOutboxRelayHost_ResolvesTelemetryAsSingleton()
    {
        var services = new ServiceCollection();
        services.AddOutboxRelayHost(BuildValidConfiguration());

        using var provider = services.BuildServiceProvider();

        var first = provider.GetRequiredService<OutboxRelayTelemetry>();
        var second = provider.GetRequiredService<OutboxRelayTelemetry>();

        Assert.Same(first, second);
    }

    [Fact]
    public void AddOutboxRelayHost_FailsValidation_WhenDestinationNameMissing()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:OutboxDatabase"] = "Server=(localdb)\\MSSQLLocalDB;Database=lsd_relay_host_tests;Trusted_Connection=True;",
                ["ConnectionStrings:ServiceBus"] = "Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=x;SharedAccessKey=y",
                ["OutboxRelay:LeaseOwner"] = "relay-1",
            })
            .Build();

        var services = new ServiceCollection();
        services.AddOutboxRelayHost(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.Throws<OptionsValidationException>(() =>
            provider.GetRequiredService<IOptions<OutboxRelayHostOptions>>().Value);
    }

    [Fact]
    public void AddOutboxRelayHost_Throws_WhenOutboxDatabaseConnectionStringMissing()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:ServiceBus"] = "Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=x;SharedAccessKey=y",
                ["OutboxRelay:LeaseOwner"] = "relay-1",
                ["OutboxRelay:DestinationName"] = "engagement-events",
            })
            .Build();

        var services = new ServiceCollection();
        services.AddOutboxRelayHost(configuration);

        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();

        Assert.Throws<InvalidOperationException>(() =>
            scope.ServiceProvider.GetRequiredService<OutboxDbContext>());
    }

    [Fact]
    public void AddOutboxRelayHost_DoesNotRegisterUnrelatedBusinessConsumers()
    {
        var services = new ServiceCollection();
        services.AddOutboxRelayHost(BuildValidConfiguration());

        // This host wires only the reusable relay seam; it must not accumulate any
        // business-domain consumer registrations as a side effect.
        Assert.DoesNotContain(services, descriptor =>
            descriptor.ServiceType.Namespace is { } ns && ns.Contains("Engagement", StringComparison.Ordinal));
    }
}
