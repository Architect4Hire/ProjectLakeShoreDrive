# ADR-0008 — Preserve Database Ownership by Bounded Domain

**Status:** Proposed

## Context

Lake Shore Drive needs clear domain ownership and must avoid cross-service persistence coupling.

## Decision

Each bounded domain owns its relational persistence and migrations. Other domains access its capabilities through contracts or rebuildable projections, never direct SQL.

## Consequences

- ownership is explicit;
- cross-domain reporting/search may require projections;
- distributed workflows use contracts/events rather than shared transactions;
- physical database topology may be optimized later without changing logical ownership.
