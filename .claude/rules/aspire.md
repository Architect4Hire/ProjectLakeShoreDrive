---
paths:
  - "src/**/*AppHost*/*"
  - "src/**/*ServiceDefaults*/*"
---

# Aspire rules

AppHost composes resources; it does not contain application behavior.

Model:

- API/service projects;
- SQL resources/databases;
- Redis;
- Service Bus/emulator resources where supported;
- Angular dev host if the repository wires it;
- observability/resource references;
- AI configuration references/secrets through safe configuration.

Rules:

- no hardcoded local ports when service discovery can be used;
- pass the narrowest resource reference to each workload;
- an API does not receive Service Bus credentials merely because another worker requires them;
- service names are stable and intentional;
- health/start dependencies are explicit when needed;
- do not hide business orchestration in AppHost callbacks.
