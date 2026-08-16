---
name: add-integration-event
description: Add a durable Azure Service Bus integration event with transactional outbox on the producer and idempotent/transactional inbox processing on stateful consumers.
---


# Add Integration Event

1. Confirm the interaction truly requires asynchronous propagation.
2. Define event name as a past-tense fact.
3. Define stable/versioned integration contract.
4. Add event ID, correlation, causation, occurred-at and producer metadata.
5. Producer Business decides that the fact exists.
6. Producer Data persists business changes + outbox atomically.
7. Outbox relay publishes to Service Bus.
8. Configure topic/queue/subscription through Aspire/configuration.
9. Consumer trigger performs transport binding only.
10. Consumer checks durable idempotency.
11. If durable state changes, use transactional inbox unless natural business idempotency is demonstrably sufficient.
12. Commit consumer effects and inbox completion atomically.
13. Let failed processing fail so broker retry/DLQ behavior remains correct.
14. Add duplicate-delivery, atomicity, relay retry and contract tests.
15. Document owning producer/consumer and eventual-consistency expectation.
