# Project Lake Shore Drive — Observability Design

## Objective

One user operation should be traceable across:

```text
Angular
→ API edge
→ domain HTTP calls
→ Redis
→ SQL
→ outbox
→ relay
→ Service Bus
→ inbox/consumer
→ Semantic Kernel
→ retrieval
→ OpenAI/Azure OpenAI
→ artifact persistence
```

## Standard

Use OpenTelemetry-compatible tracing, metrics and structured logging with Azure Monitor / Application Insights as the primary operational plane.

## Correlation

Carry or link:

- TraceId / SpanId;
- CorrelationId;
- CausationId;
- Message/EventId for async work;
- OperationId / GenerationId;
- EngagementId where safe;
- service/version/environment.

Do not use sensitive client data as correlation metadata.

## Custom spans

Create business-meaningful spans for:

- engagement operation;
- requirement approval;
- package generation;
- document-section generation;
- retrieval;
- model call;
- plugin invocation;
- export;
- outbox dispatch;
- workflow transition.

Avoid span-per-method instrumentation.

## AI telemetry

Capture where available:

- operation/generation ID;
- prompt template/version;
- model/deployment profile;
- token counts;
- latency;
- retries;
- plugin calls;
- retrieval count;
- citation count;
- structured validation result;
- safety/refusal result;
- human review outcome.

## Workflow metrics

- queue age;
- operation duration;
- stage duration;
- retries;
- dead-letter count;
- outbox backlog age/count;
- inbox duplicate count;
- failed/cancelled operations;
- time waiting for human review.

## Application metrics

- request latency/failure;
- cache hit ratio;
- SQL latency/failures;
- retrieval latency;
- export duration;
- generation acceptance/rejection;
- section regeneration rate.

## Supportability

User-facing failures should include a safe support/correlation reference that allows an operator to locate the trace without exposing stack traces or infrastructure details.
