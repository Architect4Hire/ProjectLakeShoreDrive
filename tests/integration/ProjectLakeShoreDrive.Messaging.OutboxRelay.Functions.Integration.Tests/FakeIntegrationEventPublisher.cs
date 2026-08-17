using System.Collections.Concurrent;
using ProjectLakeShoreDrive.Messaging.Abstractions;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions.Integration.Tests;

// Stands in for the real Azure Service Bus adapter. A live broker/Service Bus emulator
// requires Docker, which is not available in this environment, so this smoke test proves
// the composed host wiring (DbContext -> repository -> relay -> publisher -> telemetry)
// runs end to end against a real SQL Server (LocalDB) without depending on Docker.
internal sealed class FakeIntegrationEventPublisher : IIntegrationEventPublisher
{
    public ConcurrentQueue<(PublishDestination Destination, PreparedIntegrationMessage Message)> Calls { get; } = new();

    public Task PublishAsync(PublishDestination destination, PreparedIntegrationMessage message, CancellationToken cancellationToken = default)
    {
        Calls.Enqueue((destination, message));
        return Task.CompletedTask;
    }
}
