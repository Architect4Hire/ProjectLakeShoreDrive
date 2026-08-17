namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

// A handler throws this to explicitly signal a non-retryable failure (e.g. a validation/
// business-rule failure per README messaging rules) — anything else the handler throws is
// treated as transient and safe to redeliver.
public sealed class PermanentMessageProcessingException(string message, Exception? innerException = null)
    : Exception(message, innerException);
