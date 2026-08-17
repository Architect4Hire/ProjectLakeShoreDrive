using System.Diagnostics.Metrics;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

// Queue/background-processing-health telemetry (OPS-002) for the relay host. Backlog and
// per-run outcome counts are the metrics a relay's operator needs, kept separate from the
// (host-agnostic, telemetry-free) OutboxRelay orchestration class itself.
public sealed class OutboxRelayTelemetry : IDisposable
{
    public const string MeterName = "ProjectLakeShoreDrive.Messaging.OutboxRelay";

    private readonly Meter _meter = new(MeterName);
    private readonly Counter<long> _dispatched;
    private readonly Counter<long> _retriedFailures;
    private readonly Counter<long> _permanentlyFailed;
    private readonly Histogram<long> _backlog;

    public OutboxRelayTelemetry()
    {
        _dispatched = _meter.CreateCounter<long>("outbox_relay.dispatched", description: "Outbox messages successfully published.");
        _retriedFailures = _meter.CreateCounter<long>("outbox_relay.retried_failures", description: "Publish attempts that failed but remain retryable.");
        _permanentlyFailed = _meter.CreateCounter<long>("outbox_relay.permanently_failed", description: "Outbox messages that exhausted their retry budget.");
        _backlog = _meter.CreateHistogram<long>("outbox_relay.backlog", description: "Pending outbox rows observed at the start of a relay run.");
    }

    public void RecordRun(OutboxRelayBatchResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        _dispatched.Add(result.Dispatched.Count);
        _retriedFailures.Add(result.RetriedFailures.Count);
        _permanentlyFailed.Add(result.PermanentlyFailed.Count);
    }

    public void RecordBacklog(long backlog) => _backlog.Record(backlog);

    public void Dispose() => _meter.Dispose();
}
