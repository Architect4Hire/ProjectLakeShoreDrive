namespace ProjectLakeShoreDrive.Shared.Storage;

// Opaque location reference. Callers resolve artifacts through relational metadata
// (artifact ID + version), never by interpreting Location directly, so a storage-provider
// migration does not break citation resolution (ADR-0013).
public sealed record ArtifactHandle(string Provider, string Location, string? Version = null);
