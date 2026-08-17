namespace ProjectLakeShoreDrive.Shared.Storage;

// Project-owned contract (ADR-0013). Domain/application code depends on this interface,
// never a provider SDK type directly. No implementation is registered by this seam yet.
public interface IArtifactStore
{
    Task<ArtifactHandle> PutAsync(ArtifactMetadata metadata, Stream content, CancellationToken cancellationToken);

    Task<Stream> GetAsync(ArtifactHandle handle, CancellationToken cancellationToken);

    Task DeleteAsync(ArtifactHandle handle, CancellationToken cancellationToken);
}
