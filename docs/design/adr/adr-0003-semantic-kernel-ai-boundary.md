# ADR-0003 — Use Semantic Kernel as the AI Orchestration Boundary

**Status:** Proposed

## Context

Lake Shore Drive requires prompt execution, structured output, function calling, retrieval, telemetry and provider abstraction without coupling domain code or Angular to OpenAI SDKs.

## Decision

Use Microsoft Semantic Kernel behind Lake Shore Drive AI abstractions as the server-side orchestration boundary.

## Consequences

- model/provider details stay outside domain logic;
- Angular never holds provider credentials;
- plugins/functions are governed capabilities;
- prompt/model configuration can evolve independently;
- the team must maintain kernel factories, plugin policy and AI evaluation tests.
