# Project Lake Shore Drive — Ongoing Architecture Plan

## Purpose

Lake Shore Drive contains several intentionally unresolved choices. They should be resolved through small, explicit ADRs as implementation evidence becomes available.

## Decision backlog

### Near-term

1. Final MVP bounded-service deployment catalog.
2. API edge/gateway choice and public route strategy.
3. Browser authentication/session model.
4. Azure SQL deployment topology.
5. Artifact/blob storage provider.
6. Hybrid/vector search provider.
7. Durable workflow/process-manager implementation approach.
8. Service Bus topology and naming/versioning.
9. Model profile strategy and provider data-retention policy.
10. Infrastructure-as-code/deployment ownership.

### AI quality decisions

11. Structured output validation library/pattern.
12. Prompt evaluation harness and promotion gates.
13. Citation quality thresholds.
14. Model fallback policy.
15. Cost budgets and model routing.

### Web/design system

16. Final Tailwind/design-token implementation.
17. component documentation/visual regression tooling.
18. editor implementation for structured documents.
19. progress transport: polling vs SSE/SignalR for durable operations.

## ADR discipline

Create an ADR when a decision:

- materially changes system structure;
- affects a key quality attribute;
- creates a long-lived contract;
- is difficult/costly to reverse;
- resolves a contested design option.

Accepted ADRs are append-only history. Supersede rather than rewrite.

## Architecture fitness checks

Over time, automate checks for:

- forbidden cross-domain project references;
- direct foreign database access;
- OpenAI SDK leakage into domain projects;
- Angular feature imports that bypass design-system boundaries;
- outbox requirement when state + event are committed;
- message consumer idempotency/inbox;
- missing requirement/ADR references in generated prompts.
