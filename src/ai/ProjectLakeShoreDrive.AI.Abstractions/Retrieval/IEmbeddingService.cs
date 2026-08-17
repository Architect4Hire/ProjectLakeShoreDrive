namespace ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

// Project-owned contract (TR-AI-010, ADR-0013). Domain/application code depends on this
// interface, never a provider SDK type directly. No implementation is registered by this
// seam yet.
public interface IEmbeddingService
{
    Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken);
}
