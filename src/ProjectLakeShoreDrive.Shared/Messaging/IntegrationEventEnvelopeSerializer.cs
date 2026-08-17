using System.Text.Json;

namespace ProjectLakeShoreDrive.Shared.Messaging;

// Provider-neutral JSON serialization for IntegrationEventEnvelope<TPayload> (README
// messaging rules). This does not send/receive anything — a producer's outbox relay or a
// consumer's inbox handler calls this to turn an envelope into/from the wire bytes it
// stores or reads; the broker/relay/consumer themselves are separate seams.
public static class IntegrationEventEnvelopeSerializer
{
    public static string Serialize<TPayload>(IntegrationEventEnvelope<TPayload> envelope) =>
        JsonSerializer.Serialize(envelope);

    // supportedEventVersions: the EventVersion values the caller's contract mapping can
    // currently handle for this event type. Anything else is rejected rather than passed
    // through, so an unrecognized future version cannot be silently misinterpreted.
    public static IntegrationEventEnvelope<TPayload> Deserialize<TPayload>(
        string json,
        IReadOnlySet<int> supportedEventVersions)
    {
        IntegrationEventEnvelope<TPayload>? envelope;

        try
        {
            envelope = JsonSerializer.Deserialize<IntegrationEventEnvelope<TPayload>>(json);
        }
        catch (JsonException ex)
        {
            throw new IntegrationEventEnvelopeDeserializationException(
                IntegrationEventEnvelopeDeserializationFailureReason.Malformed,
                "The integration event envelope is not valid JSON.",
                ex);
        }

        if (envelope is null
            || string.IsNullOrWhiteSpace(envelope.EventType)
            || string.IsNullOrWhiteSpace(envelope.Producer)
            || envelope.EventId == Guid.Empty
            || envelope.CorrelationId == Guid.Empty)
        {
            throw new IntegrationEventEnvelopeDeserializationException(
                IntegrationEventEnvelopeDeserializationFailureReason.Malformed,
                "The integration event envelope is missing one or more required fields.");
        }

        if (!supportedEventVersions.Contains(envelope.EventVersion))
        {
            throw new IntegrationEventEnvelopeDeserializationException(
                IntegrationEventEnvelopeDeserializationFailureReason.UnsupportedEventVersion,
                $"Event version {envelope.EventVersion} for '{envelope.EventType}' is not supported. " +
                $"Supported versions: {string.Join(", ", supportedEventVersions.OrderBy(v => v))}.");
        }

        return envelope;
    }
}
