namespace ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

// Project-owned contract (TR-AI-010, ADR-0013). Domain/application code depends on this
// interface, never a provider SDK type directly. No implementation is registered by this
// seam yet.
public interface IKnowledgeRetriever
{
    Task<IReadOnlyList<RetrievedChunk>> RetrieveAsync(
        string query,
        KnowledgeRetrievalFilter filter,
        CancellationToken cancellationToken);
}
