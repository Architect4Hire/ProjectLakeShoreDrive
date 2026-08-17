namespace ProjectLakeShoreDrive.Shared.Messaging;

// Provider-neutral integration event envelope (README messaging rules; OPS-001;
// docs/design/integration-event-catalog.md "Envelope"). Carries only cross-cutting
// transport/traceability fields; TPayload is the business event shape owned by the
// publishing domain and is not defined here. No Service Bus SDK type is referenced —
// this is a plain data contract usable by an outbox relay or consumer regardless of
// the underlying broker.
public sealed record IntegrationEventEnvelope<TPayload>(
    Guid EventId,
    string EventType,
    int EventVersion,
    DateTimeOffset OccurredAtUtc,
    string Producer,
    Guid CorrelationId,
    Guid? CausationId,
    string? BusinessKey,
    TPayload Payload);
