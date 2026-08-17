namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

public enum DeadLetterTriageStatus
{
    // Initial state: message has been recorded but not yet reviewed.
    Unreviewed = 0,

    // Being diagnosed: operator is investigating the root cause.
    Diagnosis = 1,

    // Reviewed and determined to be safe for manual replay (eligibility captured; no auto-replay).
    EligibleForReplay = 2,

    // Reviewed and determined to be unsafe for replay (e.g., transient failure with side effects already committed).
    IneligibleForReplay = 3,

    // Triage complete: message has been replayed or alternative action taken.
    Resolved = 4
}
