using System.Collections.Concurrent;
using ProjectLakeShoreDrive.Messaging.Abstractions;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Integration.Tests;

// Records every publish attempt and lets a test script which MessageIds should throw on
// their next N calls, so relay retry/duplicate-safety behavior can be observed without a
// real broker.
internal sealed class FakeIntegrationEventPublisher : IIntegrationEventPublisher
{
    private readonly ConcurrentDictionary<Guid, int> _remainingFailures = new();

    public ConcurrentQueue<(PublishDestination Destination, PreparedIntegrationMessage Message)> Calls { get; } = new();

    public void FailNextAttempts(Guid messageId, int times) => _remainingFailures[messageId] = times;

    public Task PublishAsync(PublishDestination destination, PreparedIntegrationMessage message, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        Calls.Enqueue((destination, message));

        if (_remainingFailures.TryGetValue(message.MessageId, out var remaining) && remaining > 0)
        {
            _remainingFailures[message.MessageId] = remaining - 1;
            throw new InvalidOperationException("Simulated transient publish failure.");
        }

        return Task.CompletedTask;
    }
}
