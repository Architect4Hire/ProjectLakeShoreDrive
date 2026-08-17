namespace ProjectLakeShoreDrive.Messaging.OutboxRelay;

public sealed record OutboxRelayBatchResult(
    IReadOnlyList<Guid> Dispatched,
    IReadOnlyList<Guid> RetriedFailures,
    IReadOnlyList<Guid> PermanentlyFailed);
