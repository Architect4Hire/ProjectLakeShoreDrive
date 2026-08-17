using ProjectLakeShoreDrive.Shared.Persistence.DeadLetter;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class DeadLetterTriageServiceTests
{
    private static DeadLetteredMessage CreateTestMessage(
        DeadLetterTriageStatus triageStatus = DeadLetterTriageStatus.Unreviewed,
        int attemptCount = 5,
        string deadLetterReason = "timeout",
        string? deadLetterDescription = null)
    {
        return new DeadLetteredMessage
        {
            MessageId = Guid.NewGuid(),
            CorrelationId = Guid.NewGuid(),
            EventType = "OrderCreated",
            EventVersion = 1,
            Consumer = "OrderProcessor",
            Producer = "OrderService",
            OccurredAtUtc = DateTimeOffset.UtcNow.AddHours(-1),
            ReceivedAtUtc = DateTimeOffset.UtcNow.AddMinutes(-30),
            DeadLetteredAtUtc = DateTimeOffset.UtcNow,
            AttemptCount = attemptCount,
            DeadLetterReason = deadLetterReason,
            DeadLetterDescription = deadLetterDescription,
            TriageStatus = triageStatus
        };
    }

    [Fact]
    public void AnalyzeForReplayEligibility_IfAlreadyTriaged_ReturnsPriorDecision()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            triageStatus: DeadLetterTriageStatus.EligibleForReplay);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.True(guidance.LikelyEligibleForReplay);
        Assert.Contains("already been triaged", guidance.Reasoning);
    }

    [Fact]
    public void AnalyzeForReplayEligibility_TimeoutError_SuggestsEligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "timeout",
            attemptCount: 3);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.True(guidance.LikelyEligibleForReplay);
        Assert.Contains("transient", guidance.Reasoning.ToLowerInvariant());
    }

    [Fact]
    public void AnalyzeForReplayEligibility_NetworkError_SuggestsEligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "connection error",
            attemptCount: 2);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.True(guidance.LikelyEligibleForReplay);
    }

    [Fact]
    public void AnalyzeForReplayEligibility_DeserializationError_SuggestsIneligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "deserialization error",
            attemptCount: 3);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.False(guidance.LikelyEligibleForReplay);
        Assert.Contains("deserial", guidance.Reasoning.ToLowerInvariant());
    }

    [Fact]
    public void AnalyzeForReplayEligibility_SchemaError_SuggestsIneligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "schema validation failed");

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.False(guidance.LikelyEligibleForReplay);
    }

    [Fact]
    public void AnalyzeForReplayEligibility_AuthorizationError_SuggestsIneligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "unauthorized access");

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.False(guidance.LikelyEligibleForReplay);
    }

    [Fact]
    public void AnalyzeForReplayEligibility_NotFoundError_SuggestsIneligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "entity not found");

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.False(guidance.LikelyEligibleForReplay);
    }

    [Fact]
    public void AnalyzeForReplayEligibility_ExcessiveAttempts_SuggestsIneligible()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            attemptCount: 15);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.False(guidance.LikelyEligibleForReplay);
        Assert.Contains("max-delivery", guidance.Reasoning.ToLowerInvariant());
    }

    [Fact]
    public void AnalyzeForReplayEligibility_OldDeadLetter_WarnsAboutSystemStateChange()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage();
        // Backdate to 48 hours ago.
        message.DeadLetteredAtUtc = DateTimeOffset.UtcNow.AddHours(-48);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.Contains("hours ago", guidance.Reasoning.ToLowerInvariant());
        Assert.Contains("significant system state", guidance.Reasoning.ToLowerInvariant());
    }

    [Fact]
    public void AnalyzeForReplayEligibility_RecentDeadLetter_DoesNotWarn()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage();
        // Recent message.
        message.DeadLetteredAtUtc = DateTimeOffset.UtcNow.AddMinutes(-10);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.DoesNotContain("hours ago", guidance.Reasoning.ToLowerInvariant());
    }

    [Fact]
    public void AnalyzeForReplayEligibility_NoObviousBarriers_ProvidesDomainLogicGuidance()
    {
        var service = new DeadLetterTriageService();
        var message = CreateTestMessage(
            deadLetterReason: "generic error",
            attemptCount: 2);

        var guidance = service.AnalyzeForReplayEligibility(message);

        Assert.Contains("domain-specific", guidance.Reasoning.ToLowerInvariant());
    }
}
