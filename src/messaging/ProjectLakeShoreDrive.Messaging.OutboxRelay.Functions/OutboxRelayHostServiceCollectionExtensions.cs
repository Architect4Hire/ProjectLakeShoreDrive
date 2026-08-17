using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Messaging.AzureServiceBus;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

// Composition root for the thin scheduled host: binds configuration, wires the reusable
// OutboxRepository/OutboxRelay/publisher, and nothing else (no business consumers, no
// unrelated background jobs). Kept as a testable extension method so DI wiring can be
// exercised without starting the Functions runtime.
public static class OutboxRelayHostServiceCollectionExtensions
{
    public static IServiceCollection AddOutboxRelayHost(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<OutboxRelayHostOptions>()
            .Bind(configuration.GetSection(OutboxRelayHostOptions.SectionName))
            .ValidateOnStart();
        services.AddSingleton<IValidateOptions<OutboxRelayHostOptions>, OutboxRelayHostOptionsValidator>();

        services.AddDbContext<OutboxDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("OutboxDatabase")
                ?? throw new InvalidOperationException("Connection string 'OutboxDatabase' is required.");

            options.UseSqlServer(connectionString);
        });

        services.AddSingleton(_ =>
        {
            var connectionString = configuration.GetConnectionString("ServiceBus")
                ?? throw new InvalidOperationException("Connection string 'ServiceBus' is required.");

            return new ServiceBusClient(connectionString);
        });

        services.AddSingleton<IIntegrationEventPublisher, AzureServiceBusIntegrationEventPublisher>();

        services.AddScoped(provider => new OutboxRepository(provider.GetRequiredService<OutboxDbContext>()));

        services.AddScoped(provider =>
        {
            var hostOptions = provider.GetRequiredService<IOptions<OutboxRelayHostOptions>>().Value;
            var repository = provider.GetRequiredService<OutboxRepository>();
            var publisher = provider.GetRequiredService<IIntegrationEventPublisher>();

            return new OutboxRelay(
                repository,
                publisher,
                _ => new PublishDestination(hostOptions.DestinationName),
                hostOptions.LeaseOwner,
                hostOptions.LeaseDuration,
                hostOptions.MaxAttempts);
        });

        services.AddSingleton<OutboxRelayTelemetry>();

        return services;
    }
}
