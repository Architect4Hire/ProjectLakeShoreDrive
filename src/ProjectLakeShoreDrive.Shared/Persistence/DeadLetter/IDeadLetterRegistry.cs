namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

// Application abstraction for recording messages that have been moved to the Azure Service Bus
// dead-letter queue (OPS-002). Enables operational observation and triage without auto-replay.
public interface IDeadLetterRegistry
{
    // Record that a message has been dead-lettered. The registry captures message metadata,
    // failure reason, and timestamps for later analysis and authorized manual replay eligibility.
    // Does not auto-replay; triage is manual and explicit.
    Task RecordDeadLetteredMessageAsync(
        Guid messageId,
        Guid correlationId,
        string eventType,
        int eventVersion,
        string consumer,
        string producer,
        DateTimeOffset occurredAtUtc,
        DateTimeOffset receivedAtUtc,
        int attemptCount,
        string deadLetterReason,
        string? deadLetterDescription = null,
        string? businessKey = null,
        Guid? causationId = null,
        CancellationToken cancellationToken = default);

    // Retrieve a specific dead-lettered message by message ID for inspection/triage.
    Task<DeadLetteredMessage?> GetByMessageIdAsync(
        Guid messageId,
        CancellationToken cancellationToken = default);

    // Query unreviewed messages (default ordering: oldest first).
    Task<IReadOnlyList<DeadLetteredMessage>> GetUnreviewedAsync(
        int maxResults = 100,
        CancellationToken cancellationToken = default);

    // Query messages in a specific triage status.
    Task<IReadOnlyList<DeadLetteredMessage>> GetByTriageStatusAsync(
        DeadLetterTriageStatus status,
        int maxResults = 100,
        CancellationToken cancellationToken = default);

    // Query messages by consumer (for operations dashboard grouping).
    Task<IReadOnlyList<DeadLetteredMessage>> GetByConsumerAsync(
        string consumer,
        int maxResults = 100,
        CancellationToken cancellationToken = default);

    // Query messages by business key (for domain-level impact analysis).
    Task<IReadOnlyList<DeadLetteredMessage>> GetByBusinessKeyAsync(
        string businessKey,
        CancellationToken cancellationToken = default);

    // Update triage status and notes (capturing manual review).
    // Does not auto-advance to Resolved; that state requires explicit action log.
    Task UpdateTriageAsync(
        Guid messageId,
        DeadLetterTriageStatus triageStatus,
        string? triageNotes,
        string reviewedBy,
        CancellationToken cancellationToken = default);

    // Query messages eligible for manual replay (operator sees these, decides whether to replay).
    Task<IReadOnlyList<DeadLetteredMessage>> GetEligibleForReplayAsync(
        int maxResults = 100,
        CancellationToken cancellationToken = default);
}
