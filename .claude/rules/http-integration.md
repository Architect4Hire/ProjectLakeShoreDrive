---
paths:
  - "src/**/*.cs"
---

# Synchronous HTTP integration rules

Use service-to-service HTTP when the caller needs an immediate result.

Appropriate:

- queries;
- immediate validation;
- bounded commands;
- direct capability invocation.

Required:

- typed `HttpClient`;
- Aspire/configuration/service discovery;
- explicit timeout;
- cancellation propagation;
- correlation/tracing propagation;
- authentication/authorization as required;
- stable error mapping;
- retry only when safe.

Retries:

- GET/read operations may be retried under a bounded policy when safe.
- Commands are not blindly retried.
- Use idempotency keys/business idempotency for retryable commands.
- Do not retry validation failures, authorization failures, or deterministic 4xx responses.
- Avoid retry amplification across several service layers.

Boundaries:

- no direct service database access;
- no assumption that caller DB transaction + remote HTTP call is atomic;
- no distributed transaction;
- avoid deep synchronous chains.
