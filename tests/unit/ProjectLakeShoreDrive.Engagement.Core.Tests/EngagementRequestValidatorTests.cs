using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Validation;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementRequestValidatorTests
{
    private static CreateEngagementRequest ValidCreateRequest() => new()
    {
        ClientId = Guid.NewGuid(),
        ClientName = "Contoso Retail",
        Name = "Contoso Cloud Migration",
        Type = EngagementType.CloudMigration,
        BusinessProblem = "Legacy platform cannot scale.",
        Confidentiality = EngagementConfidentiality.ClientConfidential
    };

    [Fact]
    public void ValidateCreate_WithValidRequest_ReturnsNoErrors()
    {
        Assert.Empty(EngagementRequestValidator.ValidateCreate(ValidCreateRequest()));
    }

    [Fact]
    public void ValidateCreate_WithTimelineEndBeforeStart_ReturnsTimelineError()
    {
        var request = ValidCreateRequest() with
        {
            Timeline = new EngagementTimelineContract
            {
                StartDate = new DateOnly(2026, 6, 1),
                TargetEndDate = new DateOnly(2026, 1, 1)
            }
        };

        var errors = EngagementRequestValidator.ValidateCreate(request);

        Assert.Contains(errors.Keys, key => key.Contains("TargetEndDate"));
    }

    [Fact]
    public void ValidateCreate_WithInvalidNestedStakeholder_ReturnsIndexedError()
    {
        var request = ValidCreateRequest() with
        {
            Stakeholders = [new EngagementStakeholderContract { Name = "", Role = "VP Engineering" }]
        };

        var errors = EngagementRequestValidator.ValidateCreate(request);

        Assert.Contains(errors.Keys, key => key == "Stakeholders[0].Name");
    }

    [Fact]
    public void ValidateCreate_WithTooManyCollectionItems_ReturnsBoundsError()
    {
        var request = ValidCreateRequest() with
        {
            BusinessObjectives = Enumerable.Range(0, 51).Select(i => $"Objective {i}").ToList()
        };

        var errors = EngagementRequestValidator.ValidateCreate(request);

        Assert.Contains(errors.Keys, key => key == nameof(CreateEngagementRequest.BusinessObjectives));
    }

    [Fact]
    public void ValidateCreate_WithUndefinedEnumValue_ReturnsError()
    {
        var request = ValidCreateRequest() with { Type = (EngagementType)999 };

        var errors = EngagementRequestValidator.ValidateCreate(request);

        Assert.Contains(errors.Keys, key => key == nameof(CreateEngagementRequest.Type));
    }

    [Fact]
    public void ValidateTransition_WithUndefinedTargetStatus_ReturnsError()
    {
        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = Guid.NewGuid(),
            TargetStatus = (EngagementStatus)999,
            PerformedBy = "pm@architect4hire.com"
        };

        var errors = EngagementRequestValidator.ValidateTransition(request);

        Assert.Contains(errors.Keys, key => key == nameof(TransitionEngagementPhaseRequest.TargetStatus));
    }

    [Fact]
    public void ValidateListQuery_WithUndefinedStatus_ReturnsError()
    {
        var query = new EngagementListQuery { Status = (EngagementStatus)999 };

        var errors = EngagementRequestValidator.ValidateListQuery(query);

        Assert.Contains(errors.Keys, key => key == nameof(EngagementListQuery.Status));
    }
}
