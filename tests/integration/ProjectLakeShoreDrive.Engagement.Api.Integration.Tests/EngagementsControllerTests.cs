using System.Net;
using System.Net.Http.Json;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Api.Integration.Tests;

public sealed class EngagementsControllerTests(EngagementApiFactory factory) : IClassFixture<EngagementApiFactory>
{
    private static readonly EngagementActor Actor = new("pm-1", "Jane PM", EngagementRole.PrincipalArchitect);

    private static CreateEngagementRequest ValidCreateRequest(string? name = null) => new()
    {
        ClientId = Guid.NewGuid(),
        ClientName = "Contoso Retail",
        Name = name ?? $"Engagement {Guid.NewGuid():N}",
        Type = EngagementType.CloudMigration,
        BusinessProblem = "Legacy platform cannot scale.",
        Confidentiality = EngagementConfidentiality.ClientConfidential
    };

    private async Task<EngagementDetail> CreateAsync(HttpClient client, CreateEngagementRequest? request = null)
    {
        var response = await client.PostAsJsonAsync("/api/engagements", request ?? ValidCreateRequest());
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options))!;
    }

    [Fact]
    public async Task Create_WithValidRequest_Returns201WithLocation()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var request = ValidCreateRequest();

        var response = await client.PostAsJsonAsync("/api/engagements", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);

        var detail = await response.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options);
        Assert.Equal(request.Name, detail!.Name);
    }

    [Fact]
    public async Task Create_WithMissingRequiredField_Returns400WithFieldErrorsAndTraceId()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var request = ValidCreateRequest() with { Name = "" };

        var response = await client.PostAsJsonAsync("/api/engagements", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.True(problem!.ContainsKey("errors"));
        Assert.True(problem.ContainsKey("traceId"));
    }

    [Fact]
    public async Task Get_ExistingEngagement_Returns200()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var created = await CreateAsync(client);

        var response = await client.GetAsync($"/api/engagements/{created.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_MissingEngagement_Returns404()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);

        var response = await client.GetAsync($"/api/engagements/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task List_ExcludesArchived_ByDefault()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var clientId = Guid.NewGuid();
        var created = await CreateAsync(client, ValidCreateRequest() with { ClientId = clientId });
        await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/archive",
            new ArchiveEngagementRequest { EngagementId = created.Id, PerformedBy = "pm-1" });

        var response = await client.GetAsync($"/api/engagements?clientId={clientId}");
        var result = await response.Content.ReadFromJsonAsync<EngagementListResult>(TestJson.Options);

        Assert.Empty(result!.Items);
    }

    [Fact]
    public async Task List_IncludesArchived_WhenRequested()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var clientId = Guid.NewGuid();
        var created = await CreateAsync(client, ValidCreateRequest() with { ClientId = clientId });
        await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/archive",
            new ArchiveEngagementRequest { EngagementId = created.Id, PerformedBy = "pm-1" });

        var response = await client.GetAsync($"/api/engagements?clientId={clientId}&includeArchived=true");
        var result = await response.Content.ReadFromJsonAsync<EngagementListResult>(TestJson.Options);

        Assert.Single(result!.Items);
    }

    [Fact]
    public async Task List_WithPageSizeOver100_Returns400()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);

        var response = await client.GetAsync("/api/engagements?pageSize=500");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task TransitionPhase_ValidTransition_Returns200()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var created = await CreateAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/phase",
            new TransitionEngagementPhaseRequest
            {
                EngagementId = created.Id,
                TargetStatus = EngagementStatus.Discovery,
                PerformedBy = "pm-1",
                Reason = "Kickoff complete"
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var detail = await response.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options);
        Assert.Equal(EngagementStatus.Discovery, detail!.Status);
    }

    [Fact]
    public async Task TransitionPhase_SkippingAPhase_Returns422WithAllowedTransitions()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var created = await CreateAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/phase",
            new TransitionEngagementPhaseRequest
            {
                EngagementId = created.Id,
                TargetStatus = EngagementStatus.Architecture,
                PerformedBy = "pm-1"
            });

        Assert.Equal((HttpStatusCode)422, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.True(problem!.ContainsKey("allowedTransitions"));
    }

    [Fact]
    public async Task TransitionPhase_WithSpoofedPerformedBy_RecordsAuthenticatedActor_NotBodyValue()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var created = await CreateAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/phase",
            new TransitionEngagementPhaseRequest
            {
                EngagementId = created.Id,
                TargetStatus = EngagementStatus.Discovery,
                PerformedBy = "spoofed-identity@attacker.example"
            });

        var detail = await response.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options);

        Assert.All(detail!.LifecycleHistory, t => Assert.Equal("pm-1", t.PerformedBy));
    }

    [Fact]
    public async Task Update_WithMismatchedRouteAndBodyId_Returns400()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var created = await CreateAsync(client);

        var response = await client.PutAsJsonAsync(
            $"/api/engagements/{Guid.NewGuid()}",
            new UpdateEngagementRequest
            {
                EngagementId = created.Id,
                Name = "Renamed",
                Type = EngagementType.CloudMigration,
                BusinessProblem = "Updated problem.",
                Confidentiality = EngagementConfidentiality.ClientConfidential
            });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Archive_RemovesEngagement_FromDefaultList()
    {
        var client = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var clientId = Guid.NewGuid();
        var created = await CreateAsync(client, ValidCreateRequest() with { ClientId = clientId });

        var archiveResponse = await client.PostAsJsonAsync(
            $"/api/engagements/{created.Id}/archive",
            new ArchiveEngagementRequest { EngagementId = created.Id, PerformedBy = "pm-1" });

        Assert.Equal(HttpStatusCode.OK, archiveResponse.StatusCode);

        var listResponse = await client.GetAsync($"/api/engagements?clientId={clientId}");
        var result = await listResponse.Content.ReadFromJsonAsync<EngagementListResult>(TestJson.Options);
        Assert.Empty(result!.Items);
    }

    [Fact]
    public async Task TransitionPhase_WhenSaveConflicts_Returns409ViaStubFacade()
    {
        var engagementId = Guid.NewGuid();
        var stub = new StubEngagementFacade
        {
            OnTransitionPhase = (_, _) => Task.FromResult(EngagementResult<EngagementDetail>.Fail(
                new EngagementFailure(
                    EngagementFailureKind.ConcurrencyConflict,
                    "The engagement was modified by another request. Reload and try again.")))
        };
        var client = factory.CreateClientWithStubFacade(stub, "pm-1", EngagementRole.PrincipalArchitect);

        var response = await client.PostAsJsonAsync(
            $"/api/engagements/{engagementId}/phase",
            new TransitionEngagementPhaseRequest
            {
                EngagementId = engagementId,
                TargetStatus = EngagementStatus.Discovery,
                PerformedBy = "pm-1"
            });

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }
}
