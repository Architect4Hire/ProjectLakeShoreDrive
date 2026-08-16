# ADR-0001 — Use HTTP and Service Bus According to Interaction Semantics

**Status:** Proposed

## Context

Lake Shore Drive contains immediate user queries/commands and long-running, retryable, cross-domain workflows. One integration style is not appropriate for both.

## Decision

Use synchronous HTTP for immediate request/response interactions and domain queries; use Azure Service Bus for cross-domain state propagation, fan-out, long-running processing and workflows that require temporal decoupling.

## Consequences

- ordinary interactions remain simple;
- durable workflows survive caller disconnect;
- teams must explicitly classify integrations;
- both HTTP and messaging operational practices are required;
- deep synchronous chains and messaging-everything are both rejected.

## Related requirements

TR-API-004, TR-API-005, NFR-002, NFR-003.
