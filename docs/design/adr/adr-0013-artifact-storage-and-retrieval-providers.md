# ADR-0013 — Artifact Storage and Retrieval Provider Abstractions

**Status:** Proposed

## Context

Generated and ingested binary artifacts (TR-DATA-002) and RAG retrieval (BR-120, TR-RAG-001..007, TR-SEARCH-001) both need a concrete implementation to keep the repository buildable/testable now, without prematurely committing to a cloud storage or vector-search product where the canonical requirements only demand an abstraction.

## Decision

### Artifact storage

**Interface (project-owned):**

```
IArtifactStore
  PutAsync(ArtifactMetadata metadata, Stream content, CancellationToken) → ArtifactHandle
  GetAsync(ArtifactHandle handle, CancellationToken) → Stream
  DeleteAsync(ArtifactHandle handle, CancellationToken) → void
```

Only bytes and an opaque location reference live behind this interface. All queryable metadata — artifact ID, owning domain/engagement, content type, size, checksum, **confidentiality classification**, created-UTC — is persisted in the owning domain's relational rows (TR-DATA-002), never only in the store.

**Versioning:** approved documents/artifacts are immutable per version (TR-DATA-003); a new version is a new `ArtifactHandle` with its own metadata row, never an in-place overwrite of a prior version's bytes.

**Citation resolution:** artifacts referenced by a `Citation` resolve through the owning domain's relational metadata (artifact ID + version), not through the storage location directly, so citation resolution survives a future migration to a different storage provider.

**Confidentiality filtering:** any read path that could expose artifact content (export, retrieval, citation preview) must authorize against the artifact's confidentiality classification and engagement scope before calling `IArtifactStore.GetAsync` — the store itself performs no authorization.

**Initial implementation:** a local filesystem-backed implementation (configured root path), scoped to dev/test buildability. The production object-storage provider is **not decided by this ADR** and remains open decision #5 in `docs/design/ongoing-architecture-plan.md`.

### Hybrid/vector retrieval

**Interfaces (reusing the names already specified in TR-AI-010):**

```
IEmbeddingService
  EmbedAsync(string text, CancellationToken) → float[]

IKnowledgeRetriever
  RetrieveAsync(string query, KnowledgeRetrievalFilter filter, CancellationToken) → IReadOnlyList<RetrievedChunk>
```

`KnowledgeRetrievalFilter` is a **mandatory, non-optional** parameter carrying engagement scope, confidentiality classification, artifact type, and technology/pattern tags (TR-RAG-002, TR-RAG-003) — no caller can invoke retrieval without authorization scoping (SEC-003, SEC-004). Each `RetrievedChunk` carries a citation reference resolving back to its `SourceArtifact` (TR-RAG-004).

**Migration/replacement boundary:** any future retrieval backend (semantic/vector search product) implements the same `IKnowledgeRetriever`/`IEmbeddingService` contracts; callers do not change when the backend changes.

**Initial implementation:** a SQL-backed keyword/metadata-filter implementation over the already-relational `SourceArtifact`/chunk metadata, satisfying TR-SEARCH-001 as a buildable/testable baseline. The production semantic/vector search provider is **not decided by this ADR** and remains open decision #6 in `docs/design/ongoing-architecture-plan.md`.

## Consequences

- Domain/application code depends only on `IArtifactStore`, `IEmbeddingService`, and `IKnowledgeRetriever` — never a provider SDK type directly.
- Artifact versions are immutable; citations resolve through relational metadata, not storage location, so a storage-provider migration does not break citation resolution.
- Retrieval cannot be invoked without a confidentiality/engagement filter, preventing accidental cross-engagement leakage.
- The repository remains buildable/testable today using filesystem and SQL-backed implementations, with no cloud storage or vector-search product hard-coded.
- Swapping either implementation later requires no change to calling code, only a new implementation of the existing interface.

## Related requirements

PR-007, TR-DATA-001, TR-DATA-002, TR-DATA-003, TR-DATA-004, BR-120, TR-RAG-001, TR-RAG-002, TR-RAG-003, TR-RAG-004, TR-RAG-005, TR-RAG-006, TR-RAG-007, TR-SEARCH-001.

## Related ADRs

Elaborates ADR-0004 (governed RAG with resolvable citations) with concrete interfaces and an initial buildable implementation. Builds on ADR-0009 (bounded-domain catalog, for metadata ownership) and TR-AI-010's provider-abstraction requirement (ADR-0003, Semantic Kernel AI boundary) for the retrieval interfaces.
