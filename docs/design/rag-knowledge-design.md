# Project Lake Shore Drive — RAG and Knowledge Design

## Goal

Historical knowledge is useful only when it is authorized, traceable, current enough for the task, and attributable to its source.

RAG is therefore a governed knowledge capability, not an unrestricted document dump.

## Ingestion pipeline

```text
Source Registration
→ Extraction
→ Classification
→ Chunking
→ Metadata Enrichment
→ Embedding
→ Indexing
→ Validation
→ Available for Authorized Retrieval
```

## Source metadata

Every retrievable chunk should retain:

- SourceArtifactId;
- EngagementId where applicable;
- artifact type;
- section/location;
- version;
- created/approved dates;
- approved status;
- technology tags;
- architecture-pattern tags;
- confidentiality classification;
- reuse scope.

## Retrieval

Retrieval should combine:

- semantic/vector similarity;
- keyword relevance;
- metadata filtering;
- explicit source selection;
- lifecycle/status filtering.

Metadata/security filters apply before material is exposed to the model.

## Citation model

A citation resolves to a stable SourceArtifact plus source location.

The citation must not depend only on vector-index row identity because indexes are rebuildable.

## Knowledge scopes

Suggested scopes:

- engagement restricted;
- client confidential;
- internal reusable;
- approved reusable knowledge.

Organization-wide retrieval only includes content explicitly authorized for that scope.

## Knowledge lifecycle

```text
Draft → Reviewed → Approved → Deprecated → Archived
```

Deprecated guidance remains historically visible but is excluded from automatic recommendation by default.

## Prompt injection defense

Retrieved documents are untrusted data.

Instructions inside source documents cannot:

- override system/developer policy;
- expand tool permissions;
- change authorization;
- alter retrieval filters;
- promote knowledge;
- cause arbitrary external actions.

## Explicit source selection

An architect may intentionally choose prior engagements or source artifacts for a generation operation. The selected sources become part of generation provenance.

## Quality controls

Track:

- citation resolution success;
- retrieval relevance;
- source authorization;
- stale/deprecated source use;
- acceptance/rejection of AI outputs influenced by retrieved material.
