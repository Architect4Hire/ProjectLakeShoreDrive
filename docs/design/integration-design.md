# Project Lake Shore Drive — Integration Design

## Principle

Lake Shore Drive deliberately uses **both synchronous HTTP and asynchronous messaging**.

The architecture does not use messaging merely because code is separated into services.

## Decision matrix

| Need | Preferred integration |
|---|---|
| User needs answer before continuing | HTTP |
| Domain query | HTTP |
| Fast command completing in request budget | HTTP |
| Validation needed before next UI step | HTTP |
| Long-running generation/ingestion/export | Service Bus + persisted workflow |
| Cross-domain state propagation | Service Bus |
| Fan-out to independent consumers | Service Bus |
| Retry lifecycle independent of caller | Service Bus |
| Work survives browser disconnect | Service Bus |
| Durable workflow step | Service Bus |

## HTTP contract rules

- use typed clients;
- explicit timeout budgets;
- propagate cancellation;
- retry only operations that are safe to retry;
- use stable ProblemDetails-style errors;
- propagate trace context/correlation;
- avoid deep request chains;
- use idempotency keys where external retries can duplicate commands.

## Messaging contract rules

Integration messages include:

- MessageId / EventId;
- CorrelationId;
- CausationId where available;
- event type;
- schema version;
- producer;
- occurred-at UTC;
- business key where appropriate;
- trace context where supported.

Duplicate delivery is normal.

## Transactional outbox

A producer **must** use a transactional outbox when it must atomically:

1. change authoritative durable state; and
2. publish a fact needed by another domain/workflow.

The business mutation and OutboxMessage insert occur in one SQL transaction.

Dispatch happens after commit. A message is marked dispatched only after successful broker acceptance.

## Idempotent consumer and transactional inbox

Every consumer is idempotent.

Use a transactional inbox when:

- message handling changes durable state; and
- replay could create incorrect duplicate side effects.

Inbox receipt and domain side effects should commit in the same local transaction.

## Failure model

- HTTP failure is visible to the caller and must be surfaced cleanly.
- Asynchronous failure transitions the durable operation/workflow state.
- Poison messages go to dead-letter handling with operational visibility.
- Retrying AI/provider work must not create duplicate logical artifacts.
- Outbox/inbox processing is observable and supportable.

## Anti-patterns

Do not:

- publish Service Bus messages from controllers before the database transaction commits;
- use Redis as an integration bus;
- make synchronous HTTP calls from one SQL transaction into another domain;
- share EF entities across services;
- treat Eventual Consistency as an excuse for invisible stale-state behavior;
- create a Service Bus event for every internal method call.
