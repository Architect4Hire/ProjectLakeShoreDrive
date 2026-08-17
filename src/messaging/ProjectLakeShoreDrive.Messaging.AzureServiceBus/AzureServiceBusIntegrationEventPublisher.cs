using System.Diagnostics;
using Azure.Messaging.ServiceBus;
using ProjectLakeShoreDrive.Messaging.Abstractions;

namespace ProjectLakeShoreDrive.Messaging.AzureServiceBus;

// Azure Service Bus implementation of the provider-neutral publish seam. Takes the
// destination and prepared message exactly as given — it does not read outbox rows and
// does not choose a destination (README integration rule; that decision belongs to the
// caller, e.g. a future outbox relay).
public sealed class AzureServiceBusIntegrationEventPublisher(ServiceBusClient client) : IIntegrationEventPublisher
{
    private readonly ServiceBusClient _client = client ?? throw new ArgumentNullException(nameof(client));

    public async Task PublishAsync(
        PublishDestination destination,
        PreparedIntegrationMessage message,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(destination);
        ArgumentNullException.ThrowIfNull(message);

        var busMessage = AzureServiceBusMessageFactory.Create(message, Activity.Current);

        await using var sender = _client.CreateSender(destination.Name);
        await sender.SendMessageAsync(busMessage, cancellationToken).ConfigureAwait(false);
    }
}
