using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay;

// Host-agnostic outbox relay orchestration (README outbox rule; OPS-002): lease a batch,
// serialize/publish each row, record the outcome. This class is not scheduled by itself —
// no timer, no IHostedService — a later, separate seam wraps RunOnceAsync in a schedule.
// It also does not embed any Service Bus entity name: the destination for each row is
// resolved by a caller-supplied selector, since no ADR yet approves a concrete topic/queue
// topology (docs/design/ongoing-architecture-plan.md, item 8).
public sealed class OutboxRelay(
    OutboxRepository repository,
    IIntegrationEventPublisher publisher,
    Func<OutboxMessage, PublishDestination> destinationSelector,
    string leaseOwner,
    TimeSpan leaseDuration,
    int maxAttempts)
{
    private readonly OutboxRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    private readonly IIntegrationEventPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
    private readonly Func<OutboxMessage, PublishDestination> _destinationSelector = destinationSelector ?? throw new ArgumentNullException(nameof(destinationSelector));
    private readonly string _leaseOwner = string.IsNullOrWhiteSpace(leaseOwner)
        ? throw new ArgumentException("Lease owner is required.", nameof(leaseOwner))
        : leaseOwner;
    private readonly TimeSpan _leaseDuration = leaseDuration;
    private readonly int _maxAttempts = maxAttempts > 0
        ? maxAttempts
        : throw new ArgumentOutOfRangeException(nameof(maxAttempts), maxAttempts, "Max attempts must be positive.");

    // Lease -> serialize/publish -> mark success/failure, for one bounded batch. Cancellation
    // is explicit: a cancellation requested before or during a row's own work propagates out
    // (it is not swallowed and not recorded as a publish failure) and stops the batch — rows
    // not yet processed simply remain leased until their lease naturally expires.
    public async Task<OutboxRelayBatchResult> RunOnceAsync(
        int batchSize,
        DateTimeOffset nowUtc,
        CancellationToken cancellationToken = default)
    {
        var leased = await _repository
            .LeasePendingBatchAsync(_leaseOwner, batchSize, _leaseDuration, nowUtc, cancellationToken)
            .ConfigureAwait(false);

        var dispatched = new List<Guid>();
        var retriedFailures = new List<Guid>();
        var permanentlyFailed = new List<Guid>();

        foreach (var message in leased)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var destination = _destinationSelector(message);
                var prepared = ToPreparedMessage(message);

                await _publisher.PublishAsync(destination, prepared, cancellationToken).ConfigureAwait(false);
                await _repository.MarkDispatchedAsync(message.Id, nowUtc, cancellationToken).ConfigureAwait(false);

                dispatched.Add(message.Id);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // AttemptCount here is the count before this failure; +1 accounts for the
                // attempt that just failed, so maxAttempts is the total number of tries
                // allowed, not the number of retries after the first.
                if (message.AttemptCount + 1 >= _maxAttempts)
                {
                    await _repository.MarkPermanentlyFailedAsync(message.Id, ex.Message, nowUtc, cancellationToken).ConfigureAwait(false);
                    permanentlyFailed.Add(message.Id);
                }
                else
                {
                    await _repository.RecordFailedAttemptAsync(message.Id, ex.Message, nowUtc, cancellationToken).ConfigureAwait(false);
                    retriedFailures.Add(message.Id);
                }
            }
        }

        return new OutboxRelayBatchResult(dispatched, retriedFailures, permanentlyFailed);
    }

    // MessageId is the outbox row's stable Id, unchanged across retries/redeliveries, so a
    // downstream consumer's inbox can deduplicate a republished message safely.
    private static PreparedIntegrationMessage ToPreparedMessage(OutboxMessage message) => new(
        MessageId: message.Id,
        Body: message.PayloadJson,
        ContentType: "application/json",
        EventType: message.EventType,
        EventVersion: message.EventVersion,
        CorrelationId: message.CorrelationId,
        CausationId: message.CausationId,
        BusinessKey: message.BusinessKey);
}
