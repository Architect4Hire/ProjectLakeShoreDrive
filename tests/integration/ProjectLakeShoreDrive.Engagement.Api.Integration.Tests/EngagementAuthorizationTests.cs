using System.Net;
using System.Net.Http.Json;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Api.Integration.Tests;

public sealed class EngagementAuthorizationTests(EngagementApiFactory factory) : IClassFixture<EngagementApiFactory>
{
    private static CreateEngagementRequest ValidCreateRequest() => new()
    {
        ClientId = Guid.NewGuid(),
        ClientName = "Contoso Retail",
        Name = $"Engagement {Guid.NewGuid():N}",
        Type = EngagementType.CloudMigration,
        BusinessProblem = "Legacy platform cannot scale.",
        Confidentiality = EngagementConfidentiality.ClientConfidential
    };

    public static IEnumerable<object[]> AnonymousRequests()
    {
        var id = Guid.NewGuid();
        yield return [HttpMethod.Get, "/api/engagements"];
        yield return [HttpMethod.Get, "/api/engagements/search?searchText=x"];
        yield return [HttpMethod.Get, $"/api/engagements/{id}"];
        yield return [HttpMethod.Post, "/api/engagements"];
        yield return [HttpMethod.Put, $"/api/engagements/{id}"];
        yield return [HttpMethod.Post, $"/api/engagements/{id}/phase"];
        yield return [HttpMethod.Post, $"/api/engagements/{id}/archive"];
    }

    [Theory]
    [MemberData(nameof(AnonymousRequests))]
    public async Task AnonymousRequest_Returns401(HttpMethod method, string path)
    {
        var client = factory.CreateAnonymousClient();
        var response = await client.SendAsync(new HttpRequestMessage(method, path));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Create_AsReviewer_Returns403()
    {
        var client = factory.CreateClientAs("reviewer-1", EngagementRole.Reviewer);

        var response = await client.PostAsJsonAsync("/api/engagements", ValidCreateRequest());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Get_AsNonMemberContributor_Returns403()
    {
        var owner = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var createResponse = await owner.PostAsJsonAsync("/api/engagements", ValidCreateRequest());
        var created = (await createResponse.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options))!;

        var outsider = factory.CreateClientAs("outsider@architect4hire.com", EngagementRole.ConsultingContributor);
        var response = await outsider.GetAsync($"/api/engagements/{created.Id}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Get_AsMemberContributor_Returns200()
    {
        var owner = factory.CreateClientAs("pm-1", EngagementRole.PrincipalArchitect);
        var request = ValidCreateRequest() with
        {
            Stakeholders = [new EngagementStakeholderContract
            {
                Name = "Sam Contributor",
                Role = "Contributor",
                Email = "member@architect4hire.com"
            }]
        };
        var createResponse = await owner.PostAsJsonAsync("/api/engagements", request);
        var created = (await createResponse.Content.ReadFromJsonAsync<EngagementDetail>(TestJson.Options))!;

        var member = factory.CreateClientAs("member@architect4hire.com", EngagementRole.ConsultingContributor);
        var response = await member.GetAsync($"/api/engagements/{created.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_WithUnrecognizedRoleHeader_Returns401()
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Debug-User", "pm-1");
        client.DefaultRequestHeaders.Add("X-Debug-Role", "NotARealRole");

        var response = await client.GetAsync($"/api/engagements/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
