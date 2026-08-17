# ADR-0012 — Long-Lived Workflow Hosting and Durability Boundaries

**Status:** Proposed

## Context

Document/package generation (BR-100..105) requires multi-stage, retryable, potentially human-reviewed processing that exceeds a normal request budget (TR-OAI-005..007, NFR-002..004). Without an explicit hosting and durability model, workflow state risks being scattered across chat history, Redis, or broker message state, or being owned by a domain that doesn't hold the artifacts the workflow produces.

## Decision

### Topology

Each bounded domain that produces long-lived work owns and hosts its own workflow/process-manager; there is no shared "Workflow" domain. For this decision's scope, **Document & Generation Context** owns package/document generation workflows (multi-document package assembly, section-level regeneration), because workflow state and the artifacts it produces (`Document`, `DocumentSection`, `Generation`) are the same aggregate (ADR-0009). The same producer-owns-workflow pattern applies to other domains' long-lived work (e.g., Knowledge Context ingestion) without further specification here.

A domain-owned worker/consumer process advances the workflow asynchronously by consuming from Service Bus. Whether that worker is a background service inside the domain's own deployable or a companion worker deployable, and the concrete host technology (Azure Functions, Aspire-hosted worker, or otherwise), is **not decided by this ADR**.

### State ownership

Workflow/operation state is durable rows in the owning domain's own database (Generation DB). No other domain reads or writes this state directly. Minimum durable state: `OperationId, EngagementId, OperationType, Status, CurrentStage, Percent/ProgressMessage, RequestedBy, RequestedUtc, StartedUtc, CompletedUtc, FailureCode, FailureSummary, CorrelationId, Version/ConcurrencyToken`.

Status model: `Queued → Running → WaitingForReview → Running → Completed`, with `Failed` and `CancelRequested → Cancelled` branches. Human review is a durable status, not a live-held worker. AI generation provenance (model/deployment, prompt/template version, source references) is stored per generation step, not only at the operation level.

### 202/status-resource behavior

```text
POST /engagements/{id}/packages          (or /documents/{id}/sections/{sectionId}/generate)
  → validate synchronously
  → persist workflow + outbox atomically (same local transaction)
  → 202 Accepted, Location: /operations/{operationId}

GET /operations/{operationId}
  → current Status/CurrentStage/Percent, failure info if any, links to completed artifacts
```

Angular never holds an open connection for the duration of generation; it polls or receives progress updates against the persisted operation resource. Streaming (TR-OAI-007), where used, supplements this but the persisted record remains authoritative.

### Outbox / inbox rules

Persisting workflow intent and the next outbox message commit in one local transaction on the producer; only the outbox relay publishes, and only after broker acknowledgement. Every workflow-advancing consumer is idempotent by stable message/business key. A transactional inbox is used where processing the message mutates durable state and duplicate delivery could cause an incorrect side effect (e.g., double-advancing a stage or duplicating a generated artifact).

### Retry / DLQ / recovery

Transient failures (provider throttling, timeouts) retry under a bounded policy; validation/business-rule failures do not retry and instead transition the workflow to `Failed` with a `FailureCode`/`FailureSummary`. A retried step must not duplicate or silently overwrite an approved section (TR-OAI-006). After bounded retries are exhausted, the message dead-letters; dead-lettering is an operational workflow to be monitored, not a forgotten queue. Provider failure degrades AI capability only — the engagement's approved/structured data is untouched (NFR-003), and draft workflow state is recoverable from expected browser/network interruption (NFR-004).

### Operational ownership

The domain that owns the workflow's data also owns its worker/consumer process, its outbox relay, its retry/DLQ monitoring, and its operation-status endpoint. No cross-domain component advances another domain's workflow state.

## Consequences

- Workflow state and the artifacts it produces stay in one bounded domain's database, avoiding cross-domain writes during workflow advancement.
- Callers get an immediate `202 Accepted` and a durable status resource instead of a held HTTP connection.
- Duplicate message delivery cannot silently corrupt generated artifacts, because consumers are idempotent and inbox is used where duplicates matter.
- AI provider failure cannot endanger approved engagement data.
- The worker's concrete hosting technology remains an open decision (`docs/design/ongoing-architecture-plan.md`, item 7) and is not authorized by this ADR.
- No messaging infrastructure is implemented by this ADR.

## Related requirements

BR-100, BR-101, BR-102, BR-103, BR-104, BR-105, TR-OAI-005, TR-OAI-006, TR-OAI-007, NFR-002, NFR-003, NFR-004.

## Related ADRs

Elaborates ADR-0007 (persist long-lived workflow state) with domain ownership, concrete durable-state fields, and DLQ/operational specifics. Builds on ADR-0009 (bounded-domain catalog, for workflow/data co-ownership) and applies ADR-0001 (HTTP/Service Bus interaction semantics) and ADR-0002 (transactional outbox and idempotent inbox) to the long-lived workflow seam.
