namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

public enum MessageProcessingOutcome
{
    // The handler ran and completed successfully.
    Processed,

    // A prior delivery already completed this message; the handler was not invoked
    // (duplicate delivery is safe by construction).
    AlreadyProcessed,

    // A prior delivery already permanently failed this message; the handler was not
    // invoked (terminal — not retried).
    AlreadyPermanentlyFailed,

    // Another concurrent delivery is reserving/processing this message right now; the
    // handler was not invoked here to avoid double-processing.
    ConcurrentlyProcessing,

    // The handler ran and threw a non-permanent exception; safe to redeliver/retry.
    TransientFailure,

    // The handler ran and signaled (via PermanentMessageProcessingException) that this
    // message must not be retried.
    PermanentFailure
}
