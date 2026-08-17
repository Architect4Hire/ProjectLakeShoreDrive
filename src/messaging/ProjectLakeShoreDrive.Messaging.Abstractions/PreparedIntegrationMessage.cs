namespace ProjectLakeShoreDrive.Messaging.Abstractions;

// A fully prepared, already-serialized message ready to hand to a publisher. Callers
// build this from an IntegrationEventEnvelope (ProjectLakeShoreDrive.Shared.Messaging)
// before calling IIntegrationEventPublisher; the publisher does not know about the
// envelope's generic payload type or how the body was produced.
public sealed record PreparedIntegrationMessage(
    Guid MessageId,
    string Body,
    string ContentType,
    string EventType,
    int EventVersion,
    Guid CorrelationId,
    Guid? CausationId,
    string? BusinessKey);
