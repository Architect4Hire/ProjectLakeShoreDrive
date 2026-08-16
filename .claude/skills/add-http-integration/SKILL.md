---
name: add-http-integration
description: Add a typed synchronous service-to-service HTTP integration for immediate queries or bounded request/response work.
---


# Add HTTP Integration

## Decision gate

Use HTTP only if the caller needs the result now and the operation fits a request/response interaction.

If time, durable retries, fan-out, or caller independence matter more, use messaging instead.

## Procedure

1. Identify provider and consumer bounded domains.
2. Define the smallest stable provider API contract.
3. Add/extend provider endpoint if required.
4. Add a typed `HttpClient` abstraction in the consumer's infrastructure/integration layer.
5. Resolve endpoint via Aspire/configuration/service discovery.
6. Configure explicit timeout.
7. Propagate cancellation and tracing.
8. Add auth propagation/service credential strategy if required.
9. Define failure mapping.
10. Add retry only for safe operations.
11. If retrying a command, design idempotency.
12. Test timeout, dependency failure, contract mapping and cancellation.

## Review

Call out synchronous dependency depth. If this creates a multi-hop chain, challenge the design.
