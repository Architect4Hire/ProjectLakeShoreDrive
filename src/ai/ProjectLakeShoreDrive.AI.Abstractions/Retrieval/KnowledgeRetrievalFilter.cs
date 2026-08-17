using ProjectLakeShoreDrive.Shared.Storage;

namespace ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

// Mandatory, non-optional retrieval scoping (TR-RAG-002, TR-RAG-003; SEC-003, SEC-004).
// No caller can invoke IKnowledgeRetriever without supplying this — there is no
// unscoped/unfiltered retrieval path.
//
// EngagementId is nullable to allow organization-wide retrieval, but only chunks whose
// classification appears in AllowedConfidentiality are eligible either way (TR-RAG-007):
// engagement-scoped/client-confidential content stays engagement-scoped unless explicitly
// promoted to reusable knowledge under governance.
public sealed record KnowledgeRetrievalFilter(
    Guid? EngagementId,
    IReadOnlyCollection<ArtifactConfidentiality> AllowedConfidentiality,
    string? ArtifactType,
    IReadOnlyCollection<string> TechnologyTags,
    IReadOnlyCollection<string> ArchitecturePatternTags);
