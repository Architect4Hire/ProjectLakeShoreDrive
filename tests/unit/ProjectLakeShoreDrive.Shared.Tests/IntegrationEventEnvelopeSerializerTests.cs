using ProjectLakeShoreDrive.Shared.Messaging;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class IntegrationEventEnvelopeSerializerTests
{
    private sealed record SamplePayload(string EngagementId, string NewPhase);

    private static IntegrationEventEnvelope<SamplePayload> BuildEnvelope(int eventVersion = 1) => new(
        EventId: Guid.Parse("11111111-1111-1111-1111-111111111111"),
        EventType: "EngagementPhaseChanged",
        EventVersion: eventVersion,
        OccurredAtUtc: DateTimeOffset.Parse("2026-08-17T12:00:00Z"),
        Producer: "Engagement",
        CorrelationId: Guid.Parse("22222222-2222-2222-2222-222222222222"),
        CausationId: Guid.Parse("33333333-3333-3333-3333-333333333333"),
        BusinessKey: "engagement-42",
        Payload: new SamplePayload("engagement-42", "Discovery"));

    [Fact]
    public void Serialize_ThenDeserialize_RoundTripsToAnEquivalentEnvelope()
    {
        var envelope = BuildEnvelope();

        var json = IntegrationEventEnvelopeSerializer.Serialize(envelope);
        var result = IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>(json, supportedEventVersions: new HashSet<int> { 1 });

        Assert.Equal(envelope, result);
    }

    [Fact]
    public void Deserialize_Accepts_WhenVersionIsAmongMultipleSupportedVersions()
    {
        var envelope = BuildEnvelope(eventVersion: 2);
        var json = IntegrationEventEnvelopeSerializer.Serialize(envelope);

        var result = IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>(json, supportedEventVersions: new HashSet<int> { 1, 2 });

        Assert.Equal(2, result.EventVersion);
    }

    [Fact]
    public void Deserialize_Throws_ForMalformedJson()
    {
        var exception = Assert.Throws<IntegrationEventEnvelopeDeserializationException>(() =>
            IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>("{ not valid json", supportedEventVersions: new HashSet<int> { 1 }));

        Assert.Equal(IntegrationEventEnvelopeDeserializationFailureReason.Malformed, exception.Reason);
    }

    [Fact]
    public void Deserialize_Throws_WhenEventTypeIsMissing()
    {
        const string json = """
            {
                "EventId": "11111111-1111-1111-1111-111111111111",
                "EventVersion": 1,
                "OccurredAtUtc": "2026-08-17T12:00:00Z",
                "Producer": "Engagement",
                "CorrelationId": "22222222-2222-2222-2222-222222222222",
                "Payload": { "EngagementId": "engagement-42", "NewPhase": "Discovery" }
            }
            """;

        var exception = Assert.Throws<IntegrationEventEnvelopeDeserializationException>(() =>
            IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>(json, supportedEventVersions: new HashSet<int> { 1 }));

        Assert.Equal(IntegrationEventEnvelopeDeserializationFailureReason.Malformed, exception.Reason);
    }

    [Fact]
    public void Deserialize_Throws_WhenCorrelationIdIsMissing()
    {
        const string json = """
            {
                "EventId": "11111111-1111-1111-1111-111111111111",
                "EventType": "EngagementPhaseChanged",
                "EventVersion": 1,
                "OccurredAtUtc": "2026-08-17T12:00:00Z",
                "Producer": "Engagement",
                "Payload": { "EngagementId": "engagement-42", "NewPhase": "Discovery" }
            }
            """;

        var exception = Assert.Throws<IntegrationEventEnvelopeDeserializationException>(() =>
            IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>(json, supportedEventVersions: new HashSet<int> { 1 }));

        Assert.Equal(IntegrationEventEnvelopeDeserializationFailureReason.Malformed, exception.Reason);
    }

    [Fact]
    public void Deserialize_Throws_ForUnsupportedEventVersion()
    {
        var envelope = BuildEnvelope(eventVersion: 99);
        var json = IntegrationEventEnvelopeSerializer.Serialize(envelope);

        var exception = Assert.Throws<IntegrationEventEnvelopeDeserializationException>(() =>
            IntegrationEventEnvelopeSerializer.Deserialize<SamplePayload>(json, supportedEventVersions: new HashSet<int> { 1, 2 }));

        Assert.Equal(IntegrationEventEnvelopeDeserializationFailureReason.UnsupportedEventVersion, exception.Reason);
    }
}
