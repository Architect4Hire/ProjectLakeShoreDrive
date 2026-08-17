using Microsoft.EntityFrameworkCore;

namespace ProjectLakeShoreDrive.Shared.Persistence.Outbox;

// Reusable outbox lease/outcome operations against an owning domain's own DbContext
// (README outbox rule). This is a repository, not a relay/worker: it exposes leasing and
// outcome recording so a future relay (a separate seam — no timer/worker host is created
// here) can build a polling loop on top of it. No row is ever deleted; dispatched/failed
// rows remain for audit and troubleshooting.
public sealed class OutboxRepository(DbContext context)
{
    private readonly DbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    // Concurrency-safe: each candidate row is leased via an individual optimistic-
    // concurrency write (OutboxMessage.RowVersion). If another owner leases the same row
    // first, the write fails with DbUpdateConcurrencyException and that row is simply
    // skipped rather than double-leased.
    public async Task<IReadOnlyList<OutboxMessage>> LeasePendingBatchAsync(
        string leaseOwner,
        int batchSize,
        TimeSpan leaseDuration,
        DateTimeOffset nowUtc,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(leaseOwner))
        {
            throw new ArgumentException("Lease owner is required.", nameof(leaseOwner));
        }

        if (batchSize <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(batchSize), batchSize, "Batch size must be positive.");
        }

        if (leaseDuration <= TimeSpan.Zero)
        {
            throw new ArgumentOutOfRangeException(nameof(leaseDuration), leaseDuration, "Lease duration must be positive.");
        }

        var candidates = await _context.Set<OutboxMessage>()
            .Where(m => m.Status == OutboxMessageStatus.Pending
                        && (m.LeasedUntilUtc == null || m.LeasedUntilUtc < nowUtc))
            .OrderBy(m => m.CreatedAtUtc)
            .Take(batchSize)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var leased = new List<OutboxMessage>(candidates.Count);

        foreach (var candidate in candidates)
        {
            candidate.LeasedBy = leaseOwner;
            candidate.LeasedUntilUtc = nowUtc + leaseDuration;

            try
            {
                await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
                leased.Add(candidate);
            }
            catch (DbUpdateConcurrencyException)
            {
                _context.Entry(candidate).State = EntityState.Detached;
            }
        }

        return leased;
    }

    // Records a successful publish. The row is kept, not deleted, so the outbox remains a
    // durable publish audit trail.
    public async Task MarkDispatchedAsync(
        Guid messageId,
        DateTimeOffset dispatchedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await FindRequiredAsync(messageId, cancellationToken).ConfigureAwait(false);

        message.Status = OutboxMessageStatus.Dispatched;
        message.DispatchedAtUtc = dispatchedAtUtc;
        message.LeasedBy = null;
        message.LeasedUntilUtc = null;

        await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
    }

    // Records a failed publish attempt and releases the lease immediately, so the row
    // becomes eligible for the next lease attempt rather than waiting out the full lease
    // duration. Retry-policy decisions (e.g. giving up after N attempts) belong to the
    // caller/relay, not this repository.
    public async Task RecordFailedAttemptAsync(
        Guid messageId,
        string failureReason,
        DateTimeOffset attemptedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await FindRequiredAsync(messageId, cancellationToken).ConfigureAwait(false);

        message.AttemptCount += 1;
        message.LastAttemptAtUtc = attemptedAtUtc;
        message.LastError = failureReason;
        message.LeasedBy = null;
        message.LeasedUntilUtc = null;

        await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
    }

    // Read-only backlog size (rows currently eligible to be leased), for a host's
    // queue/background-processing-health telemetry (OPS-002). Not used by leasing itself.
    public Task<int> CountPendingAsync(DateTimeOffset nowUtc, CancellationToken cancellationToken = default) =>
        _context.Set<OutboxMessage>()
            .Where(m => m.Status == OutboxMessageStatus.Pending
                        && (m.LeasedUntilUtc == null || m.LeasedUntilUtc < nowUtc))
            .CountAsync(cancellationToken);

    // Records a terminal failure (retry budget exhausted). Unlike RecordFailedAttemptAsync,
    // the row leaves the Pending pool for good — it is no longer a LeasePendingBatchAsync
    // candidate — but it is still kept, not deleted, for audit/troubleshooting.
    public async Task MarkPermanentlyFailedAsync(
        Guid messageId,
        string failureReason,
        DateTimeOffset attemptedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await FindRequiredAsync(messageId, cancellationToken).ConfigureAwait(false);

        message.Status = OutboxMessageStatus.Failed;
        message.AttemptCount += 1;
        message.LastAttemptAtUtc = attemptedAtUtc;
        message.LastError = failureReason;
        message.LeasedBy = null;
        message.LeasedUntilUtc = null;

        await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
    }

    private async Task<OutboxMessage> FindRequiredAsync(Guid messageId, CancellationToken cancellationToken)
    {
        return await _context.Set<OutboxMessage>().FindAsync([messageId], cancellationToken).ConfigureAwait(false)
            ?? throw new InvalidOperationException($"Outbox message '{messageId}' was not found.");
    }
}
