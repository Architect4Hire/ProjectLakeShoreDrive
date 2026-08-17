namespace ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

// Resolves back to a SourceArtifact through the owning domain's relational metadata
// (artifact ID + version), never through a storage location directly (TR-RAG-004, ADR-0013).
public sealed record CitationReference(Guid SourceArtifactId, string? Version);
