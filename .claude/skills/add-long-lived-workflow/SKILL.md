---
name: add-long-lived-workflow
description: Add a durable long-running workflow using HTTP acceptance/status plus Service Bus progression, outbox, idempotent consumers, and explicit workflow state.
---


# Add Long-Lived Workflow

1. Identify owning domain and user-visible goal.
2. Define workflow states and legal transitions.
3. Define workflow ID, status resource and terminal outcomes.
4. Add synchronous start endpoint:
   - validate;
   - persist workflow intent;
   - write outbox atomically;
   - return `202 Accepted` + status URI.
5. Add asynchronous command/event contract.
6. Add consumer step(s) with durable idempotency/inbox.
7. Persist each meaningful state transition.
8. Design retry behavior and irrecoverable failure state.
9. Add cancellation if the business supports it.
10. Add human-review states explicitly when required.
11. Expose status/progress through HTTP.
12. Emit telemetry keyed by workflow/generation ID.
13. Test duplicate messages, restart/resume, retries and invalid transitions.

Never use model/chat history, broker state or Redis as the only workflow state.
