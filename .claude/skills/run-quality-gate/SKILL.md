---
name: run-quality-gate
description: Run the smallest complete quality gate for the affected Lake Shore Drive vertical slice, including architecture, Angular, HTTP/messaging, Redis, AI, tests, and observability concerns.
---


# Run Quality Gate

Determine affected surfaces and run only relevant checks, but do not skip an applicable category.

## Backend

- format/build;
- focused unit tests;
- API/integration tests;
- SQL behavior if persistence changed.

## Messaging/workflows

- outbox atomicity;
- relay retry;
- duplicate delivery;
- inbox/idempotency;
- invalid workflow transition;
- retry/resume;
- dead-letter/failure behavior.

## HTTP integration

- timeout;
- cancellation;
- failure mapping;
- safe retry/idempotency.

## Redis

- hit/miss;
- invalidation;
- expiration;
- Redis unavailable.

## AI

- prompt variables;
- structured output validation;
- malicious/untrusted-context case;
- tool argument validation;
- provenance;
- fake-adapter deterministic tests.

## Angular

- lint;
- build;
- focused tests;
- accessibility;
- loading/empty/error/progress;
- design-system reuse.

Finally run the applicable read-only review agents and summarize findings by severity.
