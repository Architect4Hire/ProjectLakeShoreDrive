# Project Lake Shore Drive — Service Implementation Template

This document defines the preferred implementation shape when a bounded capability becomes a physical .NET service.

## Project shape

```text
ProjectLakeShoreDrive.<Capability>/
  Controllers/
  Program.cs

ProjectLakeShoreDrive.<Capability>.Core/
  Facades/
  Business/
  Data/
  Repositories/
  Persistence/
  Models/
  Mapping/
  Validation/
  Integration/
  Caching/

ProjectLakeShoreDrive.<Capability>.Functions/
  Functions/
    ServiceBus/
    Timers/
  Program.cs
  host.json
```

A Functions project is a transport/worker adapter, not a second copy of the service's business logic.

## Request flow

```text
Controller
→ Facade/Application Use Case
→ Business/Domain
→ Data
→ Repository
→ owning SQL database
```

## Responsibilities

### Controller

- HTTP transport;
- request binding;
- authentication context handoff;
- cancellation;
- response/ProblemDetails mapping.

No business rules or direct repositories.

### Facade/Application Use Case

- use-case validation;
- authorization/resource checks;
- orchestration;
- cache strategy entry point;
- transaction intent.

### Business/Domain

- business rules;
- state transitions;
- model translation;
- domain decisions.

No provider SDKs.

### Data

- transaction boundary;
- persistence coordination;
- outbox/inbox atomicity.

### Repository

- SQL/EF persistence mechanics;
- bounded queries;
- concurrency.

## Caching

Cache-aside only where justified.

- domain-owned key namespace;
- explicit TTL;
- write-path invalidation;
- authoritative SQL fallback;
- no cross-domain cache inspection.

## HTTP integrations

Use typed HttpClient clients with:

- timeouts;
- cancellation;
- trace propagation;
- bounded resilience;
- stable contracts.

## Messaging

If publishing a durable integration fact from a state mutation:

- write OutboxMessage in the same local transaction;
- relay after commit.

Consumers:

- are idempotent;
- use InboxMessage when durable duplicate side effects matter;
- delegate to the same application/business core as HTTP entry points.

## AI

Provider SDKs and Semantic Kernel orchestration stay behind internal AI interfaces. A business service should consume narrow AI abstractions rather than construct kernels/models directly.
