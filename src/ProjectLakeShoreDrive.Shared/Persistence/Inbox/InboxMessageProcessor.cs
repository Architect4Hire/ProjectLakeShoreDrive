using Microsoft.EntityFrameworkCore;

namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

// Reusable message-processing wrapper (README inbox rule): checks/reserves inbox state
// around a handler's execution against an owning domain's own DbContext. This is not a
// consumer — it does not know about any business message type or handler (RESTRICTION);
// a future domain consumer supplies the handler delegate and calls ProcessAsync per
// delivered message.
public sealed class InboxMessageProcessor(DbContext context)
{
    private readonly DbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    // Duplicate delivery is always safe: a message already Completed or permanently
    // Failed short-circuits without invoking handler again. Concurrent first-delivery
    // reservation is safe too: the MessageId primary key means only one caller can win
    // the insert; the loser reports ConcurrentlyProcessing instead of double-processing.
    public async Task<InboxProcessingResult> ProcessAsync(
        Guid messageId,
        string eventType,
        int eventVersion,
        string consumer,
        DateTimeOffset nowUtc,
        Func<CancellationToken, Task> handler,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handler);

        var existing = await _context.Set<InboxMessage>()
            .FirstOrDefaultAsync(m => m.MessageId == messageId, cancellationToken)
            .ConfigureAwait(false);

        if (existing is not null)
        {
            switch (existing.Status)
            {
                case InboxMessageStatus.Completed:
                    return new InboxProcessingResult(MessageProcessingOutcome.AlreadyProcessed);
                case InboxMessageStatus.Failed:
                    return new InboxProcessingResult(MessageProcessingOutcome.AlreadyPermanentlyFailed, existing.FailureReason);
                case InboxMessageStatus.Processing:
                    return new InboxProcessingResult(MessageProcessingOutcome.ConcurrentlyProcessing);
                case InboxMessageStatus.Received:
                default:
                    // Not yet attempted (or a prior attempt released it after a transient
                    // failure); safe to claim and try now.
                    existing.Status = InboxMessageStatus.Processing;
                    existing.ProcessingStartedAtUtc ??= nowUtc;

                    try
                    {
                        await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        // Another caller claimed this row between our read and our write.
                        _context.Entry(existing).State = EntityState.Detached;
                        return new InboxProcessingResult(MessageProcessingOutcome.ConcurrentlyProcessing);
                    }

                    return await RunHandlerAsync(existing, nowUtc, handler, cancellationToken).ConfigureAwait(false);
            }
        }

        var reservation = new InboxMessage
        {
            MessageId = messageId,
            EventType = eventType,
            EventVersion = eventVersion,
            Consumer = consumer,
            ReceivedAtUtc = nowUtc,
            ProcessingStartedAtUtc = nowUtc,
            Status = InboxMessageStatus.Processing,
        };

        _context.Set<InboxMessage>().Add(reservation);

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (DbUpdateException)
        {
            // Another caller inserted the same MessageId first (unique primary key).
            _context.Entry(reservation).State = EntityState.Detached;
            return new InboxProcessingResult(MessageProcessingOutcome.ConcurrentlyProcessing);
        }

        return await RunHandlerAsync(reservation, nowUtc, handler, cancellationToken).ConfigureAwait(false);
    }

    private async Task<InboxProcessingResult> RunHandlerAsync(
        InboxMessage message,
        DateTimeOffset nowUtc,
        Func<CancellationToken, Task> handler,
        CancellationToken cancellationToken)
    {
        try
        {
            await handler(cancellationToken).ConfigureAwait(false);

            message.Status = InboxMessageStatus.Completed;
            message.CompletedAtUtc = nowUtc;

            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return new InboxProcessingResult(MessageProcessingOutcome.Processed);
        }
        catch (PermanentMessageProcessingException ex)
        {
            message.Status = InboxMessageStatus.Failed;
            message.AttemptCount += 1;
            message.FailureReason = ex.Message;

            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return new InboxProcessingResult(MessageProcessingOutcome.PermanentFailure, ex.Message);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // Transient: release the claim (back to Received) so a redelivery of the same
            // MessageId can be attempted again.
            message.Status = InboxMessageStatus.Received;
            message.AttemptCount += 1;
            message.FailureReason = ex.Message;

            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return new InboxProcessingResult(MessageProcessingOutcome.TransientFailure, ex.Message);
        }
    }
}
