using Microsoft.EntityFrameworkCore;

namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

// Default in-process implementation of dead-letter observability (README OPS-002).
// Records messages when they reach the DLQ for operator review and triage.
// Persists in the caller's domain DbContext; each bounded domain owns its dead-letter records
// (no cross-domain DLQ sharing).
public sealed class DeadLetterRegistry(DbContext context) : IDeadLetterRegistry
{
    private readonly DbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    public async Task RecordDeadLetteredMessageAsync(
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
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(eventType);
        ArgumentNullException.ThrowIfNullOrEmpty(consumer);
        ArgumentNullException.ThrowIfNullOrEmpty(producer);
        ArgumentNullException.ThrowIfNullOrEmpty(deadLetterReason);

        var record = new DeadLetteredMessage
        {
            MessageId = messageId,
            CorrelationId = correlationId,
            CausationId = causationId,
            EventType = eventType,
            EventVersion = eventVersion,
            Consumer = consumer,
            Producer = producer,
            OccurredAtUtc = occurredAtUtc,
            ReceivedAtUtc = receivedAtUtc,
            DeadLetteredAtUtc = DateTimeOffset.UtcNow,
            AttemptCount = attemptCount,
            DeadLetterReason = deadLetterReason,
            DeadLetterDescription = deadLetterDescription,
            BusinessKey = businessKey,
            TriageStatus = DeadLetterTriageStatus.Unreviewed
        };

        _context.Set<DeadLetteredMessage>().Add(record);

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (DbUpdateException ex) when (ex.InnerException is InvalidOperationException &&
                                          ex.InnerException.Message.Contains("duplicate key"))
        {
            // This message has already been recorded as dead-lettered. Idempotent: skip silently.
            _context.Entry(record).State = EntityState.Detached;
        }
    }

    public async Task<DeadLetteredMessage?> GetByMessageIdAsync(
        Guid messageId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DeadLetteredMessage>()
            .FirstOrDefaultAsync(m => m.MessageId == messageId, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<DeadLetteredMessage>> GetUnreviewedAsync(
        int maxResults = 100,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DeadLetteredMessage>()
            .Where(m => m.TriageStatus == DeadLetterTriageStatus.Unreviewed)
            .OrderBy(m => m.DeadLetteredAtUtc)
            .Take(maxResults)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<DeadLetteredMessage>> GetByTriageStatusAsync(
        DeadLetterTriageStatus status,
        int maxResults = 100,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DeadLetteredMessage>()
            .Where(m => m.TriageStatus == status)
            .OrderBy(m => m.DeadLetteredAtUtc)
            .Take(maxResults)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<DeadLetteredMessage>> GetByConsumerAsync(
        string consumer,
        int maxResults = 100,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(consumer);

        return await _context.Set<DeadLetteredMessage>()
            .Where(m => m.Consumer == consumer)
            .OrderByDescending(m => m.DeadLetteredAtUtc)
            .Take(maxResults)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<DeadLetteredMessage>> GetByBusinessKeyAsync(
        string businessKey,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(businessKey);

        return await _context.Set<DeadLetteredMessage>()
            .Where(m => m.BusinessKey == businessKey)
            .OrderByDescending(m => m.DeadLetteredAtUtc)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task UpdateTriageAsync(
        Guid messageId,
        DeadLetterTriageStatus triageStatus,
        string? triageNotes,
        string reviewedBy,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(reviewedBy);

        var record = await _context.Set<DeadLetteredMessage>()
            .FirstOrDefaultAsync(m => m.MessageId == messageId, cancellationToken)
            .ConfigureAwait(false);

        if (record is null)
        {
            throw new InvalidOperationException($"Dead-lettered message {messageId} not found.");
        }

        record.TriageStatus = triageStatus;
        record.TriageNotes = triageNotes;
        record.ReviewedBy = reviewedBy;
        record.ReviewedAtUtc = DateTimeOffset.UtcNow;

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException(
                $"Dead-lettered message {messageId} was concurrently updated. Retry the triage update.");
        }
    }

    public async Task<IReadOnlyList<DeadLetteredMessage>> GetEligibleForReplayAsync(
        int maxResults = 100,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<DeadLetteredMessage>()
            .Where(m => m.TriageStatus == DeadLetterTriageStatus.EligibleForReplay)
            .OrderBy(m => m.DeadLetteredAtUtc)
            .Take(maxResults)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }
}
