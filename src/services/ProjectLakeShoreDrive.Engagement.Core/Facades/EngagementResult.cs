using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

public enum EngagementFailureKind
{
    Validation,
    NotFound,
    LifecycleConflict,
    ConcurrencyConflict,
    Forbidden
}

// Typed failure detail. Not every field applies to every kind: Errors is populated for
// Validation, FromStatus/ToStatus/AllowedTransitions for LifecycleConflict.
public sealed record EngagementFailure(
    EngagementFailureKind Kind,
    string Message,
    IReadOnlyDictionary<string, string[]>? Errors = null,
    EngagementStatus? FromStatus = null,
    EngagementStatus? ToStatus = null,
    IReadOnlyList<EngagementStatus>? AllowedTransitions = null);

// Explicit result/error contract (backend.md: "Prefer explicit result/error contracts to
// transport-specific exceptions leaking inward") so callers never need to catch an exception
// to learn why an Engagement operation failed.
public readonly struct EngagementResult<T>
{
    private EngagementResult(bool isSuccess, T? value, EngagementFailure? failure)
    {
        IsSuccess = isSuccess;
        Value = value;
        Failure = failure;
    }

    public bool IsSuccess { get; }

    public T? Value { get; }

    public EngagementFailure? Failure { get; }

    public static EngagementResult<T> Ok(T value) => new(true, value, null);

    public static EngagementResult<T> Fail(EngagementFailure failure) => new(false, default, failure);
}
