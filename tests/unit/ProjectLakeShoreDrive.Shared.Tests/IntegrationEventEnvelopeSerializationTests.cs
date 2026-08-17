using System.Text.Json;
using ProjectLakeShoreDrive.Shared.Messaging;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class IntegrationEventEnvelopeSerializationTests
{
    private sealed record SamplePayload(string EngagementId, string NewPhase);

    private static IntegrationEventEnvelope<SamplePayload> BuildEnvelope() => new(
        EventId: Guid.Parse("11111111-1111-1111-1111-111111111111"),
        EventType: "EngagementPhaseChanged",
        EventVersion: 1,
        OccurredAtUtc: DateTimeOffset.Parse("2026-08-17T12:00:00Z"),
        Producer: "Engagement",
        CorrelationId: Guid.Parse("22222222-2222-2222-2222-222222222222"),
        CausationId: Guid.Parse("33333333-3333-3333-3333-333333333333"),
        BusinessKey: "engagement-42",
        Payload: new SamplePayload("engagement-42", "Discovery"));

    [Fact]
    public void Envelope_RoundTripsThroughJsonSerialization()
    {
        var envelope = BuildEnvelope();

        var json = JsonSerializer.Serialize(envelope);
        var roundTripped = JsonSerializer.Deserialize<IntegrationEventEnvelope<SamplePayload>>(json);

        Assert.Equal(envelope, roundTripped);
    }

    [Fact]
    public void Envelope_Serializes_AllEnvelopeFieldsByName()
    {
        var json = JsonSerializer.Serialize(BuildEnvelope());
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;

        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.EventId), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.EventType), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.EventVersion), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.OccurredAtUtc), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.Producer), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.CorrelationId), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.CausationId), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.BusinessKey), out _));
        Assert.True(root.TryGetProperty(nameof(IntegrationEventEnvelope<SamplePayload>.Payload), out _));
    }

    [Fact]
    public void Envelope_AllowsNullCausationId_ForRootCauseEvents()
    {
        var envelope = BuildEnvelope() with { CausationId = null };

        var json = JsonSerializer.Serialize(envelope);
        var roundTripped = JsonSerializer.Deserialize<IntegrationEventEnvelope<SamplePayload>>(json);

        Assert.Null(roundTripped!.CausationId);
    }

    [Fact]
    public void Envelope_AllowsNullBusinessKey_WhenNotApplicable()
    {
        var envelope = BuildEnvelope() with { BusinessKey = null };

        var json = JsonSerializer.Serialize(envelope);
        var roundTripped = JsonSerializer.Deserialize<IntegrationEventEnvelope<SamplePayload>>(json);

        Assert.Null(roundTripped!.BusinessKey);
    }
}
