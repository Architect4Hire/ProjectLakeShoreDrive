namespace ProjectLakeShoreDrive.Shared.Storage;

// Only the local filesystem provider is ADR-approved today (dev/test buildability
// baseline). The production object-storage provider is an open decision
// (docs/design/ongoing-architecture-plan.md, item 5) and is not added here.
public enum ArtifactStorageProvider
{
    LocalFileSystem
}
