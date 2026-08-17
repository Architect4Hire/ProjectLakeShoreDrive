namespace ProjectLakeShoreDrive.Shared.Storage;

// Configuration-driven, provider-neutral artifact storage selection (TR-DATA-002). Bind
// from configuration section "ArtifactStorage". Only LocalFileSystem is populated today;
// a future cloud provider's credentials would be server-side configuration on this same
// options type, never hardcoded, once that provider is ADR-approved.
public sealed class ArtifactStorageOptions
{
    public const string SectionName = "ArtifactStorage";

    public ArtifactStorageProvider Provider { get; init; } = ArtifactStorageProvider.LocalFileSystem;

    public required string RootPath { get; init; }
}
