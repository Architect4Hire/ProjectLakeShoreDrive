---
name: add-redis-cache
description: Add Redis cache-aside behavior with explicit ownership, TTL, invalidation, fallback correctness, and observability.
---


# Add Redis Cache

1. Identify owning domain and source of truth.
2. Prove the data is safe and useful to cache.
3. Define key format: `<domain>:<capability>:v<schema>:<business-key>`.
4. Define TTL and reason.
5. Choose cache-aside/read-through behavior.
6. Define invalidation/update behavior on writes.
7. Keep Redis access outside Business/domain code.
8. Make cache failure degrade safely according to the use case.
9. Never use another service's cache contract.
10. Add hit/miss/failure telemetry without noisy logs.
11. Test miss, hit, stale/expired, invalidation and Redis-unavailable behavior.
