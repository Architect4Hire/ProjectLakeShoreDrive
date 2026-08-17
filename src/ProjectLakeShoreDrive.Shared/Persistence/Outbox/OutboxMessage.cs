namespace ProjectLakeShoreDrive.Shared.Persistence.Outbox;

// Reusable SQL-compatible outbox row shape (README outbox rule; TR-DATA-001;
// docs/design/adr/adr-0002-transactional-outbox-and-idempotent-inbox.md). Each bounded
// domain owns its own OutboxMessage table inside its own database/DbContext — this type
// and its EF configuration are a shared persistence mechanism, not shared domain data
// (CLAUDE.md: "Shared libraries contain cross-cutting mechanisms ... never shared domain
// logic"). No relay reads/writes this table yet; that is a later, separate seam.
public sealed class OutboxMessage
{
    // Stable identity; also used as the broker message ID so relay redelivery is safe to retry.
    public required Guid Id { get; init; }

    public required string EventType { get; init; }

    public required int EventVersion { get; init; }

    // Serialized business event payload (JSON). The payload shape belongs to the owning
    // domain; this table only stores it, it does not interpret it.
    public required string PayloadJson { get; init; }

    public required Guid CorrelationId { get; init; }

    public Guid? CausationId { get; init; }

    public required string Producer { get; init; }

    public string? BusinessKey { get; init; }

    public required DateTimeOffset OccurredAtUtc { get; init; }

    public required DateTimeOffset CreatedAtUtc { get; init; }

    public OutboxMessageStatus Status { get; set; } = OutboxMessageStatus.Pending;

    public int AttemptCount { get; set; }

    public DateTimeOffset? LastAttemptAtUtc { get; set; }

    public string? LastError { get; set; }

    public DateTimeOffset? DispatchedAtUtc { get; set; }

    // Lease fields let a relay claim a batch of rows without a second consumer racing it,
    // without requiring a distributed lock.
    public string? LeasedBy { get; set; }

    public DateTimeOffset? LeasedUntilUtc { get; set; }

    // Optimistic-concurrency token for lease/status updates.
    public byte[]? RowVersion { get; set; }
}
