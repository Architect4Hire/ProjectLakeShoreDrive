---
name: add-endpoint
description: Add or modify an HTTP endpoint through the existing service layers without breaking bounded-domain, transaction, cache, observability, or integration rules.
---


# Add Endpoint

1. Identify the owning bounded domain.
2. Read backend/database/http/redis rules as applicable.
3. Define public request/response/error contract.
4. Add thin controller/endpoint transport binding.
5. Add/modify Facade orchestration and validation.
6. Put domain decisions in Business.
7. Put transaction/repository composition in Data.
8. Keep persistence in Repository/DbContext.
9. If calling another domain synchronously, use `add-http-integration`.
10. If the operation creates a durable integration fact, use `add-integration-event`.
11. If work is long-running, use `add-long-lived-workflow` and return a status resource.
12. Add telemetry and focused tests.

Verify no layer skips inward and no controller performs business/data work.
