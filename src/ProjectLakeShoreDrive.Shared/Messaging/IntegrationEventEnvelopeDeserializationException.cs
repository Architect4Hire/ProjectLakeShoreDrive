namespace ProjectLakeShoreDrive.Shared.Messaging;

public enum IntegrationEventEnvelopeDeserializationFailureReason
{
    // JSON is syntactically invalid, or required envelope fields are missing/blank.
    Malformed,

    // JSON is well-formed but EventVersion is not one the caller declared it can handle.
    UnsupportedEventVersion
}

// Typed failure so a consumer can distinguish "this message is broken" (candidate for
// dead-letter) from "this message is a version I don't understand yet" (candidate for a
// different handling/upgrade path), rather than catching a generic JsonException.
public sealed class IntegrationEventEnvelopeDeserializationException(
    IntegrationEventEnvelopeDeserializationFailureReason reason,
    string message,
    Exception? innerException = null)
    : Exception(message, innerException)
{
    public IntegrationEventEnvelopeDeserializationFailureReason Reason { get; } = reason;
}
