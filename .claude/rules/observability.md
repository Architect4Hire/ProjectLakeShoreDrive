---
paths:
  - "src/**/*.cs"
  - "src/web/**/*.ts"
---

# Observability rules

Use OpenTelemetry-compatible tracing and structured logs.

Trace across:

- Angular/client request;
- API edge;
- outgoing HTTP;
- SQL;
- Redis;
- outbox relay;
- Service Bus;
- consumer/inbox;
- Semantic Kernel;
- provider/model;
- generated artifact.

Carry correlation across asynchronous boundaries.

When applicable include:

- trace/correlation ID;
- causation ID;
- workflow/generation ID;
- message ID;
- service/domain;
- event version;
- operation result;
- duration.

AI spans/logs should include safe metadata such as model/deployment, prompt version, token counts and tool call names.

Never log secrets or unnecessary full sensitive documents/prompts.
