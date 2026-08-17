using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

// Thin host: the schedule is configuration-driven (%OutboxRelay:Schedule%, not a literal
// cron string in code), and the function body only delegates to the reusable OutboxRelay
// and records telemetry. No business consumer logic lives here.
public sealed class OutboxRelayTimerFunction(
    OutboxRelay relay,
    OutboxRepository repository,
    IOptions<OutboxRelayHostOptions> options,
    OutboxRelayTelemetry telemetry,
    ILogger<OutboxRelayTimerFunction> logger)
{
    [Function(nameof(OutboxRelayTimerFunction))]
    public async Task RunAsync(
        [TimerTrigger("%OutboxRelay:Schedule%")] TimerInfo timer,
        CancellationToken cancellationToken)
    {
        var nowUtc = DateTimeOffset.UtcNow;

        var backlog = await repository.CountPendingAsync(nowUtc, cancellationToken).ConfigureAwait(false);
        telemetry.RecordBacklog(backlog);

        var result = await relay.RunOnceAsync(options.Value.BatchSize, nowUtc, cancellationToken).ConfigureAwait(false);
        telemetry.RecordRun(result);

        logger.LogInformation(
            "Outbox relay run complete. Dispatched={Dispatched} RetriedFailures={RetriedFailures} PermanentlyFailed={PermanentlyFailed} BacklogBeforeRun={Backlog}",
            result.Dispatched.Count,
            result.RetriedFailures.Count,
            result.PermanentlyFailed.Count,
            backlog);

        if (result.PermanentlyFailed.Count > 0)
        {
            logger.LogError(
                "{Count} outbox message(s) permanently failed to publish: {MessageIds}",
                result.PermanentlyFailed.Count,
                string.Join(", ", result.PermanentlyFailed));
        }
    }
}
