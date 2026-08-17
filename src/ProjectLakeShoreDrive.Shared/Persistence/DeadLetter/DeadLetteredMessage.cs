namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

// Durable record of messages moved to the Azure Service Bus dead-letter queue (README OPS-002).
// Each record captures enough metadata to observe the failure, diagnose the root cause, and
// determine whether the message is eligible for manual replay (but never auto-replay).
// The entity does not include business-logic state; its sole purpose is operational triaging.
public sealed class DeadLetteredMessage
{
    // Primary dedup identity: the broker message ID.
    public required Guid MessageId { get; init; }

    // For correlation across asynchronous boundaries.
    public required Guid CorrelationId { get; init; }

    public Guid? CausationId { get; init; }

    // The event type and version for schema/handler identification.
    public required string EventType { get; init; }

    public required int EventVersion { get; init; }

    // The consumer or subscription that could not process this message.
    public required string Consumer { get; init; }

    // The domain/service that produced the message.
    public required string Producer { get; init; }

    // When the message was originally published.
    public required DateTimeOffset OccurredAtUtc { get; init; }

    // When the message was received by the consumer.
    public required DateTimeOffset ReceivedAtUtc { get; init; }

    // When the dead-letter record was created.
    public required DateTimeOffset DeadLetteredAtUtc { get; init; }

    // How many times the consumer attempted to process it.
    public required int AttemptCount { get; init; }

    // The reason the message reached the dead-letter queue (e.g., exception type, max delivery exceeded).
    public required string DeadLetterReason { get; init; }

    // Additional failure context (first exception message, or Service Bus error details).
    public string? DeadLetterDescription { get; init; }

    // A business key (e.g., aggregate ID) to help identify domain entities that may be affected.
    public string? BusinessKey { get; init; }

    // Operational state for triage: Unreviewed → Diagnosis → Eligible | IneligibleForReplay | Resolved.
    public DeadLetterTriageStatus TriageStatus { get; set; } = DeadLetterTriageStatus.Unreviewed;

    // Notes added during triage (why is it safe or unsafe to replay, what action was taken).
    public string? TriageNotes { get; set; }

    // The person/system that reviewed this message for replay eligibility.
    public string? ReviewedBy { get; set; }

    public DateTimeOffset? ReviewedAtUtc { get; set; }

    // Optimistic-concurrency token for triage-state updates.
    public byte[]? RowVersion { get; set; }
}
