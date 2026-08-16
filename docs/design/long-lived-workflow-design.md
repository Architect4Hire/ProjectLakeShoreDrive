# Project Lake Shore Drive — Long-Lived Workflow Design

## Purpose

Long-running AI, ingestion and export work must survive caller disconnects, provider throttling, worker restarts and bounded retries.

A long-lived workflow is modeled as explicit durable state, not as a hidden chain of HTTP requests.

## Candidate workflows

- multi-document consulting package generation;
- source ingestion and embedding;
- large document export;
- package regeneration after approved requirement changes;
- human review between AI generation stages;
- repository bootstrap generation.

## API shape

```text
POST /engagements/{id}/packages
→ validate request
→ persist operation/workflow + outbox
→ return 202 Accepted
   Location: /operations/{operationId}
```

The UI polls or receives progress updates from the operation resource.

## Workflow state

Minimum durable state:

```text
OperationId
EngagementId
OperationType
Status
CurrentStage
Percent/ProgressMessage
RequestedBy
RequestedUtc
StartedUtc
CompletedUtc
FailureCode
FailureSummary
CorrelationId
Version/ConcurrencyToken
```

Suggested status model:

```text
Queued → Running → WaitingForReview → Running → Completed
                   ↘ Failed
Queued/Running → CancelRequested → Cancelled
```

## Process-manager rules

- persist state before emitting the next durable message;
- use outbox for next-step publication;
- every step is idempotent;
- store business-level step keys to prevent duplicate artifacts;
- retries are bounded and classified by failure type;
- human approval is represented as durable state, never by keeping a worker alive;
- compensation is explicit where a step has an externally visible side effect;
- cancellation is cooperative and recorded.

## AI-specific rules

- model calls may be retried only through an operation-level idempotency strategy;
- a retry must not silently replace an approved section;
- intermediate model output is not authoritative;
- prompt/model/context provenance is stored with each generation;
- provider outage degrades generation but does not lock the engagement record.

## UI behavior

Angular shows:

- queued/running status;
- current stage;
- failures with support/correlation reference;
- review-required state;
- safe retry/cancel actions;
- completed artifact links;
- no indefinite blocking spinner without persisted status.
