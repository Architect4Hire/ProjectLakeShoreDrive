namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// Engagement aggregate root (BR-020, BR-022, BR-023, TR-DATA-004).
public sealed class Engagement
{
    private readonly List<string> _businessObjectives = [];
    private readonly List<string> _knownTechnologyLandscape = [];
    private readonly List<Stakeholder> _stakeholders = [];
    private readonly List<string> _constraints = [];
    private readonly List<string> _requestedDeliverables = [];
    private readonly List<EngagementLifecycleTransition> _lifecycleHistory = [];

    public EngagementId Id { get; }
    public ClientReference Client { get; private set; }
    public string Name { get; private set; }
    public EngagementType Type { get; private set; }
    public string BusinessProblem { get; private set; }
    public string? CurrentStateSummary { get; private set; }
    public string? TargetStateSummary { get; private set; }
    public EngagementTimeline? Timeline { get; private set; }
    public EngagementConfidentiality Confidentiality { get; private set; }
    public EngagementStatus Status { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; }
    public DateTimeOffset? ArchivedAtUtc { get; private set; }

    // Optimistic-concurrency token for persistence (TR-DATA-001). Plain CLR type so the
    // domain type stays provider-agnostic; only the EF configuration knows it is a rowversion.
    public byte[]? RowVersion { get; private set; }

    // Reserved for EF Core materialization (constructor binding cannot populate the
    // encapsulated collections below; the ORM instead sets properties/fields via reflection
    // after using this constructor). Not for application use.
    private Engagement()
    {
        Client = null!;
        Name = null!;
        BusinessProblem = null!;
    }

    public IReadOnlyList<string> BusinessObjectives => _businessObjectives;
    public IReadOnlyList<string> KnownTechnologyLandscape => _knownTechnologyLandscape;
    public IReadOnlyList<Stakeholder> Stakeholders => _stakeholders;
    public IReadOnlyList<string> Constraints => _constraints;
    public IReadOnlyList<string> RequestedDeliverables => _requestedDeliverables;
    public IReadOnlyList<EngagementLifecycleTransition> LifecycleHistory => _lifecycleHistory;

    private Engagement(
        EngagementId id,
        ClientReference client,
        string name,
        EngagementType type,
        string businessProblem,
        EngagementConfidentiality confidentiality,
        string? currentStateSummary,
        string? targetStateSummary,
        EngagementTimeline? timeline,
        IEnumerable<string> businessObjectives,
        IEnumerable<string> knownTechnologyLandscape,
        IEnumerable<Stakeholder> stakeholders,
        IEnumerable<string> constraints,
        IEnumerable<string> requestedDeliverables,
        DateTimeOffset createdAtUtc)
    {
        Id = id;
        Client = client;
        Name = name;
        Type = type;
        BusinessProblem = businessProblem;
        Confidentiality = confidentiality;
        CurrentStateSummary = currentStateSummary;
        TargetStateSummary = targetStateSummary;
        Timeline = timeline;
        Status = EngagementStatus.Draft;
        CreatedAtUtc = createdAtUtc;

        _businessObjectives = [.. businessObjectives];
        _knownTechnologyLandscape = [.. knownTechnologyLandscape];
        _stakeholders = [.. stakeholders];
        _constraints = [.. constraints];
        _requestedDeliverables = [.. requestedDeliverables];
    }

    public static Engagement Create(
        ClientReference client,
        string name,
        EngagementType type,
        string businessProblem,
        EngagementConfidentiality confidentiality,
        string? currentStateSummary = null,
        string? targetStateSummary = null,
        EngagementTimeline? timeline = null,
        IEnumerable<string>? businessObjectives = null,
        IEnumerable<string>? knownTechnologyLandscape = null,
        IEnumerable<Stakeholder>? stakeholders = null,
        IEnumerable<string>? constraints = null,
        IEnumerable<string>? requestedDeliverables = null,
        DateTimeOffset? createdAtUtc = null)
    {
        ArgumentNullException.ThrowIfNull(client);

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Engagement name is required.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(businessProblem))
        {
            throw new ArgumentException("Business problem is required.", nameof(businessProblem));
        }

        return new Engagement(
            EngagementId.New(),
            client,
            name.Trim(),
            type,
            businessProblem.Trim(),
            confidentiality,
            string.IsNullOrWhiteSpace(currentStateSummary) ? null : currentStateSummary.Trim(),
            string.IsNullOrWhiteSpace(targetStateSummary) ? null : targetStateSummary.Trim(),
            timeline,
            businessObjectives ?? [],
            knownTechnologyLandscape ?? [],
            stakeholders ?? [],
            constraints ?? [],
            requestedDeliverables ?? [],
            createdAtUtc ?? DateTimeOffset.UtcNow);
    }

    // BR-020: an engagement's structured data may be edited after creation. Client identity
    // is not editable here (set at creation); an archived engagement is terminal (TR-DATA-004).
    public void UpdateDetails(
        string name,
        EngagementType type,
        string businessProblem,
        EngagementConfidentiality confidentiality,
        string? currentStateSummary = null,
        string? targetStateSummary = null,
        EngagementTimeline? timeline = null,
        IEnumerable<string>? businessObjectives = null,
        IEnumerable<string>? knownTechnologyLandscape = null,
        IEnumerable<Stakeholder>? stakeholders = null,
        IEnumerable<string>? constraints = null,
        IEnumerable<string>? requestedDeliverables = null)
    {
        if (Status == EngagementStatus.Archived)
        {
            throw new InvalidOperationException("An archived engagement cannot be updated.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Engagement name is required.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(businessProblem))
        {
            throw new ArgumentException("Business problem is required.", nameof(businessProblem));
        }

        Name = name.Trim();
        Type = type;
        BusinessProblem = businessProblem.Trim();
        Confidentiality = confidentiality;
        CurrentStateSummary = string.IsNullOrWhiteSpace(currentStateSummary) ? null : currentStateSummary.Trim();
        TargetStateSummary = string.IsNullOrWhiteSpace(targetStateSummary) ? null : targetStateSummary.Trim();
        Timeline = timeline;

        _businessObjectives.Clear();
        _businessObjectives.AddRange(businessObjectives ?? []);

        _knownTechnologyLandscape.Clear();
        _knownTechnologyLandscape.AddRange(knownTechnologyLandscape ?? []);

        _stakeholders.Clear();
        _stakeholders.AddRange(stakeholders ?? []);

        _constraints.Clear();
        _constraints.AddRange(constraints ?? []);

        _requestedDeliverables.Clear();
        _requestedDeliverables.AddRange(requestedDeliverables ?? []);
    }

    // BR-022: transitions must be auditable. Every accepted transition is recorded in
    // LifecycleHistory with who performed it, when, and an optional reason.
    public void TransitionTo(EngagementStatus targetStatus, string performedBy, string? reason = null, DateTimeOffset? occurredAtUtc = null)
    {
        if (!EngagementLifecycle.IsValidTransition(Status, targetStatus))
        {
            throw new InvalidEngagementLifecycleTransitionException(Status, targetStatus);
        }

        var occurredAt = occurredAtUtc ?? DateTimeOffset.UtcNow;
        var fromStatus = Status;

        _lifecycleHistory.Add(new EngagementLifecycleTransition(fromStatus, targetStatus, performedBy, reason, occurredAt));
        Status = targetStatus;

        if (targetStatus == EngagementStatus.Archived)
        {
            ArchivedAtUtc = occurredAt;
        }
    }

    // TR-DATA-004: engagements are archived rather than physically deleted through normal workflows.
    public void Archive(string performedBy, string? reason = null, DateTimeOffset? occurredAtUtc = null) =>
        TransitionTo(EngagementStatus.Archived, performedBy, reason, occurredAtUtc);
}
