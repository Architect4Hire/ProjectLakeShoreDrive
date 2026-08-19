using Microsoft.Extensions.Logging.Abstractions;
using ProjectLakeShoreDrive.Engagement.Core.Business;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Data;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Facades;
using ProjectLakeShoreDrive.Engagement.Core.Tests.Fakes;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests;

public class EngagementFacadeTests
{
    private static readonly EngagementActor Actor = new("user-123", "Jane PM", EngagementRole.PrincipalArchitect);

    private static (EngagementFacade Facade, FakeEngagementUnitOfWork UnitOfWork) CreateSut()
    {
        var unitOfWork = new FakeEngagementUnitOfWork();
        var facade = new EngagementFacade(
            unitOfWork, new EngagementLifecyclePolicy(), TimeProvider.System, NullLogger<EngagementFacade>.Instance);
        return (facade, unitOfWork);
    }

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
    public async Task CreateAsync_WithValidRequest_ReturnsDetail_AndPersists()
    {
        var (facade, unitOfWork) = CreateSut();

        var result = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("Contoso Cloud Migration", result.Value!.Name);
        Assert.Single(unitOfWork.FakeEngagements.Store);
    }

    [Fact]
    public async Task CreateAsync_WithInvalidRequest_ReturnsValidationFailure()
    {
        var (facade, _) = CreateSut();
        var request = ValidCreateRequest() with { Name = "" };

        var result = await facade.CreateAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.Validation, result.Failure!.Kind);
        Assert.NotNull(result.Failure.Errors);
    }

    [Fact]
    public async Task CreateAsync_WhenSaveConflicts_ReturnsConcurrencyFailure()
    {
        var (facade, unitOfWork) = CreateSut();
        unitOfWork.NextSaveOutcome = EngagementSaveOutcome.ConcurrencyConflict;

        var result = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.ConcurrencyConflict, result.Failure!.Kind);
    }

    [Fact]
    public async Task UpdateAsync_WhenEngagementMissing_ReturnsNotFound()
    {
        var (facade, _) = CreateSut();
        var request = new UpdateEngagementRequest
        {
            EngagementId = Guid.NewGuid(),
            Name = "Updated Name",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Updated problem statement.",
            Confidentiality = EngagementConfidentiality.ClientConfidential
        };

        var result = await facade.UpdateAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.NotFound, result.Failure!.Kind);
    }

    [Fact]
    public async Task UpdateAsync_WhenEngagementArchived_ReturnsLifecycleConflict()
    {
        var (facade, unitOfWork) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);
        var engagement = unitOfWork.FakeEngagements.Store[new EngagementId(created.Value!.Id)];
        engagement.Archive(Actor.UserId);

        var request = new UpdateEngagementRequest
        {
            EngagementId = created.Value.Id,
            Name = "Updated Name",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Updated problem statement.",
            Confidentiality = EngagementConfidentiality.ClientConfidential
        };

        var result = await facade.UpdateAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.LifecycleConflict, result.Failure!.Kind);
    }

    [Fact]
    public async Task UpdateAsync_WithValidRequest_UpdatesFields()
    {
        var (facade, _) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        var request = new UpdateEngagementRequest
        {
            EngagementId = created.Value!.Id,
            Name = "Renamed Engagement",
            Type = EngagementType.CloudMigration,
            BusinessProblem = "Updated problem statement.",
            Confidentiality = EngagementConfidentiality.ClientConfidential
        };

        var result = await facade.UpdateAsync(request, Actor, CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("Renamed Engagement", result.Value!.Name);
    }

    [Fact]
    public async Task GetAsync_WhenMissing_ReturnsNotFound()
    {
        var (facade, _) = CreateSut();

        var result = await facade.GetAsync(Guid.NewGuid(), CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.NotFound, result.Failure!.Kind);
    }

    [Fact]
    public async Task ListAsync_ExcludesArchived_ByDefault()
    {
        var (facade, unitOfWork) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);
        var engagement = unitOfWork.FakeEngagements.Store[new EngagementId(created.Value!.Id)];
        engagement.Archive(Actor.UserId);

        var result = await facade.ListAsync(new EngagementListQuery(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Empty(result.Value!.Items);
    }

    [Fact]
    public async Task TransitionPhaseAsync_ValidTransition_AppendsHistory_WithActorUserId_NotRequestPerformedBy()
    {
        var (facade, unitOfWork) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = created.Value!.Id,
            TargetStatus = EngagementStatus.Discovery,
            PerformedBy = "spoofed-identity@attacker.example",
            Reason = "Kickoff complete"
        };

        var result = await facade.TransitionPhaseAsync(request, Actor, CancellationToken.None);

        Assert.True(result.IsSuccess);
        var engagement = unitOfWork.FakeEngagements.Store[new EngagementId(created.Value.Id)];
        Assert.Equal(Actor.UserId, engagement.LifecycleHistory[^1].PerformedBy);
        Assert.DoesNotContain(
            engagement.LifecycleHistory, t => t.PerformedBy == "spoofed-identity@attacker.example");
    }

    [Fact]
    public async Task TransitionPhaseAsync_SkippingAPhase_ReturnsLifecycleConflict_WithAllowedTransitions()
    {
        var (facade, _) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = created.Value!.Id,
            TargetStatus = EngagementStatus.Architecture,
            PerformedBy = "pm@architect4hire.com"
        };

        var result = await facade.TransitionPhaseAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.LifecycleConflict, result.Failure!.Kind);
        Assert.Equal(EngagementStatus.Draft, result.Failure.FromStatus);
        Assert.Equal(EngagementStatus.Architecture, result.Failure.ToStatus);
        Assert.Contains(EngagementStatus.Discovery, result.Failure.AllowedTransitions!);
    }

    [Fact]
    public async Task TransitionPhaseAsync_WhenMissing_ReturnsNotFound()
    {
        var (facade, _) = CreateSut();
        var request = new TransitionEngagementPhaseRequest
        {
            EngagementId = Guid.NewGuid(),
            TargetStatus = EngagementStatus.Discovery,
            PerformedBy = "pm@architect4hire.com"
        };

        var result = await facade.TransitionPhaseAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.NotFound, result.Failure!.Kind);
    }

    [Fact]
    public async Task ArchiveAsync_WithValidRequest_ArchivesUsingActorUserId()
    {
        var (facade, unitOfWork) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);

        var request = new ArchiveEngagementRequest
        {
            EngagementId = created.Value!.Id,
            PerformedBy = "spoofed-identity@attacker.example",
            Reason = "Client cancelled."
        };

        var result = await facade.ArchiveAsync(request, Actor, CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal(EngagementStatus.Archived, result.Value!.Status);
        var engagement = unitOfWork.FakeEngagements.Store[new EngagementId(created.Value.Id)];
        Assert.Equal(Actor.UserId, engagement.LifecycleHistory[^1].PerformedBy);
    }

    [Fact]
    public async Task ArchiveAsync_WhenAlreadyArchived_ReturnsLifecycleConflict()
    {
        var (facade, unitOfWork) = CreateSut();
        var created = await facade.CreateAsync(ValidCreateRequest(), Actor, CancellationToken.None);
        var engagement = unitOfWork.FakeEngagements.Store[new EngagementId(created.Value!.Id)];
        engagement.Archive(Actor.UserId);

        var request = new ArchiveEngagementRequest { EngagementId = created.Value.Id, PerformedBy = "pm@architect4hire.com" };

        var result = await facade.ArchiveAsync(request, Actor, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(EngagementFailureKind.LifecycleConflict, result.Failure!.Kind);
    }
}
