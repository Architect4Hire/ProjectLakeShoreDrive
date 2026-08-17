namespace ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

public sealed record RetrievedChunk(
    Guid ChunkId,
    string Content,
    double? RelevanceScore,
    CitationReference Citation);
