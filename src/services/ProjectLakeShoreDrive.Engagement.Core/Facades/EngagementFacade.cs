using Microsoft.Extensions.Logging;
using ProjectLakeShoreDrive.Engagement.Core.Business;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Data;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Mapping;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;
using ProjectLakeShoreDrive.Engagement.Core.Validation;

namespace ProjectLakeShoreDrive.Engagement.Core.Facades;

public sealed class EngagementFacade(
    IEngagementUnitOfWork unitOfWork,
    IEngagementLifecyclePolicy lifecyclePolicy,
    TimeProvider timeProvider,
    ILogger<EngagementFacade> logger) : IEngagementFacade
{
    public async Task<EngagementResult<EngagementDetail>> CreateAsync(
        CreateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            return Validation<EngagementDetail>(errors);
        }

        var engagement = EngagementFactory.Create(request, timeProvider.GetUtcNow());
        unitOfWork.Engagements.Add(engagement);

        var outcome = await unitOfWork.SaveChangesAsync(cancellationToken);
        if (outcome == EngagementSaveOutcome.ConcurrencyConflict)
        {
            return Concurrency<EngagementDetail>();
        }

        logger.LogInformation(
            "Engagement {EngagementId} created by {ActorUserId}.", engagement.Id, actor.UserId);

        return EngagementResult<EngagementDetail>.Ok(EngagementContractMapper.ToDetail(engagement));
    }

    public async Task<EngagementResult<EngagementDetail>> UpdateAsync(
        UpdateEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            return Validation<EngagementDetail>(errors);
        }

        var engagement = await unitOfWork.Engagements.GetAsync(new EngagementId(request.EngagementId), cancellationToken);
        if (engagement is null)
        {
            return NotFound<EngagementDetail>(request.EngagementId);
        }

        try
        {
            EngagementDetailsMutation.Apply(engagement, request);
        }
        catch (InvalidOperationException ex)
        {
            return EngagementResult<EngagementDetail>.Fail(
                new EngagementFailure(EngagementFailureKind.LifecycleConflict, ex.Message));
        }

        var outcome = await unitOfWork.SaveChangesAsync(cancellationToken);
        if (outcome == EngagementSaveOutcome.ConcurrencyConflict)
        {
            return Concurrency<EngagementDetail>();
        }

        logger.LogInformation(
            "Engagement {EngagementId} updated by {ActorUserId}.", engagement.Id, actor.UserId);

        return EngagementResult<EngagementDetail>.Ok(EngagementContractMapper.ToDetail(engagement));
    }

    public async Task<EngagementResult<EngagementDetail>> GetAsync(Guid engagementId, CancellationToken cancellationToken)
    {
        var engagement = await unitOfWork.Engagements.GetForReadAsync(new EngagementId(engagementId), cancellationToken);
        return engagement is null
            ? NotFound<EngagementDetail>(engagementId)
            : EngagementResult<EngagementDetail>.Ok(EngagementContractMapper.ToDetail(engagement));
    }

    public async Task<EngagementResult<EngagementListResult>> ListAsync(
        EngagementListQuery query, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateListQuery(query);
        if (errors.Count > 0)
        {
            return Validation<EngagementListResult>(errors);
        }

        var criteria = new EngagementListCriteria(query.Status, query.ClientId, query.IncludeArchived, query.Page, query.PageSize);
        var page = await unitOfWork.Engagements.ListAsync(criteria, cancellationToken);
        return EngagementResult<EngagementListResult>.Ok(EngagementContractMapper.ToListResult(page));
    }

    public async Task<EngagementResult<EngagementListResult>> SearchAsync(
        SearchEngagementsQuery query, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateSearchQuery(query);
        if (errors.Count > 0)
        {
            return Validation<EngagementListResult>(errors);
        }

        var criteria = new EngagementSearchCriteria(
            query.SearchText, query.Status, query.ClientId, query.IncludeArchived, query.Page, query.PageSize);
        var page = await unitOfWork.Engagements.SearchAsync(criteria, cancellationToken);
        return EngagementResult<EngagementListResult>.Ok(EngagementContractMapper.ToListResult(page));
    }

    public async Task<EngagementResult<EngagementDetail>> TransitionPhaseAsync(
        TransitionEngagementPhaseRequest request, EngagementActor actor, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateTransition(request);
        if (errors.Count > 0)
        {
            return Validation<EngagementDetail>(errors);
        }

        var engagement = await unitOfWork.Engagements.GetAsync(new EngagementId(request.EngagementId), cancellationToken);
        if (engagement is null)
        {
            return NotFound<EngagementDetail>(request.EngagementId);
        }

        var evaluation = lifecyclePolicy.Evaluate(engagement.Status, request.TargetStatus);
        if (!evaluation.IsAllowed)
        {
            return EngagementResult<EngagementDetail>.Fail(new EngagementFailure(
                EngagementFailureKind.LifecycleConflict,
                evaluation.BlockedReason ?? "The requested phase transition is not allowed.",
                FromStatus: engagement.Status,
                ToStatus: request.TargetStatus,
                AllowedTransitions: lifecyclePolicy.AllowedTransitionsFrom(engagement.Status)));
        }

        try
        {
            // SEC-002: the authoritative actor is the authenticated caller, never the
            // client-supplied request.PerformedBy value.
            engagement.TransitionTo(request.TargetStatus, actor.UserId, request.Reason, timeProvider.GetUtcNow());
        }
        catch (InvalidEngagementLifecycleTransitionException ex)
        {
            return EngagementResult<EngagementDetail>.Fail(new EngagementFailure(
                EngagementFailureKind.LifecycleConflict,
                ex.Message,
                FromStatus: ex.FromStatus,
                ToStatus: ex.ToStatus,
                AllowedTransitions: lifecyclePolicy.AllowedTransitionsFrom(ex.FromStatus)));
        }

        var outcome = await unitOfWork.SaveChangesAsync(cancellationToken);
        if (outcome == EngagementSaveOutcome.ConcurrencyConflict)
        {
            return Concurrency<EngagementDetail>();
        }

        logger.LogInformation(
            "Engagement {EngagementId} transitioned to {TargetStatus} by {ActorUserId}.",
            engagement.Id, request.TargetStatus, actor.UserId);

        return EngagementResult<EngagementDetail>.Ok(EngagementContractMapper.ToDetail(engagement));
    }

    public async Task<EngagementResult<EngagementDetail>> ArchiveAsync(
        ArchiveEngagementRequest request, EngagementActor actor, CancellationToken cancellationToken)
    {
        var errors = EngagementRequestValidator.ValidateArchive(request);
        if (errors.Count > 0)
        {
            return Validation<EngagementDetail>(errors);
        }

        var engagement = await unitOfWork.Engagements.GetAsync(new EngagementId(request.EngagementId), cancellationToken);
        if (engagement is null)
        {
            return NotFound<EngagementDetail>(request.EngagementId);
        }

        try
        {
            // SEC-002: same actor-binding rule as TransitionPhaseAsync.
            engagement.Archive(actor.UserId, request.Reason, timeProvider.GetUtcNow());
        }
        catch (InvalidEngagementLifecycleTransitionException ex)
        {
            return EngagementResult<EngagementDetail>.Fail(new EngagementFailure(
                EngagementFailureKind.LifecycleConflict,
                ex.Message,
                FromStatus: ex.FromStatus,
                ToStatus: ex.ToStatus));
        }

        var outcome = await unitOfWork.SaveChangesAsync(cancellationToken);
        if (outcome == EngagementSaveOutcome.ConcurrencyConflict)
        {
            return Concurrency<EngagementDetail>();
        }

        logger.LogInformation("Engagement {EngagementId} archived by {ActorUserId}.", engagement.Id, actor.UserId);

        return EngagementResult<EngagementDetail>.Ok(EngagementContractMapper.ToDetail(engagement));
    }

    private static EngagementResult<T> Validation<T>(IReadOnlyDictionary<string, string[]> errors) =>
        EngagementResult<T>.Fail(new EngagementFailure(EngagementFailureKind.Validation, "Validation failed.", errors));

    private static EngagementResult<T> NotFound<T>(Guid engagementId) =>
        EngagementResult<T>.Fail(new EngagementFailure(
            EngagementFailureKind.NotFound, $"Engagement '{engagementId}' was not found."));

    private static EngagementResult<T> Concurrency<T>() =>
        EngagementResult<T>.Fail(new EngagementFailure(
            EngagementFailureKind.ConcurrencyConflict,
            "The engagement was modified by another request. Reload and try again."));
}
