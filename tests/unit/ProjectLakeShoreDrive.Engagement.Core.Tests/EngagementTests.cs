using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementTests
{
    private static ClientReference DefaultClient() => new(Guid.NewGuid(), "Contoso Retail");

    private static Domain.Engagement CreateEngagement() =>
        Domain.Engagement.Create(
            DefaultClient(),
            "Contoso Cloud Migration",
            EngagementType.CloudMigration,
            "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            EngagementConfidentiality.ClientConfidential);

    [Fact]
    public void Create_WithRequiredFields_StartsInDraftWithNoLifecycleHistory()
    {
        var engagement = CreateEngagement();

        Assert.Equal(EngagementStatus.Draft, engagement.Status);
        Assert.Empty(engagement.LifecycleHistory);
        Assert.Null(engagement.ArchivedAtUtc);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_WithoutName_Throws(string? name)
    {
        Assert.Throws<ArgumentException>(() => Domain.Engagement.Create(
            DefaultClient(),
            name!,
            EngagementType.CloudMigration,
            "Business problem",
            EngagementConfidentiality.ClientConfidential));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_WithoutBusinessProblem_Throws(string? businessProblem)
    {
        Assert.Throws<ArgumentException>(() => Domain.Engagement.Create(
            DefaultClient(),
            "Engagement name",
            EngagementType.CloudMigration,
            businessProblem!,
            EngagementConfidentiality.ClientConfidential));
    }

    [Fact]
    public void Create_WithoutClient_Throws()
    {
        Assert.Throws<ArgumentNullException>(() => Domain.Engagement.Create(
            null!,
            "Engagement name",
            EngagementType.CloudMigration,
            "Business problem",
            EngagementConfidentiality.ClientConfidential));
    }

    [Theory]
    [InlineData(EngagementStatus.Draft, EngagementStatus.Discovery, true)]
    [InlineData(EngagementStatus.Discovery, EngagementStatus.Analysis, true)]
    [InlineData(EngagementStatus.Analysis, EngagementStatus.Architecture, true)]
    [InlineData(EngagementStatus.Architecture, EngagementStatus.Estimation, true)]
    [InlineData(EngagementStatus.Estimation, EngagementStatus.PackageGeneration, true)]
    [InlineData(EngagementStatus.PackageGeneration, EngagementStatus.Review, true)]
    [InlineData(EngagementStatus.Review, EngagementStatus.Approved, true)]
    [InlineData(EngagementStatus.Approved, EngagementStatus.Delivery, true)]
    [InlineData(EngagementStatus.Delivery, EngagementStatus.Closed, true)]
    [InlineData(EngagementStatus.Closed, EngagementStatus.Archived, true)]
    [InlineData(EngagementStatus.Draft, EngagementStatus.Archived, true)]
    [InlineData(EngagementStatus.Discovery, EngagementStatus.Archived, true)]
    public void TransitionTo_ValidTransition_Succeeds(EngagementStatus from, EngagementStatus to, bool expectedValid)
    {
        var engagement = CreateEngagement();
        AdvanceTo(engagement, from);

        engagement.TransitionTo(to, "pm@architect4hire.com", "moving forward");

        Assert.True(expectedValid);
        Assert.Equal(to, engagement.Status);
        Assert.Equal(from, engagement.LifecycleHistory[^1].FromStatus);
        Assert.Equal(to, engagement.LifecycleHistory[^1].ToStatus);
        Assert.Equal("pm@architect4hire.com", engagement.LifecycleHistory[^1].PerformedBy);
    }

    [Theory]
    [InlineData(EngagementStatus.Draft, EngagementStatus.Analysis)]
    [InlineData(EngagementStatus.Draft, EngagementStatus.Approved)]
    [InlineData(EngagementStatus.Discovery, EngagementStatus.Draft)]
    [InlineData(EngagementStatus.Closed, EngagementStatus.Review)]
    public void TransitionTo_InvalidTransition_Throws(EngagementStatus from, EngagementStatus to)
    {
        var engagement = CreateEngagement();
        AdvanceTo(engagement, from);

        var status = engagement.Status;
        var ex = Assert.Throws<InvalidEngagementLifecycleTransitionException>(
            () => engagement.TransitionTo(to, "pm@architect4hire.com"));

        Assert.Equal(from, ex.FromStatus);
        Assert.Equal(to, ex.ToStatus);
        Assert.Equal(status, engagement.Status);
    }

    [Fact]
    public void TransitionTo_FromArchived_AlwaysThrows()
    {
        var engagement = CreateEngagement();
        engagement.TransitionTo(EngagementStatus.Archived, "pm@architect4hire.com");

        Assert.Throws<InvalidEngagementLifecycleTransitionException>(
            () => engagement.TransitionTo(EngagementStatus.Discovery, "pm@architect4hire.com"));
    }

    [Fact]
    public void TransitionTo_WithoutPerformedBy_Throws()
    {
        var engagement = CreateEngagement();

        Assert.Throws<ArgumentException>(
            () => engagement.TransitionTo(EngagementStatus.Discovery, "   "));
    }

    [Fact]
    public void Archive_SetsStatusAndArchivedAtUtc()
    {
        var engagement = CreateEngagement();
        var before = DateTimeOffset.UtcNow;

        engagement.Archive("pm@architect4hire.com", "Engagement cancelled by client.");

        Assert.Equal(EngagementStatus.Archived, engagement.Status);
        Assert.NotNull(engagement.ArchivedAtUtc);
        Assert.True(engagement.ArchivedAtUtc >= before);
        Assert.Equal("Engagement cancelled by client.", engagement.LifecycleHistory[^1].Reason);
    }

    private static void AdvanceTo(Domain.Engagement engagement, EngagementStatus target)
    {
        if (target == EngagementStatus.Draft)
        {
            return;
        }

        EngagementStatus[] sequence =
        [
            EngagementStatus.Discovery,
            EngagementStatus.Analysis,
            EngagementStatus.Architecture,
            EngagementStatus.Estimation,
            EngagementStatus.PackageGeneration,
            EngagementStatus.Review,
            EngagementStatus.Approved,
            EngagementStatus.Delivery,
            EngagementStatus.Closed
        ];

        foreach (var status in sequence)
        {
            engagement.TransitionTo(status, "seed@architect4hire.com");

            if (status == target)
            {
                return;
            }
        }
    }
}
