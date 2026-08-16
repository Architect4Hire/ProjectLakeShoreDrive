# ADR-0007 — Persist Long-Lived Workflow State

**Status:** Proposed

## Context

Document generation, ingestion and export can exceed HTTP request budgets and must survive browser disconnect, provider throttling and worker restarts.

## Decision

Represent long-running operations as persisted workflow/process-manager state, initiated through HTTP and executed asynchronously via durable messages.

## Consequences

- APIs return 202 plus operation resources;
- workflow steps must be idempotent;
- human review can pause execution safely;
- cancellation, retries and failures become explicit state transitions.
