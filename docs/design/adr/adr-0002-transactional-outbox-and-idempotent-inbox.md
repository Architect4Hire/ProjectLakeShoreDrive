# ADR-0002 — Use Transactional Outbox and Idempotent Consumers

**Status:** Proposed

## Context

A service may need to persist authoritative state and publish a cross-domain fact. Service Bus provides at-least-once delivery, so consumers can receive duplicates.

## Decision

When a service must atomically persist durable state and publish an integration event, write the event to a transactional outbox in the same local transaction. Consumers are idempotent and should use a transactional inbox when duplicate durable side effects matter.

## Consequences

- dual-write message loss is avoided;
- duplicate delivery is handled deliberately;
- relay/inbox storage and cleanup become operational responsibilities;
- ordinary synchronous HTTP requests do not require inbox/outbox unless they publish/consume durable messages.
