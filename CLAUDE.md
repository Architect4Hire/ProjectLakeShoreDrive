# Project Lake Shore Drive

Project memory written as a SCRUB-style engineering constitution — Scope, Constraints, Restrictions, Usage, Behavior.

This file is loaded for every Claude Code session. Keep enduring architecture rules here. Put path-specific rules in `.claude/rules/`, repeatable procedures in `.claude/skills/`, review work in `.claude/agents/`, and deterministic safeguards in `.claude/hooks/`.

## Scope

- Project Lake Shore Drive is an **AI Architecture Accelerator / Architect Workbench**.
- The system turns reusable discovery content, architecture patterns, templates, assumptions, risks, ADRs, estimates, SCRUB prompts, and engagement inputs into governed consulting deliverables.
- Primary deliverables include proposals, SOWs, Architecture Vision documents, assessments, recommendations, estimates, kickoff packages, executive summaries, and diagram definitions.
- The backend is a distributed .NET 10 solution composed with .NET Aspire.
- The frontend is Angular 22 + TypeScript and SHALL use the local Lake Shore Drive design system.
- Redis is available as shared infrastructure, but cache ownership remains service/domain-specific.
- Services communicate synchronously over HTTP for immediate interactions and asynchronously through Azure Service Bus for temporal decoupling, cross-domain state propagation, and long-running workflows.
- AI-assisted document creation uses Semantic Kernel with OpenAI and/or Azure OpenAI through configuration.
- The reusable Claude Code engineering toolkit lives in `.claude/`.
- Bounded-domain ownership is architecture, not scaffolding. Do not invent or split a bounded service as a side effect of a feature task.

## Constraints

### Runtime and orchestration

- .NET 10 is the backend target.
- Aspire is the local composition/orchestration model.
- AppHost declares deployable projects, resource dependencies, SQL, Redis, Service Bus, AI configuration references, health/start ordering, and local orchestration only.
- Do not put domain/application logic in AppHost.
- Prefer Azure-hosted production capabilities that preserve the same logical boundaries modeled in Aspire.
- Exact deployment products may evolve; do not silently change deployment topology during feature implementation.

### Service shape and internal layering

Preserve the service's existing project shape. When the repository uses the Project Chicago-style host/Core split, prefer:

```text
ProjectLakeShoreDrive.<Service>/             # thin ASP.NET Core HTTP/API host
ProjectLakeShoreDrive.<Service>.Core/        # domain/application implementation
ProjectLakeShoreDrive.<Service>.Functions/   # async triggers/workers when applicable
```

Entry points delegate inward. They do not become business layers.

Within a service's implementation stack, preserve the onion direction used by the repository:

```text
HTTP Controller ─┐
                 ├─> Facade -> Business -> Data -> Repository -> DbContext
Async Trigger ───┘
```

Responsibilities:

- **Controller / async trigger**: transport binding, auth context, serialization, correlation, delegation, response/settlement. No business rules.
- **Facade**: use-case validation, orchestration at the service boundary, cache use/invalidation, authorization policy calls where owned, delegation to Business.
- **Business**: domain decisions, state-transition rules, model translation, decisions about integration facts. No EF queries, direct Redis access, HTTP calls, or Service Bus publishing.
- **Data**: transaction boundaries, repository composition, durable persistence, outbox persistence, inbox/idempotency state when used.
- **Repository**: service-owned persistence operations. No business decisions or cross-service queries.
- **DbContext**: EF Core mapping/unit-of-work for the owning service database only.

If the current repository differs, preserve the existing architectural intent rather than forcing filenames. Do not collapse layers merely for convenience.

### Domain boundaries

- A bounded service owns its database and internal model.
- One service SHALL NOT reference another service's Core/internal project, DbContext, repository, entity, internal command, or implementation model.
- One service SHALL NOT read another service's database.
- Shared libraries contain cross-cutting mechanisms and stable contracts only — never shared domain logic.
- Integration contracts are intentionally versionable and are not serialized EF entities.
- Redis is never a mechanism for bypassing service ownership.

### HTTP integration

Synchronous HTTP is the default when the caller requires an immediate answer.

Use HTTP for:

- domain queries;
- immediate validation;
- request/response operations;
- short commands that can complete in the request budget;
- direct service capabilities without a temporal-decoupling requirement.

Rules:

- use typed `HttpClient` clients;
- service URLs come from Aspire/configuration/service discovery, never hardcoded;
- propagate cancellation, tracing, correlation, and auth context intentionally;
- define timeouts explicitly;
- retry only operations that are safe to retry;
- use idempotency keys for retried commands where duplicates would matter;
- avoid sequential HTTP call chains that create distributed monolith behavior;
- do not call a service over HTTP simply to mutate its database indirectly as part of another service's local transaction;
- do not treat HTTP success as atomic with the caller's database transaction.

If correctness requires atomic change across services, redesign the workflow around local transactions plus asynchronous coordination rather than trying to create a distributed transaction.

### Messaging and long-lived workflows

Azure Service Bus is used when temporal decoupling is a requirement.

Use asynchronous messaging for:

- cross-domain state propagation;
- long-running processing;
- AI/document-generation pipelines that exceed the request budget;
- fan-out;
- independent subscribers;
- retryable work that must survive caller disconnects;
- durable workflow progression;
- eventual-consistency updates.

Do **not** replace simple domain queries with request/reply messaging.

Long-lived workflows SHALL have durable state. They are not merely a chain of messages with no persisted workflow record.

For client-triggered long-running work:

1. validate synchronously;
2. persist workflow intent;
3. atomically write an outbox message when publication is required;
4. return `202 Accepted` plus a workflow/status resource;
5. advance the workflow asynchronously;
6. expose status/progress through HTTP.

### Transactional outbox

A service that atomically persists business state and publishes an integration event **SHALL use a transactional outbox**.

Rules:

- state changes and outbox record commit in the same local database transaction;
- Controller, Facade, Business, and Repository do not directly publish the resulting transactional integration event;
- only an outbox relay/dispatcher publishes persisted outbox messages;
- never mark an outbox item dispatched before the broker acknowledges publication;
- relay retries are idempotent and observable;
- retain enough metadata to trace publication and diagnose poison messages;
- event contracts describe facts in past tense.

The outbox is not required for an ordinary HTTP-only request that publishes no durable asynchronous event.

### Idempotency and transactional inbox

Every asynchronous consumer **SHALL be idempotent**.

A transactional inbox **SHOULD be used** when:

- consuming a message changes durable state;
- duplicate processing could create incorrect side effects;
- business effects and "message processed" state should commit atomically;
- the operation cannot be made naturally idempotent through a stable business key alone.

Rules:

- duplicate message delivery is expected behavior;
- inbox state belongs to the consuming service database;
- do not mark a message complete if durable side effects fail;
- unique constraints/business idempotency keys may complement the inbox;
- do not use Redis alone as the durable proof that a message was processed.

### Redis

Redis is an optimization/coordination mechanism, not authoritative domain storage.

Allowed uses include:

- cache-aside/read-through cache;
- expensive lookup caching;
- rate-limit state;
- short-lived AI session/preview data where loss is acceptable;
- explicitly designed distributed coordination.

Rules:

- cache keys are namespaced by owning domain and version;
- every cache entry has an intentional TTL unless an ADR explicitly justifies otherwise;
- cache invalidation is designed alongside the write path;
- business correctness must survive cache misses and eviction;
- do not store secrets, access tokens, connection strings, or broad sensitive documents in cache;
- do not query another domain's cache keys;
- do not use Redis pub/sub as a second integration broker when Service Bus owns that concern.

### AI / Semantic Kernel

Semantic Kernel is the primary AI orchestration layer for Project Lake Shore Drive.

The application may integrate OpenAI or Azure OpenAI, selected through configuration and service-owned AI abstractions.

Rules:

- domain/application code depends on project-owned AI interfaces, not provider SDK types;
- provider setup and Semantic Kernel composition live in infrastructure/composition boundaries;
- model/deployment names and credentials are configuration;
- never hardcode API keys;
- prompts/system instructions are versioned source-controlled assets;
- prompt templates are not scattered as large inline strings through controllers/components;
- Semantic Kernel plugins expose narrow capabilities and explicit descriptions;
- plugin functions validate authorization and inputs before side effects;
- model output is untrusted input and must be parsed/validated before persistence or execution;
- structured output requires schema validation;
- never let a model directly choose arbitrary service URLs, SQL, filesystem paths, or privileged operations;
- protect against prompt injection when retrieved/user-authored content is included;
- clearly separate trusted system instructions from untrusted engagement/source content;
- log AI metadata, not secrets or unnecessary full prompts/documents;
- propagate correlation/generation/workflow identifiers into AI telemetry.

Do not silently replace Semantic Kernel with Microsoft Agent Framework or another orchestration library. Such a change requires an explicit architecture decision.

### AI execution model

Synchronous AI is acceptable only when the operation is bounded, cancellable, reasonably quick, and the user needs the response in the current request.

Prefer the long-lived workflow path when generation:

- makes multiple model calls;
- composes multiple artifacts;
- performs retrieval/assembly;
- requires retries;
- can exceed request limits;
- requires human approval;
- is resumable;
- has meaningful progress.

AI generation workflows must persist state outside model context.

### AI provenance and governance

Generated artifacts should retain provenance appropriate to the product:

- generation/workflow ID;
- template ID/version;
- prompt version;
- model/deployment;
- source knowledge references;
- generated-at UTC;
- engagement ID;
- review/approval state.

AI-generated content is not automatically authoritative.

Promotion into the reusable knowledge library requires an explicit governed action.

### Angular 22

The web client is Angular 22 + TypeScript.

Default to modern Angular:

- standalone components/directives/pipes;
- signals for component/view state;
- `computed()` for derived state;
- `effect()` only for real side effects;
- typed reactive forms for substantial forms;
- built-in control flow (`@if`, `@for`, `@switch`);
- route-level lazy loading;
- functional interceptors/guards/providers where appropriate;
- `OnPush`;
- zoneless-compatible code and no unnecessary dependence on ZoneJS behavior;
- `@defer` for deliberate deferrable UI;
- strict templates and strict TypeScript;
- Angular's supported RxJS interop rather than ad-hoc subscription management.

Avoid:

- React mental models, hooks, JSX, Redux-style boilerplate by default;
- NgModules for new feature code unless required by a dependency or existing boundary;
- manual `subscribe()` in components when template async/signals or lifecycle-safe interop is cleaner;
- mutable shared singleton state without an explicit state model;
- heavy computation in templates;
- components that call raw backend URLs directly;
- giant "smart" components that own transport, domain logic, state, and rendering together.

### Angular service/API boundary

- UI components do not know internal service hostnames.
- The Angular application uses typed API client/services.
- API base addresses come from environment/configuration.
- Interceptors handle cross-cutting HTTP behavior such as correlation/auth/error normalization when appropriate.
- Feature state lives near the feature.
- Prefer server authority for business invariants; client validation improves UX but does not replace server validation.
- Use cancellation/switching semantics for stale searches/autocomplete.
- Do not duplicate server DTOs by copy/paste across many features; centralize public client contracts deliberately.

### Design system

The local Lake Shore Drive design system lives under:

```text
src/web/design-system/
```

It is the source of truth for:

- design tokens;
- semantic tokens;
- typography;
- spacing;
- layout primitives;
- Tailwind recipes;
- form controls;
- navigation;
- surfaces/cards;
- dialogs/drawers;
- page shells;
- loading/empty/error states;
- generation-progress/status visuals.

Rules:

- do not create a competing design system inside feature folders;
- do not paste the same large Tailwind class bundle across components;
- feature pages compose primitives and patterns;
- preserve accessibility, keyboard interaction, focus visibility, labels, reduced-motion behavior, responsive layout, and dark/light theme support where defined;
- design-system changes should remain domain-neutral.

### SQL ownership

- Use Microsoft SQL Server / Azure SQL when a relational store is required by the service.
- Each bounded domain owns its persistence.
- No cross-database joins across service boundaries.
- Migrations belong to the owning service.
- Do not introduce PostgreSQL/Npgsql conventions unless an ADR explicitly changes the baseline.
- Durable workflow, outbox, and inbox state lives in the owning durable store, not only in Redis.

### Observability

Use OpenTelemetry conventions across HTTP, messaging, SQL, Redis, and AI paths.

An operator should be able to trace:

```text
Angular → API → HTTP dependency → SQL/Redis
        → outbox → relay → Service Bus → consumer/inbox
        → Semantic Kernel → model/tool call → artifact
```

Carry:

- trace/correlation ID;
- causation ID for asynchronous work when available;
- workflow/generation ID;
- message ID;
- service/domain name;
- event type/version;
- result and duration.

Never log:

- API keys;
- access tokens;
- raw connection strings;
- unnecessary full prompts;
- unnecessarily broad engagement documents;
- hidden model/system instructions.

### Testing

Backend:

- unit-test rules at the layer that owns the rule;
- API tests verify transport, authorization, stable error contracts, and public behavior;
- HTTP integration tests cover timeouts, failure mapping, idempotency where applicable, and no accidental cross-service persistence;
- messaging tests cover duplicate delivery, inbox behavior, outbox atomicity, relay retry, poison/dead-letter behavior, and contract compatibility;
- Redis tests prove correctness does not depend on cache presence;
- AI tests use abstractions/fakes for deterministic business tests and narrowly scoped integration tests for provider/Semantic Kernel wiring;
- prompt/template tests validate required variables, output schema, and safety constraints;
- long-lived workflow tests cover resume/retry/duplicate events and invalid state transitions.

Angular:

- build/lint/test affected projects;
- test behavior rather than framework implementation trivia;
- cover keyboard behavior and accessible names for reusable components;
- cover loading, empty, error, partial, and long-running progress states;
- verify typed API mapping and stale-request cancellation where relevant.

## Restrictions

- Never invent a new bounded service as a side effect of a feature.
- Never share a service database or DbContext across domains.
- Never read another service's database directly.
- Never use Redis to bypass a service API or as the authoritative inbox/outbox store.
- Never publish a transactional integration event before the local state transaction and outbox record commit.
- Never mark an outbox item sent before broker acknowledgement.
- Never mark an inbox item complete if durable business effects failed.
- Never assume exactly-once delivery from the broker.
- Never use Service Bus for a simple query that needs an immediate response.
- Never create a deep synchronous HTTP dependency chain without calling out the coupling.
- Never attempt distributed ACID transactions across service databases.
- Never hardcode service endpoints, Redis endpoints, Service Bus endpoints, model names, deployments, or credentials in business code.
- Never put provider-specific OpenAI/Azure OpenAI types in domain contracts.
- Never execute model output as SQL, shell, code, URL, or privileged tool input without explicit validation/allow-listing.
- Never let retrieved content override system/developer constraints.
- Never silently promote AI output into the approved knowledge library.
- Never create React components/hooks or React-specific state patterns in the Angular client.
- Never duplicate design-system token values or common Tailwind recipes inside feature components.
- Never weaken accessibility for visual convenience.
- Never log secrets or broad sensitive content.

## Usage

Before changing code:

1. Identify the owning bounded domain.
2. Identify the interaction type:
   - Angular/UI,
   - incoming HTTP,
   - outgoing HTTP,
   - Service Bus message,
   - outbox relay,
   - long-lived workflow,
   - AI generation,
   - Redis/cache,
   - SQL/persistence,
   - infrastructure.
3. Read the matching `.claude/rules/*.md`.
4. Use a matching skill instead of inventing a procedure.
5. For multi-file work, state a short plan naming the affected boundaries.
6. Decide explicitly whether HTTP or messaging is appropriate.
7. If asynchronous publication follows a durable state change, verify whether an outbox is mandatory.
8. If asynchronous consumption mutates durable state, design idempotency and decide whether a transactional inbox is warranted.
9. For AI work, identify prompt/template version, schema/validation, provenance, and execution mode.
10. Run the applicable quality gate.

Useful skills:

- `add-angular-feature`
- `add-design-system-component`
- `add-http-integration`
- `add-endpoint`
- `add-integration-event`
- `add-long-lived-workflow`
- `add-redis-cache`
- `add-ai-capability`
- `add-semantic-kernel-plugin`
- `add-document-generation-template`
- `add-aspire-resource`
- `trace-a-request`
- `run-quality-gate`

Use read-only agents after implementation:

- `code-reviewer`
- `architecture-boundary-checker`
- `angular-reviewer`
- `ai-safety-reviewer`
- `integration-pattern-reviewer`
- `test-gap-analyzer`

## Behavior

- Preserve established architecture before optimizing for fewer files.
- Prefer small vertical slices that prove a complete seam.
- For fast-moving APIs — Angular, Aspire, Semantic Kernel, OpenAI/Azure OpenAI, Azure Functions/Service Bus — verify current official documentation before version-sensitive implementation.
- State the integration choice in change summaries: HTTP or messaging, and why.
- State durability choices: outbox/inbox/idempotency.
- State cache ownership and invalidation when Redis is involved.
- State AI prompt/template versioning, validation, and provenance when AI is involved.
- Ask only when a decision would materially change architecture, public contracts, security, persistence ownership, deployment topology, or user-visible behavior and cannot be made reversibly.
- Otherwise make the narrowest reversible assumption and record it.
- A feature is not complete because it compiles. Validate contracts, persistence, retries/idempotency, telemetry, tests, UX states, and AI validation that apply.

## Confirmed architecture decisions

1. Frontend: Angular 22 + TypeScript.
2. UI: local Lake Shore Drive design system under `src/web/design-system/`.
3. Backend: .NET 10 with Aspire local orchestration.
4. Cache: Redis is available but is non-authoritative and domain-owned by key namespace.
5. Synchronous integration: HTTP for immediate request/response interactions and domain queries.
6. Asynchronous integration: Azure Service Bus for cross-domain state propagation, long-running work, fan-out, and temporal decoupling.
7. Transactional outbox: required when a service atomically persists state and publishes integration events.
8. Consumers: idempotent by design.
9. Transactional inbox: preferred when consumed messages modify durable state and duplicate side effects matter.
10. AI: Semantic Kernel orchestrates OpenAI/Azure OpenAI integrations through project-owned abstractions.
11. AI document/package generation that is long-running uses durable workflow state and asynchronous execution.
12. AI-generated content is governed and is not automatically promoted into the authoritative reusable knowledge library.
