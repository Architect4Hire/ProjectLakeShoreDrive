using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Facades;

namespace ProjectLakeShoreDrive.Engagement.Api.Integration.Tests;

// Hand-written test double (this solution's convention is no mocking library) that lets a
// test force a specific EngagementResult without needing a real race condition or database
// state to produce it.
public sealed class StubEngagementFacade : IEngagementFacade
{
    public Func<CreateEngagementRequest, EngagementActor, Task<EngagementResult<EngagementDetail>>>? OnCreate { get; set; }
    public Func<UpdateEngagementRequest, EngagementActor, Task<EngagementResult<EngagementDetail>>>? OnUpdate { get; set; }
    public Func<Guid, Task<EngagementResult<EngagementDetail>>>? OnGet { get; set; }
    public Func<EngagementListQuery, Task<EngagementResult<EngagementListResult>>>? OnList { get; set; }
    public Func<SearchEngagementsQuery, Task<EngagementResult<EngagementListResult>>>? OnSearch { get; set; }
    public Func<TransitionEngagementPhaseRequest, EngagementActor, Task<EngagementResult<EngagementDetail>>>? OnTransitionPhase { get; set; }
    public Func<ArchiveEngagementRequest, EngagementActor, Task<EngagementResult<EngagementDetail>>>? OnArchive { get; set; }

    public Task<EngagementResult<EngagementDetail>> CreateAsync(
        CreateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken) =>
        (OnCreate ?? throw NotConfigured())(request, actor);

    public Task<EngagementResult<EngagementDetail>> UpdateAsync(
        UpdateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken) =>
        (OnUpdate ?? throw NotConfigured())(request, actor);

    public Task<EngagementResult<EngagementDetail>> GetAsync(Guid engagementId, CancellationToken cancellationToken) =>
        (OnGet ?? throw NotConfigured())(engagementId);

    public Task<EngagementResult<EngagementListResult>> ListAsync(
        EngagementListQuery query, CancellationToken cancellationToken) =>
        (OnList ?? throw NotConfigured())(query);

    public Task<EngagementResult<EngagementListResult>> SearchAsync(
        SearchEngagementsQuery query, CancellationToken cancellationToken) =>
        (OnSearch ?? throw NotConfigured())(query);

    public Task<EngagementResult<EngagementDetail>> TransitionPhaseAsync(
        TransitionEngagementPhaseRequest request, EngagementActor actor, CancellationToken cancellationToken) =>
        (OnTransitionPhase ?? throw NotConfigured())(request, actor);

    public Task<EngagementResult<EngagementDetail>> ArchiveAsync(
        ArchiveEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken) =>
        (OnArchive ?? throw NotConfigured())(request, actor);

    private static InvalidOperationException NotConfigured() =>
        new("This StubEngagementFacade member was not configured for this test.");
}
