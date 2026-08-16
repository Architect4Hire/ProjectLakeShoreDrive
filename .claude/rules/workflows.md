---
paths:
  - "src/**/*.cs"
  - "src/**/*.json"
---

# Long-lived workflow rules

A long-lived workflow is durable application state, not merely message choreography.

Use for:

- multi-stage AI package generation;
- asynchronous document assembly;
- fan-out/fan-in;
- retryable processes;
- human approval;
- resumable processing.

Required concepts:

- workflow ID;
- owning domain;
- explicit state/status;
- created/updated timestamps;
- correlation ID;
- current step;
- terminal success/failure/cancel states;
- retry/attempt metadata where useful;
- idempotent transitions.

Client-triggered workflows:

- validate first;
- persist intent and outbox atomically;
- return `202 Accepted`;
- expose status URI;
- advance asynchronously.

Do not hold an HTTP connection for minutes while a workflow runs.

Do not store workflow truth only in Semantic Kernel chat history, Redis, or broker message state.

State transitions reject impossible transitions and duplicate events safely.

Human review is an explicit workflow state, not an implicit pause.
