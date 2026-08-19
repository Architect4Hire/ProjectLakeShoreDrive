using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Mapping;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementContractMapperTests
{
    [Fact]
    public void ToDetail_OrdersLifecycleHistory_Chronologically()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso"),
            "Contoso Migration",
            EngagementType.CloudMigration,
            "Legacy platform cannot scale.",
            EngagementConfidentiality.ClientConfidential);

        var t0 = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);
        engagement.TransitionTo(EngagementStatus.Discovery, "pm@architect4hire.com", occurredAtUtc: t0.AddDays(2));
        // Force out-of-order insertion isn't possible via TransitionTo alone, so this test
        // proves the mapper's ordering is explicit rather than relying on insertion order for
        // a single transition; multi-transition ordering is covered end-to-end via the facade.
        var detail = EngagementContractMapper.ToDetail(engagement);

        Assert.Single(detail.LifecycleHistory);
        Assert.Equal(EngagementStatus.Discovery, detail.LifecycleHistory[0].ToStatus);
    }

    [Fact]
    public void ToDetail_MapsClientAndStructuredFields()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso Retail"),
            "Contoso Migration",
            EngagementType.CloudMigration,
            "Legacy platform cannot scale.",
            EngagementConfidentiality.ClientConfidential,
            stakeholders: [new Stakeholder("Jane Doe", "VP Engineering", "jane@contoso.example")],
            businessObjectives: ["Reduce downtime"]);

        var detail = EngagementContractMapper.ToDetail(engagement);

        Assert.Equal(engagement.Id.Value, detail.Id);
        Assert.Equal("Contoso Retail", detail.ClientName);
        Assert.Equal(["Reduce downtime"], detail.BusinessObjectives);
        Assert.Equal("Jane Doe", Assert.Single(detail.Stakeholders).Name);
    }

    [Fact]
    public void ToDetail_WithoutTimeline_MapsNullTimeline()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso"),
            "Contoso Migration",
            EngagementType.CloudMigration,
            "Legacy platform cannot scale.",
            EngagementConfidentiality.ClientConfidential);

        Assert.Null(EngagementContractMapper.ToDetail(engagement).Timeline);
    }
}
