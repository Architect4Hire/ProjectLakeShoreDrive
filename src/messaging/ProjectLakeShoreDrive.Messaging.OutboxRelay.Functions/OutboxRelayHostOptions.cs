namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

// Host-level configuration for the scheduled relay trigger. DestinationName is
// configuration, not a literal in code, so this host never embeds a Service Bus entity
// name (README integration rule) — the concrete name is supplied per deployment, once a
// topology is ADR-approved.
public sealed class OutboxRelayHostOptions
{
    public const string SectionName = "OutboxRelay";

    public required string LeaseOwner { get; init; }

    public required string DestinationName { get; init; }

    public int BatchSize { get; init; } = 20;

    public TimeSpan LeaseDuration { get; init; } = TimeSpan.FromMinutes(5);

    public int MaxAttempts { get; init; } = 5;
}
