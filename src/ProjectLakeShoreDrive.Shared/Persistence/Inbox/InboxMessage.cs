namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

// Reusable SQL-compatible inbox row shape (README inbox/idempotency rule; NFR-002;
// docs/design/adr/adr-0002-transactional-outbox-and-idempotent-inbox.md). Each bounded
// domain owns its own InboxMessage table inside its own database/DbContext — this type
// and its EF configuration are a shared persistence mechanism, not shared domain data
// (CLAUDE.md: "Shared libraries contain cross-cutting mechanisms ... never shared domain
// logic"), and not a central cross-domain inbox. No consumer reads/writes this table yet;
// that is a later, separate seam.
public sealed class InboxMessage
{
    // The broker message ID is the dedup key and the row identity: duplicate delivery of
    // the same message must hit the same row (unique constraint), not create a new one.
    public required Guid MessageId { get; init; }

    public required string EventType { get; init; }

    public required int EventVersion { get; init; }

    // The consumer/subscription that owns this inbox row, for traceability when a domain
    // has more than one logical subscriber.
    public required string Consumer { get; init; }

    public required DateTimeOffset ReceivedAtUtc { get; init; }

    public DateTimeOffset? ProcessingStartedAtUtc { get; set; }

    public DateTimeOffset? CompletedAtUtc { get; set; }

    public InboxMessageStatus Status { get; set; } = InboxMessageStatus.Received;

    public int AttemptCount { get; set; }

    // Short outcome summary (e.g. which durable side effect committed), not a full payload.
    public string? Outcome { get; set; }

    public string? FailureReason { get; set; }

    // Optimistic-concurrency token for processing-state transitions.
    public byte[]? RowVersion { get; set; }
}
