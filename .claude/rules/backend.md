---
paths:
  - "src/**/*.cs"
  - "tests/**/*.cs"
---

# Backend and bounded-domain rules

- .NET 10 is the backend baseline.
- Aspire composes local workloads/resources.
- Preserve the existing service host/Core/Functions structure when present.
- Transport entry points are thin.
- Preserve Controller/Trigger → Facade → Business → Data → Repository → DbContext direction.
- No layer skips inward.
- No business logic in controllers, triggers, AppHost, Shared, or infrastructure adapters.
- Business code does not directly access EF, Redis, HttpClient, Service Bus, or provider SDKs.
- Each bounded domain owns its database, cache namespace, public API, and events.
- One service never references another service's implementation project or persistence model.
- Cross-service behavior is either a stable HTTP contract or an integration event.
- Do not invent a new service boundary during a feature task.
- Public DTOs and integration events are stable contracts, not EF entities.
- Prefer explicit result/error contracts to transport-specific exceptions leaking inward.
