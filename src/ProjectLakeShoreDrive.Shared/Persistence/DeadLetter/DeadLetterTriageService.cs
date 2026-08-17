namespace ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

// Analysis service for determining replay eligibility of dead-lettered messages (README OPS-002).
// Provides guidance to operators about whether a message *may* be safe to replay, but does NOT
// auto-replay. All replay decisions are explicit and authorized, captured in triage records.
public sealed class DeadLetterTriageService
{
    // Analyze a dead-lettered message and provide triage guidance. The service examines
    // the failure reason and attempt count to suggest whether manual replay is feasible.
    // Return value indicates whether the message is _potentially_ eligible for replay;
    // the operator still decides and records the final eligibility in triage state.
    public DeadLetterTriageGuidance AnalyzeForReplayEligibility(DeadLetteredMessage message)
    {
        ArgumentNullException.ThrowIfNull(message);

        // If already triaged to a decision, return that decision as-is.
        if (message.TriageStatus != DeadLetterTriageStatus.Unreviewed &&
            message.TriageStatus != DeadLetterTriageStatus.Diagnosis)
        {
            return new DeadLetterTriageGuidance(
                message.TriageStatus == DeadLetterTriageStatus.EligibleForReplay,
                $"Message has already been triaged to {message.TriageStatus}.");
        }

        var reasons = new List<string>();
        var isLikelyEligible = true;

        // Heuristic 1: Max retry exceeded (typically 10x for Service Bus).
        // If the message has been attempted many times, it may indicate a systemic issue
        // that won't be resolved by replaying the same message again.
        if (message.AttemptCount >= 10)
        {
            reasons.Add(
                "Message exceeded typical max-delivery count (10+). Systemic issue likely; " +
                "verify root cause before replay.");
            isLikelyEligible = false;
        }

        // Heuristic 2: Specific failure reasons that suggest transient vs. permanent issues.
        var deadLetterReason = message.DeadLetterReason?.ToLowerInvariant() ?? string.Empty;

        if (deadLetterReason.Contains("deserialization") ||
            deadLetterReason.Contains("schema") ||
            deadLetterReason.Contains("format"))
        {
            reasons.Add(
                "Failure was a deserialization/schema error. The message payload may be malformed; " +
                "verify format before replay.");
            isLikelyEligible = false;
        }

        if (deadLetterReason.Contains("unauthorized") ||
            deadLetterReason.Contains("forbidden") ||
            deadLetterReason.Contains("permission"))
        {
            reasons.Add(
                "Failure was an authorization error. Verify credentials/roles are configured " +
                "before replay.");
            isLikelyEligible = false;
        }

        if (deadLetterReason.Contains("not found") ||
            deadLetterReason.Contains("not exist"))
        {
            reasons.Add(
                "Message referenced a resource that did not exist at time of processing. " +
                "Verify the resource exists and is accessible before replay.");
            isLikelyEligible = false;
        }

        if (deadLetterReason.Contains("timeout") ||
            deadLetterReason.Contains("network") ||
            deadLetterReason.Contains("connection"))
        {
            reasons.Add(
                "Failure was network/timeout related (likely transient). " +
                "Verify downstream services are healthy before replay.");
            isLikelyEligible = true;
        }

        // Heuristic 3: Time since failure.
        // If the message failed long ago and you're only now investigating, the downstream
        // system state may have changed significantly.
        var hoursSinceDLQ = (DateTimeOffset.UtcNow - message.DeadLetteredAtUtc).TotalHours;
        if (hoursSinceDLQ > 24)
        {
            reasons.Add(
                $"Message was dead-lettered {hoursSinceDLQ:F1} hours ago. " +
                "Significant system state changes may have occurred; review carefully.");
        }

        if (reasons.Count == 0)
        {
            reasons.Add("No obvious barriers to replay detected. Apply domain-specific logic to confirm safety.");
        }

        return new DeadLetterTriageGuidance(isLikelyEligible, string.Join(" ", reasons));
    }
}

// Guidance provided to an operator reviewing a dead-lettered message.
public sealed class DeadLetterTriageGuidance(bool likelyEligibleForReplay, string reasoning)
{
    // Indicates whether the service heuristics suggest the message *could* be replayed.
    // This is guidance only; the operator makes the final decision.
    public bool LikelyEligibleForReplay { get; } = likelyEligibleForReplay;

    // Structured reasoning explaining the eligibility guidance.
    public string Reasoning { get; } = reasoning ?? throw new ArgumentNullException(nameof(reasoning));
}
