---
name: add-aspire-resource
description: Add or modify an Aspire-composed SQL, Redis, Service Bus, API, AI configuration, or deployable resource with least-privilege dependency wiring.
---


# Add Aspire Resource

1. Read `.claude/rules/aspire.md`.
2. Identify resource owner and consuming workloads.
3. Add the resource in AppHost without business logic.
4. Give it a stable logical name.
5. Wire only workloads that require it.
6. Prefer service discovery/config references over hardcoded addresses.
7. Add health/start dependency only when required.
8. Keep secrets out of source.
9. Update local developer documentation if setup changes.
10. Verify AppHost starts and resource references resolve.
