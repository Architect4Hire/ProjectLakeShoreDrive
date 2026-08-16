# ADR-0005 — Generate and Version Documents by Section

**Status:** Proposed

## Context

Consulting packages contain independently reviewed sections. Whole-document regeneration can overwrite approved human edits and makes provenance difficult.

## Decision

Represent documents as ordered structured sections and perform AI generation, versioning, provenance, citations, approval and locking at section level.

## Consequences

- regeneration is bounded;
- human-approved sections remain protected;
- version comparison becomes practical;
- document assembly/export must compose section records.
