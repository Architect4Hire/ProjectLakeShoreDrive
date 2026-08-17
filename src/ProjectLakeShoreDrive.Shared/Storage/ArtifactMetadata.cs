namespace ProjectLakeShoreDrive.Shared.Storage;

// Passed to IArtifactStore at write time; the owning domain's relational row remains the
// authoritative copy of this metadata (TR-DATA-002) — the store never holds the only copy.
public sealed record ArtifactMetadata(
    Guid ArtifactId,
    string OwningDomain,
    Guid? EngagementId,
    string ContentType,
    long SizeBytes,
    string Checksum,
    ArtifactConfidentiality Confidentiality,
    DateTimeOffset CreatedUtc);
