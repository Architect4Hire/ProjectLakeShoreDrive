using System.ComponentModel.DataAnnotations;
using ProjectLakeShoreDrive.Engagement.Core.Contracts;
using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Validation;

// Use-case validation for Engagement requests (BR-020..023). Runs the contracts' own
// DataAnnotations (Validator does not recurse into nested objects/collection elements, so
// those are validated explicitly here) plus checks DataAnnotations cannot express: cross-field
// timeline ordering, per-item stakeholder/collection bounds, and enum-range binding safety.
// The Facade calls this even though [ApiController] also validates DataAnnotations at the
// transport boundary, because Semantic Kernel plugins call the Facade directly and must not
// get a looser check (ADR-0011).
public static class EngagementRequestValidator
{
    private const int MaxCollectionItems = 50;
    private const int MaxCollectionItemLength = 500;

    public static IReadOnlyDictionary<string, string[]> ValidateCreate(CreateEngagementRequest request)
    {
        var errors = RunDataAnnotations(request);
        ValidateTimeline(request.Timeline, errors);
        ValidateStakeholders(request.Stakeholders, errors);
        ValidateBoundedCollection(request.BusinessObjectives, nameof(request.BusinessObjectives), errors);
        ValidateBoundedCollection(request.KnownTechnologyLandscape, nameof(request.KnownTechnologyLandscape), errors);
        ValidateBoundedCollection(request.Constraints, nameof(request.Constraints), errors);
        ValidateBoundedCollection(request.RequestedDeliverables, nameof(request.RequestedDeliverables), errors);
        ValidateEnumDefined(request.Type, nameof(request.Type), errors);
        ValidateEnumDefined(request.Confidentiality, nameof(request.Confidentiality), errors);
        return Freeze(errors);
    }

    public static IReadOnlyDictionary<string, string[]> ValidateUpdate(UpdateEngagementRequest request)
    {
        var errors = RunDataAnnotations(request);
        ValidateTimeline(request.Timeline, errors);
        ValidateStakeholders(request.Stakeholders, errors);
        ValidateBoundedCollection(request.BusinessObjectives, nameof(request.BusinessObjectives), errors);
        ValidateBoundedCollection(request.KnownTechnologyLandscape, nameof(request.KnownTechnologyLandscape), errors);
        ValidateBoundedCollection(request.Constraints, nameof(request.Constraints), errors);
        ValidateBoundedCollection(request.RequestedDeliverables, nameof(request.RequestedDeliverables), errors);
        ValidateEnumDefined(request.Type, nameof(request.Type), errors);
        ValidateEnumDefined(request.Confidentiality, nameof(request.Confidentiality), errors);
        return Freeze(errors);
    }

    public static IReadOnlyDictionary<string, string[]> ValidateTransition(TransitionEngagementPhaseRequest request)
    {
        var errors = RunDataAnnotations(request);
        ValidateEnumDefined(request.TargetStatus, nameof(request.TargetStatus), errors);
        return Freeze(errors);
    }

    public static IReadOnlyDictionary<string, string[]> ValidateArchive(ArchiveEngagementRequest request) =>
        Freeze(RunDataAnnotations(request));

    public static IReadOnlyDictionary<string, string[]> ValidateListQuery(EngagementListQuery query)
    {
        var errors = RunDataAnnotations(query);
        if (query.Status is { } status)
        {
            ValidateEnumDefined(status, nameof(query.Status), errors);
        }

        return Freeze(errors);
    }

    public static IReadOnlyDictionary<string, string[]> ValidateSearchQuery(SearchEngagementsQuery query)
    {
        var errors = RunDataAnnotations(query);
        if (query.Status is { } status)
        {
            ValidateEnumDefined(status, nameof(query.Status), errors);
        }

        return Freeze(errors);
    }

    private static void ValidateTimeline(EngagementTimelineContract? timeline, Dictionary<string, List<string>> errors)
    {
        if (timeline is { TargetEndDate: { } targetEndDate } && targetEndDate < timeline.StartDate)
        {
            Add(errors, nameof(EngagementTimelineContract.TargetEndDate), "Target end date cannot precede the start date.");
        }
    }

    private static void ValidateStakeholders(
        IReadOnlyList<EngagementStakeholderContract> stakeholders, Dictionary<string, List<string>> errors)
    {
        for (var i = 0; i < stakeholders.Count; i++)
        {
            var context = new ValidationContext(stakeholders[i]);
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(stakeholders[i], context, results, validateAllProperties: true);

            foreach (var result in results)
            {
                var members = result.MemberNames.Any() ? result.MemberNames : [string.Empty];
                foreach (var member in members)
                {
                    Add(errors, $"Stakeholders[{i}].{member}", result.ErrorMessage ?? "Invalid value.");
                }
            }
        }
    }

    private static void ValidateBoundedCollection(
        IReadOnlyList<string> items, string propertyName, Dictionary<string, List<string>> errors)
    {
        if (items.Count > MaxCollectionItems)
        {
            Add(errors, propertyName, $"No more than {MaxCollectionItems} items are allowed.");
        }

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i].Length > MaxCollectionItemLength)
            {
                Add(errors, $"{propertyName}[{i}]", $"Each item must be {MaxCollectionItemLength} characters or fewer.");
            }
        }
    }

    private static void ValidateEnumDefined<TEnum>(TEnum value, string propertyName, Dictionary<string, List<string>> errors)
        where TEnum : struct, Enum
    {
        if (!Enum.IsDefined(value))
        {
            Add(errors, propertyName, $"'{value}' is not a recognized {typeof(TEnum).Name} value.");
        }
    }

    private static Dictionary<string, List<string>> RunDataAnnotations(object contract)
    {
        var context = new ValidationContext(contract);
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(contract, context, results, validateAllProperties: true);

        var errors = new Dictionary<string, List<string>>();
        foreach (var result in results)
        {
            var members = result.MemberNames.Any() ? result.MemberNames : [string.Empty];
            foreach (var member in members)
            {
                Add(errors, member, result.ErrorMessage ?? "Invalid value.");
            }
        }

        return errors;
    }

    private static void Add(Dictionary<string, List<string>> errors, string key, string message)
    {
        if (!errors.TryGetValue(key, out var list))
        {
            list = [];
            errors[key] = list;
        }

        list.Add(message);
    }

    private static IReadOnlyDictionary<string, string[]> Freeze(Dictionary<string, List<string>> errors) =>
        errors.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToArray());
}
