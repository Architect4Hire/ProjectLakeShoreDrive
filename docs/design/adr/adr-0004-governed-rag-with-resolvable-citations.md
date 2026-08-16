# ADR-0004 — Use Governed RAG with Resolvable Citations

**Status:** Proposed

## Context

Historical consulting artifacts may contain valuable architecture knowledge and client-confidential data. Retrieval without scope and provenance would create leakage and trust problems.

## Decision

Use metadata-filtered retrieval over governed approved knowledge, preserving stable citations to source artifacts and source locations.

## Consequences

- retrieval authorization is enforced before model context assembly;
- citations remain stable across index rebuilds;
- content needs lifecycle/classification metadata;
- deprecated or unauthorized material is excluded from automatic recommendation.
