---
paths:
  - "src/**/*.cs"
---

# Redis rules

Redis is non-authoritative infrastructure.

Use for:

- cache-aside;
- expensive query caching;
- short-lived previews/session data where loss is acceptable;
- rate limits;
- explicit coordination.

Each key:

- has owning domain;
- uses namespaced/versioned prefix;
- has intentional TTL;
- documents invalidation strategy.

Correctness must survive eviction and Redis outage according to the capability's resilience requirement.

Never:

- store the only copy of durable workflow state;
- store durable inbox/outbox truth only in Redis;
- inspect another domain's cache as an integration contract;
- put secrets/tokens/connection strings in cache;
- use Redis pub/sub as a competing service integration bus.
