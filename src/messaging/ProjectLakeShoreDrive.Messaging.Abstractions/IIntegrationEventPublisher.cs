namespace ProjectLakeShoreDrive.Messaging.Abstractions;

// Provider-neutral publish seam (README integration rule). Domain/application code
// depends on this interface, never a broker SDK type directly. The publisher only sends
// what it is given — it does not read outbox rows and does not choose the destination;
// that decision belongs to the caller (an outbox relay, in a later seam).
public interface IIntegrationEventPublisher
{
    Task PublishAsync(
        PublishDestination destination,
        PreparedIntegrationMessage message,
        CancellationToken cancellationToken = default);
}
