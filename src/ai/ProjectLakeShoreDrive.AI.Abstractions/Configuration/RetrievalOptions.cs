namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// Configuration-driven, provider-neutral retrieval/search selection (TR-SEARCH-001). Bind
// from configuration section "Ai:Retrieval". IndexName/IndexVersion identify which
// index/schema generation a retrieval call targets, independent of which provider backs it,
// so a future provider migration can run a new index version alongside the old one.
// MaxResults/MinimumRelevanceScore bound retrieval regardless of provider; the confidentiality
// and engagement-scope filter itself is mandatory per call (KnowledgeRetrievalFilter), not
// configuration, so it can never be silently disabled.
public sealed class RetrievalOptions
{
    public const string SectionName = "Ai:Retrieval";

    public RetrievalProvider Provider { get; init; } = RetrievalProvider.SqlKeywordMetadataFilter;

    public required string IndexName { get; init; }

    public required string IndexVersion { get; init; }

    public int MaxResults { get; init; } = 20;

    public double? MinimumRelevanceScore { get; init; }
}
