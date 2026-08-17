namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// Only the SQL-backed keyword/metadata-filter provider is ADR-approved today (dev/test
// buildability baseline satisfying TR-SEARCH-001). The production semantic/vector search
// provider is an open decision (docs/design/ongoing-architecture-plan.md, item 6) and is
// not added here.
public enum RetrievalProvider
{
    SqlKeywordMetadataFilter
}
