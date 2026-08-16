---
name: trace-a-request
description: Trace one Project Lake Shore Drive operation across Angular, HTTP, SQL/Redis, outbox/Service Bus/inbox, Semantic Kernel, and generated artifacts without bypassing service ownership.
---


# Trace A Request

Read-only procedure.

1. Start with correlation ID, workflow/generation ID, message ID, engagement ID or request identifier.
2. Identify initial Angular/API request.
3. Follow server trace/span to owning service.
4. Record outgoing HTTP dependencies in order.
5. Record SQL/Redis dependencies.
6. If outbox created, locate outbox ID and publish attempt.
7. Follow Service Bus message ID/correlation/causation.
8. Locate consumer/inbox processing.
9. Follow Semantic Kernel/model/tool spans if AI was invoked.
10. Locate generated artifact/version/status.
11. Report timeline, owner of each step, latency/failure point, and missing telemetry.
12. Do not query another service's DB as an implementation workaround; use supported operational/telemetry surfaces.
