using ProjectLakeShoreDrive.Engagement.Core.Business;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementLifecyclePolicyTests
{
    private readonly EngagementLifecyclePolicy _policy = new();

    [Fact]
    public void AllowedTransitionsFrom_Draft_ReturnsDiscoveryAndArchived()
    {
        var allowed = _policy.AllowedTransitionsFrom(EngagementStatus.Draft);

        Assert.Equal([EngagementStatus.Discovery, EngagementStatus.Archived], allowed.OrderBy(s => s));
    }

    [Fact]
    public void AllowedTransitionsFrom_Archived_ReturnsEmpty()
    {
        Assert.Empty(_policy.AllowedTransitionsFrom(EngagementStatus.Archived));
    }

    [Fact]
    public void Evaluate_NextInSequence_IsAllowed()
    {
        var evaluation = _policy.Evaluate(EngagementStatus.Draft, EngagementStatus.Discovery);

        Assert.True(evaluation.IsAllowed);
        Assert.Null(evaluation.BlockedReason);
    }

    [Fact]
    public void Evaluate_SkippingAPhase_IsBlockedWithReason()
    {
        var evaluation = _policy.Evaluate(EngagementStatus.Draft, EngagementStatus.Architecture);

        Assert.False(evaluation.IsAllowed);
        Assert.NotNull(evaluation.BlockedReason);
        Assert.Contains("Discovery", evaluation.BlockedReason);
    }

    [Fact]
    public void Evaluate_FromArchived_IsBlockedWithTerminalReason()
    {
        var evaluation = _policy.Evaluate(EngagementStatus.Archived, EngagementStatus.Discovery);

        Assert.False(evaluation.IsAllowed);
        Assert.Contains("archived", evaluation.BlockedReason, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Evaluate_ToArchived_FromAnyNonTerminalState_IsAllowed()
    {
        var evaluation = _policy.Evaluate(EngagementStatus.Estimation, EngagementStatus.Archived);

        Assert.True(evaluation.IsAllowed);
    }
}
