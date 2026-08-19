using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectLakeShoreDrive.Engagement.Authorization;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Facades;
using ProjectLakeShoreDrive.Engagement.Security;

namespace ProjectLakeShoreDrive.Engagement.Controllers;

// Thin transport layer only: resolves the actor, delegates to IEngagementFacade, maps the
// typed result to an HTTP response. No DbContext/repository is injected here (backend.md).
[ApiController]
[Route("api/engagements")]
[Produces("application/json")]
[Authorize]
public sealed class EngagementsController(IEngagementFacade facade, IEngagementActorAccessor actors) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = EngagementPolicies.ReadEngagements)]
    public async Task<ActionResult<EngagementListResult>> List(
        [FromQuery] EngagementListQuery query, CancellationToken cancellationToken)
    {
        var result = await facade.ListAsync(query, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    [HttpGet("search")]
    [Authorize(Policy = EngagementPolicies.ReadEngagements)]
    public async Task<ActionResult<EngagementListResult>> Search(
        [FromQuery] SearchEngagementsQuery query, CancellationToken cancellationToken)
    {
        var result = await facade.SearchAsync(query, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = EngagementPolicies.ViewEngagement)]
    public async Task<ActionResult<EngagementDetail>> Get(Guid id, CancellationToken cancellationToken)
    {
        var result = await facade.GetAsync(id, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    [HttpPost]
    [Authorize(Policy = EngagementPolicies.CreateEngagement)]
    public async Task<ActionResult<EngagementDetail>> Create(
        [FromBody] CreateEngagementRequest request, CancellationToken cancellationToken)
    {
        var result = await facade.CreateAsync(request, actors.GetCurrentActor(), cancellationToken);
        if (!result.IsSuccess)
        {
            return MapFailure(result.Failure!);
        }

        return CreatedAtAction(nameof(Get), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = EngagementPolicies.EditEngagement)]
    public async Task<ActionResult<EngagementDetail>> Update(
        Guid id, [FromBody] UpdateEngagementRequest request, CancellationToken cancellationToken)
    {
        if (id != request.EngagementId)
        {
            return RouteBodyMismatch(nameof(request.EngagementId));
        }

        var result = await facade.UpdateAsync(request, actors.GetCurrentActor(), cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    [HttpPost("{id:guid}/phase")]
    [Authorize(Policy = EngagementPolicies.TransitionPhase)]
    public async Task<ActionResult<EngagementDetail>> TransitionPhase(
        Guid id, [FromBody] TransitionEngagementPhaseRequest request, CancellationToken cancellationToken)
    {
        if (id != request.EngagementId)
        {
            return RouteBodyMismatch(nameof(request.EngagementId));
        }

        var result = await facade.TransitionPhaseAsync(request, actors.GetCurrentActor(), cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    [HttpPost("{id:guid}/archive")]
    [Authorize(Policy = EngagementPolicies.ArchiveEngagement)]
    public async Task<ActionResult<EngagementDetail>> Archive(
        Guid id, [FromBody] ArchiveEngagementRequest request, CancellationToken cancellationToken)
    {
        if (id != request.EngagementId)
        {
            return RouteBodyMismatch(nameof(request.EngagementId));
        }

        var result = await facade.ArchiveAsync(request, actors.GetCurrentActor(), cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : MapFailure(result.Failure!);
    }

    private ActionResult RouteBodyMismatch(string bodyIdPropertyName)
    {
        ModelState.AddModelError(bodyIdPropertyName, "Route id and body id must match.");
        return ValidationProblem(ModelState);
    }

    private ActionResult MapFailure(EngagementFailure failure) => failure.Kind switch
    {
        EngagementFailureKind.Validation => ValidationProblem(new ValidationProblemDetails(
            (failure.Errors ?? new Dictionary<string, string[]>()).ToDictionary(kvp => kvp.Key, kvp => kvp.Value))),

        EngagementFailureKind.NotFound => Problem(
            detail: failure.Message, statusCode: StatusCodes.Status404NotFound, title: "Engagement not found"),

        EngagementFailureKind.Forbidden => Problem(
            detail: failure.Message, statusCode: StatusCodes.Status403Forbidden, title: "Engagement access denied"),

        EngagementFailureKind.LifecycleConflict => Problem(
            detail: failure.Message,
            statusCode: StatusCodes.Status422UnprocessableEntity,
            title: "Engagement lifecycle conflict",
            type: "urn:lsd:engagement:lifecycle-conflict",
            extensions: new Dictionary<string, object?>
            {
                ["fromStatus"] = failure.FromStatus?.ToString(),
                ["toStatus"] = failure.ToStatus?.ToString(),
                ["allowedTransitions"] = failure.AllowedTransitions?.Select(s => s.ToString()).ToList()
            }),

        EngagementFailureKind.ConcurrencyConflict => Problem(
            detail: failure.Message,
            statusCode: StatusCodes.Status409Conflict,
            title: "Engagement concurrency conflict",
            type: "urn:lsd:engagement:concurrency-conflict"),

        _ => Problem(detail: failure.Message, statusCode: StatusCodes.Status500InternalServerError)
    };
}
