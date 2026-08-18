using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

// Contracts are the public wire boundary (BR-020..023), so what matters here is that each
// type round-trips through JSON exactly and that its DataAnnotations validation boundary
// rejects the inputs it documents as required.
public class ContractsSerializationTests
{
    private static T RoundTrip<T>(T value)
    {
        var json = JsonSerializer.Serialize(value);
        return JsonSerializer.Deserialize<T>(json)!;
    }

    // Record-generated equality compares IReadOnlyList<T> properties by reference, so a fresh
    // List<T> produced by deserialization never structurally equals the original collection
    // instance even when its contents match. Comparing the re-serialized JSON instead proves
    // the same round-trip property (serialize -> deserialize -> serialize is stable) without
    // being sensitive to which concrete collection type System.Text.Json materializes.
    private static void AssertRoundTrips<T>(T value)
    {
        var expectedJson = JsonSerializer.Serialize(value);
        var actualJson = JsonSerializer.Serialize(RoundTrip(value));

        Assert.Equal(expectedJson, actualJson);
    }

    private static IReadOnlyList<ValidationResult> Validate(object contract)
    {
        var context = new ValidationContext(contract);
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(contract, context, results, validateAllProperties: true);
        return results;
    }

    private static readonly EngagementTimelineContract Timeline = new()
    {
        StartDate = new DateOnly(2026, 1, 5),
        TargetEndDate = new DateOnly(2026, 6, 30)
    };

    private static readonly EngagementStakeholderContract Stakeholder = new()
    {
        Name = "Jane Doe",
        Role = "VP Engineering",
        Email = "jane@contoso.example"
    };

    private static readonly EngagementLifecycleTransitionContract Transition = new()
    {
        FromStatus = EngagementStatus.Draft,
        ToStatus = EngagementStatus.Discovery,
        PerformedBy = "pm@architect4hire.com",
        Reason = "Kickoff complete",
        OccurredAtUtc = DateTimeOffset.UtcNow
    };

    [Fact]
    public void EngagementTimelineContract_RoundTripsThroughJson()
    {
        Assert.Equal(Timeline, RoundTrip(Timeline));
    }

    [Fact]
    public void EngagementStakeholderContract_RoundTripsThroughJson()
    {
        Assert.Equal(Stakeholder, RoundTrip(Stakeholder));
    }

    [Fact]
    public void EngagementLifecycleTransitionContract_RoundTripsThroughJson()
    {
        Assert.Equal(Transition, RoundTrip(Transition));
    }

    [Fact]
    public void EngagementDetail_RoundTripsThroughJson()
    {
        var detail = new EngagementDetail
        {
            Id = Guid.NewGuid(),
            ClientId = Guid.NewGuid(),
            ClientName = "Contoso Retail",
            Name = "Contoso Cloud Migration",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            CurrentStateSummary = "Monolithic ASP.NET app on-prem.",
            TargetStateSummary = "Containerized services on Azure.",
            Timeline = Timeline,
            BusinessObjectives = ["Reduce peak-season downtime"],
            KnownTechnologyLandscape = [".NET Framework 4.8"],
            Stakeholders = [Stakeholder],
            Constraints = ["Must remain PCI compliant"],
            RequestedDeliverables = ["Architecture Vision"],
            Confidentiality = EngagementConfidentiality.ClientConfidential,
            Status = EngagementStatus.Discovery,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            ArchivedAtUtc = null,
            LifecycleHistory = [Transition]
        };

        AssertRoundTrips(detail);
    }

    [Fact]
    public void EngagementListItem_RoundTripsThroughJson()
    {
        var item = new EngagementListItem
        {
            Id = Guid.NewGuid(),
            ClientId = Guid.NewGuid(),
            ClientName = "Contoso Retail",
            Name = "Contoso Cloud Migration",
            Type = EngagementType.CloudMigration,
            Confidentiality = EngagementConfidentiality.ClientConfidential,
            Status = EngagementStatus.Discovery,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        Assert.Equal(item, RoundTrip(item));
    }

    [Fact]
    public void EngagementListQuery_RoundTripsThroughJson_WithDefaults()
    {
        var query = new EngagementListQuery { Status = EngagementStatus.Discovery, ClientId = Guid.NewGuid() };

        var roundTripped = RoundTrip(query);

        Assert.Equal(query, roundTripped);
        Assert.Equal(1, roundTripped.Page);
        Assert.Equal(25, roundTripped.PageSize);
    }

    [Fact]
    public void EngagementListResult_RoundTripsThroughJson()
    {
        var result = new EngagementListResult
        {
            Items =
            [
                new EngagementListItem
                {
                    Id = Guid.NewGuid(),
                    ClientId = Guid.NewGuid(),
                    ClientName = "Contoso Retail",
                    Name = "Contoso Cloud Migration",
                    Type = EngagementType.CloudMigration,
                    Confidentiality = EngagementConfidentiality.ClientConfidential,
                    Status = EngagementStatus.Discovery,
                    CreatedAtUtc = DateTimeOffset.UtcNow
                }
            ],
            TotalCount = 1,
            Page = 1,
            PageSize = 25
        };

        AssertRoundTrips(result);
    }

    [Fact]
    public void CreateEngagementRequest_RoundTripsThroughJson()
    {
        var request = new CreateEngagementRequest
        {
            ClientId = Guid.NewGuid(),
            ClientName = "Contoso Retail",
            Name = "Contoso Cloud Migration",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            Confidentiality = EngagementConfidentiality.ClientConfidential,
            CurrentStateSummary = "Monolithic ASP.NET app on-prem.",
            TargetStateSummary = "Containerized services on Azure.",
            Timeline = Timeline,
            BusinessObjectives = ["Reduce peak-season downtime"],
            KnownTechnologyLandscape = [".NET Framework 4.8"],
            Stakeholders = [Stakeholder],
            Constraints = ["Must remain PCI compliant"],
            RequestedDeliverables = ["Architecture Vision"]
        };

        AssertRoundTrips(request);
    }

    [Fact]
    public void UpdateEngagementRequest_RoundTripsThroughJson()
    {
        var request = new UpdateEngagementRequest
        {
            EngagementId = Guid.NewGuid(),
            Name = "Contoso Cloud Migration",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            Confidentiality = EngagementConfidentiality.ClientConfidential,
            Timeline = Timeline,
            Stakeholders = [Stakeholder]
        };

        AssertRoundTrips(request);
    }

    [Fact]
    public void TransitionEngagementPhaseRequest_RoundTripsThroughJson()
    {
        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = Guid.NewGuid(),
            TargetStatus = EngagementStatus.Discovery,
            PerformedBy = "pm@architect4hire.com",
            Reason = "Kickoff complete"
        };

        Assert.Equal(request, RoundTrip(request));
    }

    [Fact]
    public void ArchiveEngagementRequest_RoundTripsThroughJson()
    {
        var request = new ArchiveEngagementRequest
        {
            EngagementId = Guid.NewGuid(),
            PerformedBy = "pm@architect4hire.com",
            Reason = "Engagement cancelled by client."
        };

        Assert.Equal(request, RoundTrip(request));
    }

    [Fact]
    public void SearchEngagementsQuery_RoundTripsThroughJson()
    {
        var query = new SearchEngagementsQuery
        {
            SearchText = "contoso",
            Status = EngagementStatus.Discovery,
            ClientId = Guid.NewGuid()
        };

        Assert.Equal(query, RoundTrip(query));
    }

    [Theory]
    [InlineData(nameof(CreateEngagementRequest.ClientName))]
    [InlineData(nameof(CreateEngagementRequest.Name))]
    [InlineData(nameof(CreateEngagementRequest.BusinessProblem))]
    public void CreateEngagementRequest_MissingRequiredField_FailsValidation(string emptyPropertyName)
    {
        var request = new CreateEngagementRequest
        {
            ClientId = Guid.NewGuid(),
            ClientName = emptyPropertyName == nameof(CreateEngagementRequest.ClientName) ? "" : "Contoso Retail",
            Name = emptyPropertyName == nameof(CreateEngagementRequest.Name) ? "" : "Contoso Cloud Migration",
            Type = EngagementType.CloudMigration,
            BusinessProblem = emptyPropertyName == nameof(CreateEngagementRequest.BusinessProblem)
                ? ""
                : "Legacy on-prem platform cannot scale for peak seasonal traffic.",
            Confidentiality = EngagementConfidentiality.ClientConfidential
        };

        var results = Validate(request);

        Assert.Contains(results, r => r.MemberNames.Contains(emptyPropertyName));
    }

    [Fact]
    public void EngagementStakeholderContract_MissingEmail_IsValid()
    {
        var stakeholder = new EngagementStakeholderContract { Name = "Jane Doe", Role = "VP Engineering" };

        Assert.Empty(Validate(stakeholder));
    }

    [Fact]
    public void EngagementStakeholderContract_InvalidEmail_FailsValidation()
    {
        var stakeholder = new EngagementStakeholderContract
        {
            Name = "Jane Doe",
            Role = "VP Engineering",
            Email = "not-an-email"
        };

        var results = Validate(stakeholder);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(EngagementStakeholderContract.Email)));
    }

    [Fact]
    public void TransitionEngagementPhaseRequest_MissingPerformedBy_FailsValidation()
    {
        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = Guid.NewGuid(),
            TargetStatus = EngagementStatus.Discovery,
            PerformedBy = ""
        };

        var results = Validate(request);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(TransitionEngagementPhaseRequest.PerformedBy)));
    }

    [Fact]
    public void ArchiveEngagementRequest_MissingPerformedBy_FailsValidation()
    {
        var request = new ArchiveEngagementRequest { EngagementId = Guid.NewGuid(), PerformedBy = "" };

        var results = Validate(request);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ArchiveEngagementRequest.PerformedBy)));
    }

    [Fact]
    public void SearchEngagementsQuery_MissingSearchText_FailsValidation()
    {
        var query = new SearchEngagementsQuery { SearchText = "" };

        var results = Validate(query);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(SearchEngagementsQuery.SearchText)));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void EngagementListQuery_InvalidPage_FailsValidation(int page)
    {
        var query = new EngagementListQuery { Page = page };

        var results = Validate(query);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(EngagementListQuery.Page)));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(101)]
    public void EngagementListQuery_InvalidPageSize_FailsValidation(int pageSize)
    {
        var query = new EngagementListQuery { PageSize = pageSize };

        var results = Validate(query);

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(EngagementListQuery.PageSize)));
    }
}
