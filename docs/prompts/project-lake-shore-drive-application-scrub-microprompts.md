# Project Lake Shore Drive — SCRUB Microstep Implementation Prompts

> Step-by-step, seam-by-seam implementation sequence modeled after Project Chicago, rebuilt for Project Lake Shore Drive's AI Architecture Accelerator requirements.

These prompts implement the canonical requirements in [`../requirements/requirements.md`](../requirements/requirements.md) while preserving the architecture and engineering rules in `CLAUDE.md` and `.claude/`.

## Why this sequence is different from Project Chicago

Project Chicago's strongest pattern is retained: **one prompt = one primary change**, compact requirement traceability, explicit adjacent-work prohibitions, independent verification, and a hard STOP. Lake Shore Drive adds several foundational seams that must exist before product features safely depend on them:

- Angular 22 consuming a separately transformed and accepted Lake Shore Drive Design System under `src/web/design-system/`;
- structured consulting-domain data and lifecycle traceability;
- Semantic Kernel as the AI orchestration boundary;
- OpenAI behind provider-neutral interfaces;
- governed prompt assets and structured-output validation;
- RAG ingestion, authorization-aware retrieval, and resolvable citations;
- long-lived generation/ingestion workflows using Azure Service Bus where temporal decoupling is valuable;
- transactional outbox, idempotent consumers, and transactional inbox where durable side effects warrant it;
- immutable approved artifact versions and explicit human approval gates.

## Microstep contract

Every prompt below follows this contract:

1. **Requirements** — names the canonical requirement IDs or sections advanced by the step.
2. **Scope** — exactly one primary implementation seam.
3. **Constraint** — the architectural/product rules that must remain true.
4. **Restriction** — adjacent work that is explicitly forbidden.
5. **Usage** — the repository rules, skills, providers, or verification approach to use.
6. **Behavior** — the observable completion criteria, tests, and mandatory `STOP`.

### Source-of-truth rule

For every prompt, Claude MUST open the canonical requirements file and the relevant `CLAUDE.md` / `.claude/` rules before changing code. If this prompt conflicts with the requirements or an approved ADR, **STOP and report the drift rather than inventing a resolution**.

### Design-system precondition and ownership rule

The Lake Shore Drive application prompt sequence **does not build the design system**. Before frontend feature implementation begins, the separately produced design system must be copied into and accepted at:

`src/web/design-system/`

The source transformation process is defined in [`project-lake-shore-drive-design-system-scrub-microprompts.md`](project-lake-shore-drive-design-system-scrub-microprompts.md).

For every frontend prompt after the design-system acceptance phase:

- consume only public design-system APIs;
- reuse an existing primitive, component, pattern, recipe, layout, or semantic utility when one exists;
- do not duplicate long Tailwind/CSS bundles in feature code;
- do not import private design-system implementation paths;
- do not modify design-system internals as a side effect of feature work;
- if a required reusable UI capability is missing, **STOP and report the missing design-system capability** so it can be added through the separate design-system workflow.

### Architecture rules this library assumes only after approval

The requirements already establish these non-negotiable principles:

- .NET 10 / ASP.NET Core backend and .NET Aspire local orchestration.
- Angular 22 + TypeScript frontend.
- Tailwind CSS primarily behind a governed local design system.
- SQL Server / Azure SQL with database ownership per bounded domain.
- Redis is infrastructure/cache, never cross-domain source of truth.
- Synchronous HTTP is preferred for immediate request/response and queries.
- Azure Service Bus is used for cross-domain state propagation, long-running/retryable/fan-out work, and temporal decoupling — **not merely because services are separate**.
- State mutation + event publication in one logical operation uses a transactional outbox.
- Consumers are idempotent; transactional inbox is used when duplicate durable side effects matter.
- Semantic Kernel is the AI orchestration boundary; provider SDK types do not leak into domain/application code.
- Angular never calls OpenAI directly.
- AI output is draft/recommendation until explicitly reviewed/approved.
- RAG honors authorization/confidentiality before or during retrieval and retains resolvable citations.

The exact bounded-domain catalog, API-edge approach, identity/session design, long-lived workflow host, artifact-storage provider, and search/vector provider are intentionally resolved through early ADR approval gates rather than silently invented by implementation prompts.

---

# Phase 0 — Repository truth and architecture gates

## Prompt 000 — Inventory the repository without changing it

```text
REQUIREMENTS:
  TRACEABILITY: All requirements; MVP-001..012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Inspect the repository, CLAUDE.md, the complete .claude toolkit, docs, solution/package files, and current source tree. Produce a current-state inventory only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create, edit, rename, delete, install, scaffold, migrate, or make architecture decisions.

USAGE: Read-only repository inspection. Identify documented versus implemented capabilities and the smallest build/test commands that can run now.

BEHAVIOR: Report tree, current implementation state, unresolved decisions, requirement/prompt drift, and clean git status. STOP.
```

## Prompt 001 — Bind the canonical requirements source

```text
REQUIREMENTS:
  TRACEABILITY: All requirement families; §36 Architecture Guardrails
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Locate docs/requirements/requirements.md and build an ID/heading index grouped by business, AI, RAG, design system, UX, data, security, operations, governance, SCRUB, NFR, test, and MVP families.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not modify requirements or infer missing requirements.

USAGE: Use repository search only; compare the requirements baseline with CLAUDE.md and .claude rules.

BEHAVIOR: Report exact path, duplicate/missing IDs, grouped index, and any contradictions. STOP.
```

## Prompt 002 — Propose the initial bounded-domain catalog

```text
REQUIREMENTS:
  TRACEABILITY: PR-001..007; BR-020..023; BR-030..034; BR-040..044; BR-050..053; BR-060..063; BR-090..092; BR-100..105; BR-120; TR-DATA-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Produce one recommended bounded-domain catalog for the MVP and map each capability to an owning domain.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not scaffold projects or freeze boundaries in code. Do not create a service simply because a noun exists.

USAGE: Apply cohesion, transaction ownership, change cadence, authorization, data ownership, and workflow boundaries. Respect the README rule that named services are illustrative until approved by ADR.

BEHAVIOR: Return ownership, SQL database ownership, sync/async interaction candidates, rejected alternatives, and require explicit approval. STOP.
```

## Prompt 003 — Record the approved bounded-domain ADR

```text
REQUIREMENTS:
  TRACEABILITY: Approved decision from Prompt 002; TR-DATA-001; §36
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one ADR recording only the approved bounded-domain catalog and ownership rules.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add implementation topology not approved in Prompt 002.

USAGE: Follow repository ADR conventions. Include no cross-database access and no shared EF entities across domains.

BEHAVIOR: Verify ADR matches the approved decision exactly. STOP.
```

## Prompt 004 — Propose the API edge and browser integration decision

```text
REQUIREMENTS:
  TRACEABILITY: PR-007; SEC-001..008; OPS-001; NFR-001..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Recommend the browser-facing API edge/gateway approach and the rule for Angular API access.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not scaffold a gateway or choose auth transport as a side effect.

USAGE: Evaluate direct API exposure versus a single gateway/BFF edge, typed Angular clients, correlation, authorization, streaming needs, and local Aspire routing.

BEHAVIOR: Return one recommendation, rejected alternatives, and request approval. STOP.
```

## Prompt 005 — Record the approved API edge ADR

```text
REQUIREMENTS:
  TRACEABILITY: Approved decision from Prompt 004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one ADR for the browser/API edge only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not modify code or unrelated architecture decisions.

USAGE: Capture browser routing, service discovery expectations, error/correlation policy, and ownership.

BEHAVIOR: Verify exact agreement with Prompt 004 approval. STOP.
```

## Prompt 006 — Propose authentication and authorization architecture

```text
REQUIREMENTS:
  TRACEABILITY: BR-010..014; SEC-001..008; TR-AI-008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Recommend authentication/session transport and server-side authorization policy structure for Principal Architect, Contributor, Reviewer, Knowledge Curator, and Administrator.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement identity or invent external IdP requirements absent from the canonical requirements.

USAGE: Preserve engagement isolation and ensure AI-accessible functions use identical authorization boundaries.

BEHAVIOR: Return recommendation, policy matrix, rejected alternatives, and request approval. STOP.
```

## Prompt 007 — Record the approved identity ADR

```text
REQUIREMENTS:
  TRACEABILITY: Approved decision from Prompt 006; SEC-001..008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one ADR for identity/session/authorization boundaries.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not scaffold identity code.

USAGE: Include role/operation/engagement enforcement and AI function authorization.

BEHAVIOR: Verify the ADR contains only the approved decision. STOP.
```

## Prompt 008 — Propose durable workflow hosting topology

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..105; TR-OAI-005..007; NFR-002..004; README long-lived workflow rules
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Recommend how long-running generation, ingestion, and other durable workflows are hosted and resumed.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not scaffold workers or assume Azure Functions versus another host unless approved.

USAGE: Use persisted workflow state, Azure Service Bus for temporally decoupled work, outbox on producer state+event transactions, idempotent consumers, and inbox where duplicate durable side effects matter.

BEHAVIOR: Return topology, state ownership, retry/DLQ model, status-resource pattern, and request approval. STOP.
```

## Prompt 009 — Record the approved workflow-hosting ADR

```text
REQUIREMENTS:
  TRACEABILITY: Approved decision from Prompt 008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one ADR for long-lived workflow hosting and durability boundaries.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement messaging.

USAGE: Capture 202/status-resource behavior, outbox/inbox rules, consumer idempotency, recovery, and operational ownership.

BEHAVIOR: Verify exact match to approved topology. STOP.
```

## Prompt 010 — Propose storage and search provider boundaries

```text
REQUIREMENTS:
  TRACEABILITY: PR-007; TR-DATA-001..004; BR-120; TR-RAG-001..007; TR-SEARCH-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Recommend provider abstractions and initial implementations for relational data, binary/generated artifacts, and hybrid/vector retrieval.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create infrastructure or hard-code a cloud provider where requirements only demand an abstraction.

USAGE: Keep SQL as bounded-domain system of record; artifacts outside core relational rows; retrieval metadata and authorization filters mandatory.

BEHAVIOR: Return interfaces, initial provider choices, alternatives, and request approval. STOP.
```

## Prompt 011 — Record the approved storage/search ADR

```text
REQUIREMENTS:
  TRACEABILITY: Approved decision from Prompt 010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one ADR for artifact storage and retrieval provider choices.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement provider code.

USAGE: Include versioning, citation resolution, confidentiality filtering, and migration/replacement boundaries.

BEHAVIOR: Verify ADR only records approved choices. STOP.
```

# Phase 1 — Solution skeleton, Aspire, shared platform seams

## Prompt 012 — Create the .NET solution skeleton

```text
REQUIREMENTS:
  TRACEABILITY: NFR-006..007; §32 Proposed Repository Shape
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the .NET 10 solution and only the approved backend project shells from the domain ADR.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add business entities, EF models, AI code, messaging, or endpoints.

USAGE: Use project references that enforce ownership and prevent cross-domain implementation references.

BEHAVIOR: Run dotnet restore/build; verify dependency direction. STOP.
```

## Prompt 013 — Create the Aspire AppHost

```text
REQUIREMENTS:
  TRACEABILITY: README technology baseline; OPS-001..002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the .NET Aspire AppHost and wire only existing project resources.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add SQL, Redis, Service Bus, OpenAI, search, or storage resources yet.

USAGE: Use service discovery and environment configuration conventions from .claude.

BEHAVIOR: Run AppHost validation/build. STOP.
```

## Prompt 014 — Create ServiceDefaults and OpenTelemetry baseline

```text
REQUIREMENTS:
  TRACEABILITY: OPS-001..004; NFR-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create shared service defaults for OpenTelemetry, health checks, correlation, and standard resilience hooks.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not log prompts, document bodies, secrets, or client-confidential content.

USAGE: Keep telemetry provider-neutral with Azure Monitor/Application Insights configuration at deployment boundary.

BEHAVIOR: Add tests/config validation and build. STOP.
```

## Prompt 015 — Add SQL resources to Aspire

```text
REQUIREMENTS:
  TRACEABILITY: TR-DATA-001; README persistence baseline
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add one SQL resource/database binding per approved bounded domain.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create schemas, entities, migrations, or shared databases.

USAGE: Use SQL Server/Azure SQL compatible configuration and service-owned connection names.

BEHAVIOR: Start/validate Aspire resources and verify ownership naming. STOP.
```

## Prompt 016 — Add Redis to Aspire

```text
REQUIREMENTS:
  TRACEABILITY: README Redis rules; NFR-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add Redis as a shared infrastructure resource and bind only services approved to use it.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add cache usage or make Redis authoritative.

USAGE: No cross-domain contracts may depend on another domain cache.

BEHAVIOR: Validate resource wiring; no code-level caching yet. STOP.
```

## Prompt 017 — Add Azure Service Bus resource/configuration

```text
REQUIREMENTS:
  TRACEABILITY: README integration rule; BR-100..105; TR-OAI-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add Service Bus resource/configuration to Aspire according to the approved workflow ADR.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create topics/queues beyond ADR-approved topology and do not implement producers/consumers.

USAGE: Entity names come from configuration; no credentials in source.

BEHAVIOR: Validate AppHost wiring and configuration. STOP.
```

## Prompt 018 — Add AI provider configuration surface

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-001..010; TR-OAI-001..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create configuration/options types for Semantic Kernel and OpenAI model profiles.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not invoke OpenAI or expose provider SDK types to domain/application projects.

USAGE: Support configuration-driven profiles for extraction, reasoning, drafting, summarization, embeddings, and evaluation.

BEHAVIOR: Unit-test validation and build. STOP.
```

## Prompt 019 — Add artifact storage configuration surface

```text
REQUIREMENTS:
  TRACEABILITY: TR-DATA-002..003; approved storage ADR
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider-neutral artifact storage options and DI registration seam.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not upload or persist artifacts yet.

USAGE: Keep metadata in domain-owned relational state; provider credentials are server-side configuration.

BEHAVIOR: Build and configuration-test. STOP.
```

## Prompt 020 — Add retrieval/search configuration surface

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001..007; TR-SEARCH-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider-neutral retrieval/search options and DI registration seam.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not ingest, embed, or query content yet.

USAGE: Include index/version/filter configuration needed for confidentiality-aware retrieval.

BEHAVIOR: Build and configuration-test. STOP.
```

## Prompt 021 — Create architecture dependency tests

```text
REQUIREMENTS:
  TRACEABILITY: PR-007; TR-AI-010; TR-DATA-001; NFR-006..007
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create architecture tests that enforce approved project dependency rules.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not change project references merely to make tests pass without documenting drift.

USAGE: Prove domain/application code cannot reference provider SDKs or another domain persistence implementation.

BEHAVIOR: Run architecture tests and report violations. STOP.
```

# Phase 2 — Messaging durability and workflow substrate

## Prompt 022 — Define the integration event envelope

```text
REQUIREMENTS:
  TRACEABILITY: README messaging rules; OPS-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create a versioned provider-neutral integration event envelope.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add business event types or Service Bus SDK references.

USAGE: Include event/message ID, correlation ID, causation ID, event type, schema version, occurred-at UTC, producer, and business key where appropriate.

BEHAVIOR: Add serialization contract tests. STOP.
```

## Prompt 023 — Create OutboxMessage persistence model

```text
REQUIREMENTS:
  TRACEABILITY: README outbox rule; TR-DATA-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the SQL-compatible outbox persistence model/configuration in the reusable infrastructure seam approved by architecture.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create relay logic, migrations for business domains, or publish anything.

USAGE: Capture stable ID, contract/version, payload, tracing metadata, occurred/created UTC, attempts/status, lease/concurrency fields.

BEHAVIOR: Add EF metadata tests and build. STOP.
```

## Prompt 024 — Create InboxMessage persistence model

```text
REQUIREMENTS:
  TRACEABILITY: README inbox/idempotency rule; NFR-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the SQL-compatible inbox/idempotency persistence model/configuration.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create consumers or a central cross-domain inbox database.

USAGE: Support message ID uniqueness, received/processing/completed UTC, outcome/failure metadata.

BEHAVIOR: Add model/config tests. STOP.
```

## Prompt 025 — Create integration event serializer

```text
REQUIREMENTS:
  TRACEABILITY: README messaging rules
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create serializer/deserializer for versioned integration envelopes.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not send messages or touch databases.

USAGE: Reject malformed/unsupported versions using typed failure behavior.

BEHAVIOR: Add round-trip and failure tests. STOP.
```

## Prompt 026 — Create Service Bus publisher abstraction

```text
REQUIREMENTS:
  TRACEABILITY: README integration rule
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider-neutral publisher interface plus Azure Service Bus implementation.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not read outbox rows or choose destinations in business code.

USAGE: Publisher accepts prepared envelope/destination and propagates IDs and trace context.

BEHAVIOR: Unit-test message metadata at the adapter boundary. STOP.
```

## Prompt 027 — Create outbox repository lease/query seam

```text
REQUIREMENTS:
  TRACEABILITY: README outbox rule
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable repository operations for leasing pending outbox rows and recording publish outcomes.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create a timer/worker host.

USAGE: Use bounded batches, concurrency-safe lease behavior, UTC timestamps, retry metadata, and no delete-on-success assumption.

BEHAVIOR: Add SQL integration tests. STOP.
```

## Prompt 028 — Create reusable outbox relay service

```text
REQUIREMENTS:
  TRACEABILITY: README outbox rule; OPS-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the host-agnostic outbox relay orchestration service.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not schedule it or embed Service Bus entity names.

USAGE: Lease batch → serialize/publish → mark success/failure; cancellation and bounded retry semantics explicit.

BEHAVIOR: Unit/integration-test duplicate-safe relay behavior. STOP.
```

## Prompt 029 — Host the outbox relay

```text
REQUIREMENTS:
  TRACEABILITY: Approved workflow-hosting ADR
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add only the approved scheduled host/trigger for the outbox relay.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add business consumers or unrelated background jobs.

USAGE: Thin host delegates to reusable relay service and emits backlog/failure telemetry.

BEHAVIOR: Run host tests and local smoke test. STOP.
```

## Prompt 030 — Create reusable inbox/idempotent handler seam

```text
REQUIREMENTS:
  TRACEABILITY: README inbox rule
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable message-processing wrapper that checks/reserves inbox state around handler execution.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add business handlers.

USAGE: Duplicate delivery must be safe; permanent/transient failures represented explicitly.

BEHAVIOR: Add duplicate/retry/concurrency tests. STOP.
```

## Prompt 031 — Create dead-letter operational contract

```text
REQUIREMENTS:
  TRACEABILITY: README reliability; OPS-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create application/operations abstractions for observing and triaging dead-lettered messages.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-replay DLQ messages.

USAGE: Capture entity, message metadata, failure reason, correlation, timestamps, and authorized replay eligibility.

BEHAVIOR: Add contract tests and documentation. STOP.
```

# Phase 3 — Angular 22 and imported Lake Shore Drive design-system acceptance

## Prompt 032 — Scaffold or verify the Angular 22 application

```text
REQUIREMENTS:
  TRACEABILITY: TR-WEB-001..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Create or verify the Angular 22 application workspace that will consume the separately supplied design system.

CONSTRAINT: Use Angular 22, standalone APIs, strict TypeScript, signals-first local state, and zoneless-compatible patterns.

RESTRICTION: Do not create design-system primitives, tokens, recipes, or feature pages.

USAGE: Keep the Angular app minimal and buildable.

BEHAVIOR: Run clean install/build/test and report the Angular version and workspace root. STOP.
```

## Prompt 033 — Verify the imported design-system drop

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..003; DS-011..012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Verify that the separately produced design system exists at src/web/design-system and compare its tree to DS-003 plus its integration manifest.

CONSTRAINT: Treat the design-system source as an upstream accepted product dependency.

RESTRICTION: Do not modify, reorganize, regenerate, or restyle design-system internals.

USAGE: Inspect public API, documentation, test evidence, dependency manifest, and license notices.

BEHAVIOR: Report PASS/FAIL and exact missing files/dependencies. STOP.
```

## Prompt 034 — Wire the design-system public API into the Angular workspace

```text
REQUIREMENTS:
  TRACEABILITY: DS-002..007; TR-WEB-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Configure application imports/path aliases/workspace references required to consume only the design-system public API.

CONSTRAINT: Feature code must not rely on private design-system implementation paths.

RESTRICTION: Do not add product features or re-export private internals.

USAGE: Use the supplied integration manifest as the authority for import wiring.

BEHAVIOR: Compile one minimal legal import and verify a private-path import is rejected by the configured boundary if enforcement exists. STOP.
```

## Prompt 035 — Wire required global styles and Tailwind integration

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..006; DS-010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Apply only the global style, PostCSS/Tailwind, token, font, and asset wiring required by the imported design-system manifest.

CONSTRAINT: The application must consume semantic design-system styling; Tailwind remains primarily a design-system implementation detail.

RESTRICTION: Do not duplicate tokens or create application-local theme palettes.

USAGE: Follow the manifest exactly and keep application global CSS minimal.

BEHAVIOR: Build production CSS and verify representative semantic tokens resolve. STOP.
```

## Prompt 036 — Wire light/dark appearance consumption

```text
REQUIREMENTS:
  TRACEABILITY: DS-010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Connect the application shell bootstrap to the design system’s supported light/dark appearance contract.

CONSTRAINT: Use the design-system theme API or documented mechanism without feature-level raw colors.

RESTRICTION: Do not redesign theme tokens or add a third appearance.

USAGE: Respect user/system preference according to the supplied design-system contract.

BEHAVIOR: Verify both appearances render through the same feature markup. STOP.
```

## Prompt 037 — Create a design-system integration gallery route

```text
REQUIREMENTS:
  TRACEABILITY: DS-007..013; TR-WEB-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Create one development/reference route that composes representative public design-system primitives/components/patterns/recipes to prove integration.

CONSTRAINT: The gallery is an integration harness, not a second design-system documentation implementation.

RESTRICTION: Do not copy component internals or add product data fetching.

USAGE: Use public imports only and static representative fixtures.

BEHAVIOR: Verify buttons, forms, tables, overlays, shell pieces, AI states, citations, and responsive behavior render. STOP.
```

## Prompt 038 — Run design-system accessibility acceptance

```text
REQUIREMENTS:
  TRACEABILITY: DS-008; DS-012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Run the supplied accessibility checks plus keyboard smoke tests against the integrated design-system gallery.

CONSTRAINT: WCAG 2.2 AA behavior is required at integration, not just inside isolated source tests.

RESTRICTION: Do not suppress violations or patch design-system internals in the application.

USAGE: If a design-system defect is found, report it for the separate design-system workflow.

BEHAVIOR: Produce PASS/FAIL with failing component/state and reproducible steps. STOP.
```

## Prompt 039 — Run responsive and appearance acceptance

```text
REQUIREMENTS:
  TRACEABILITY: DS-009..012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Verify critical design-system compositions at desktop, tablet, and mobile widths in both light and dark appearances.

CONSTRAINT: Dense workbench patterns must have a functional narrow-screen strategy.

RESTRICTION: Do not add feature-local CSS to hide design-system defects.

USAGE: Use the supplied visual-regression or Playwright fixtures where possible.

BEHAVIOR: Report mismatches and classify each as integration defect or design-system defect. STOP.
```

## Prompt 040 — Establish application-side design-system enforcement

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..007; BR-144; TR-WEB-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Enable or add application-side guardrails that prohibit private design-system imports and discourage repeated long Tailwind/CSS bundles in feature code.

CONSTRAINT: Guardrails must allow legitimate one-off layout utilities while blocking recreation of common components.

RESTRICTION: Do not rewrite feature pages because none should exist yet.

USAGE: Use lint/dependency rules and the supplied conformance checks when available.

BEHAVIOR: Prove the rules catch one synthetic violation and pass the clean app. STOP.
```

## Prompt 041 — Build the Lake Shore Drive workbench shell by composition

```text
REQUIREMENTS:
  TRACEABILITY: UX-001; DS-003; TR-WEB-005..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Compose the application workbench shell from imported design-system layouts/components/recipes with primary navigation, engagement-context slot, global search slot, command palette trigger, notifications/tasks slot, user menu, and routed content.

CONSTRAINT: Shell code owns application routing/context wiring; visuals come from the design system.

RESTRICTION: Do not create replacement sidebar/navbar/button/surface implementations.

USAGE: Use public design-system APIs and Angular route-level lazy loading.

BEHAVIOR: Verify navigation, keyboard focus, responsive shell behavior, and both appearances. STOP.
```

## Prompt 042 — Wire engagement phase navigation composition

```text
REQUIREMENTS:
  TRACEABILITY: UX-002; DS-003; TR-WEB-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Compose the imported Engagement Phase Rail recipe into the engagement route shell for Overview, Discovery, Requirements, Architecture, ADRs, RAID, Estimates, Documents, and AI.

CONSTRAINT: Application code supplies route and phase state; the design system owns visual/interaction presentation.

RESTRICTION: Do not implement the feature pages or alter the phase-rail recipe.

USAGE: Use lazy child routes with placeholders only where required for route validation.

BEHAVIOR: Verify active route state and keyboard navigation. STOP.
```

## Prompt 043 — Record design-system acceptance and freeze the consumption contract

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..014; UX-001..007; BR-144
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve the external design-system ownership boundary.
  SOURCE OF TRUTH: Read the linked requirements, applicable CLAUDE.md/.claude rules, and the design-system integration manifest before coding. If they conflict, STOP and report drift.

SCOPE: Create an integration acceptance record documenting source revision/checksum, installed path, dependency/config deltas, public import boundary, test results, and the feature-development escape-hatch rule.

CONSTRAINT: The record establishes that subsequent feature prompts consume the design system as an upstream dependency.

RESTRICTION: Do not modify design-system code in this step.

USAGE: State explicitly: missing reusable capability causes feature work to STOP and return to the design-system microprompt workflow.

BEHAVIOR: Require all acceptance checks to pass before Prompt 044 begins. STOP.
```

# Phase 4 — Engagement vertical slice

## Prompt 044 — Define Engagement domain model

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; TR-DATA-003..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the Engagement aggregate/value objects and lifecycle states only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create EF configuration, API contracts, or UI.

USAGE: Capture required structured fields, confidentiality classification, archive behavior, and auditable lifecycle transition rules.

BEHAVIOR: Domain unit tests for valid/invalid transitions. STOP.
```

## Prompt 045 — Create Engagement EF configuration

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; TR-DATA-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create Engagement persistence mappings and indexes only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create repositories/endpoints/UI.

USAGE: SQL Server/Azure SQL compatible, UTC timestamps, concurrency/version column where approved, no provider leakage into domain.

BEHAVIOR: EF model/integration tests. STOP.
```

## Prompt 046 — Create Engagement initial migration

```text
REQUIREMENTS:
  TRACEABILITY: TR-DATA-001..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create only the migration for Engagement schema.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not combine unrelated domain tables.

USAGE: Review generated SQL for SQL Server compatibility and rollback safety.

BEHAVIOR: Apply migration to local Aspire SQL and run integration smoke test. STOP.
```

## Prompt 047 — Define Engagement create/update/read contracts

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create public/application contracts for Engagement create, update, detail, list, phase transition, archive, and search inputs/results.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement handlers/controllers.

USAGE: Contracts expose public data only and stable enums/validation boundaries.

BEHAVIOR: Contract serialization tests. STOP.
```

## Prompt 048 — Implement Engagement repository

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; NFR-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create repository queries/mutations for Engagement only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add application orchestration or HTTP.

USAGE: Use projections for lists, bounded pagination, deterministic sorting, archive default exclusion.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 049 — Implement Engagement application service

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; GOV-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create application/domain orchestration for create/update/get/list/phase/archive only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add controller or UI.

USAGE: Enforce lifecycle/domain validation and produce change-history/audit facts through approved abstractions.

BEHAVIOR: Unit tests for rules and typed outcomes. STOP.
```

## Prompt 050 — Add Engagement API endpoints

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; SEC-001..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add thin endpoints/controllers for Engagement operations.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not inject DbContext/repository directly into transport layer.

USAGE: Server-side authorization by operation/engagement; ProblemDetails; cancellation/correlation; bounded list API.

BEHAVIOR: API tests for success/validation/401/403/not-found/concurrency. STOP.
```

## Prompt 051 — Create typed Angular Engagement API client

```text
REQUIREMENTS:
  TRACEABILITY: BR-020..023; UX-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create typed Angular client methods/models for existing Engagement endpoints.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create pages or hand-code fetch logic in components.

USAGE: Use gateway/API edge base URL, interceptors for auth/correlation/error policy.

BEHAVIOR: Client unit tests. STOP.
```

## Prompt 052 — Build Engagement list page

```text
REQUIREMENTS:
  TRACEABILITY: MVP-001; BR-020..023; PR-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the engagement list/search page only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add page-specific shell or duplicate design-system recipes.

USAGE: Use data table, status, loading/empty/error, bounded pagination, archive/search controls.

BEHAVIOR: Component tests and a11y tests. STOP.
```

## Prompt 053 — Build Create Engagement workflow

```text
REQUIREMENTS:
  TRACEABILITY: MVP-001; BR-020..021
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the new-engagement form/workflow only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not build discovery or templates beyond selecting an existing/configured engagement type.

USAGE: Typed reactive form using design-system controls; preserve structured data.

BEHAVIOR: Component tests and API integration test. STOP.
```

## Prompt 054 — Build Engagement overview workspace

```text
REQUIREMENTS:
  TRACEABILITY: BR-023; UX-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create engagement overview page with summary, phase, completion placeholders, and links to phase routes.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement downstream phase content.

USAGE: Use workbench shell + phase nav + design-system surfaces.

BEHAVIOR: Component/routing tests. STOP.
```

## Prompt 055 — Implement Engagement phase transition UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-022; GOV-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add phase transition control and confirmation behavior to the workspace.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-transition based on AI output.

USAGE: Show allowed transitions, explain blocked transitions, persist auditable transition.

BEHAVIOR: Component/API flow tests. STOP.
```

# Phase 5 — Discovery

## Prompt 056 — Define Discovery Question Library domain model

```text
REQUIREMENTS:
  TRACEABILITY: BR-030..031; GOV-003..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable discovery question/template models and lifecycle/version metadata.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create UI or AI suggestion logic.

USAGE: Support domain grouping and conditional rule representation without embedding executable code from untrusted sources.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 057 — Persist discovery question library

```text
REQUIREMENTS:
  TRACEABILITY: BR-030..031; TR-DATA-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add EF mappings/migration/repository for reusable discovery questions only.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not persist sessions/answers yet.

USAGE: Version approved reusable content; deprecated questions remain historical.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 058 — Define Discovery Session and Answer models

```text
REQUIREMENTS:
  TRACEABILITY: BR-032
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create engagement-scoped discovery session, question instance, answer, notes, evidence, open question, and follow-up models.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement AI or UI.

USAGE: Preserve source/evidence and participant/time metadata; answers are structured records.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 059 — Persist Discovery sessions and answers

```text
REQUIREMENTS:
  TRACEABILITY: BR-032; SEC-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add EF mappings/migration/repository for engagement-scoped discovery sessions/answers.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not cross-query another domain database.

USAGE: Engagement isolation in repository/query inputs.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 060 — Implement discovery application services and API

```text
REQUIREMENTS:
  TRACEABILITY: BR-030..032; SEC-002..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement library query plus session create/update/answer endpoints.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI suggestions yet.

USAGE: Thin transport; authorization and engagement scope enforced server-side.

BEHAVIOR: Unit/API tests. STOP.
```

## Prompt 061 — Build Discovery questionnaire UI

```text
REQUIREMENTS:
  TRACEABILITY: MVP-003; BR-030..032; UX-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create the engagement Discovery page to run structured questionnaires and capture notes/evidence.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI question suggestions yet.

USAGE: Use design-system form primitives; autosave drafts where appropriate.

BEHAVIOR: Component/a11y/API-flow tests. STOP.
```

## Prompt 062 — Implement conditional question evaluation

```text
REQUIREMENTS:
  TRACEABILITY: BR-031
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create deterministic conditional-question evaluator and integrate it into discovery presentation.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not use AI to decide deterministic visibility rules.

USAGE: Rules may depend only on approved structured context; explain why a question is shown/hidden for diagnostics.

BEHAVIOR: Unit tests for rule combinations. STOP.
```

## Prompt 063 — Create discovery gap-analysis input assembler

```text
REQUIREMENTS:
  TRACEABILITY: BR-033..034; TR-AI-010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider-neutral context assembler for AI gap/question suggestions.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not call Semantic Kernel yet.

USAGE: Use approved/authorized engagement facts; explicit schemas; no raw unrelated documents.

BEHAVIOR: Unit tests for context minimization and authorization filtering. STOP.
```

## Prompt 064 — Implement AI-suggested discovery questions

```text
REQUIREMENTS:
  TRACEABILITY: BR-033; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add Semantic Kernel orchestration for suggested questions using structured output.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-insert suggestions into the question library or accepted engagement record.

USAGE: Persist AI audit/provenance and validate schema before exposing output.

BEHAVIOR: AI adapter tests with fake provider plus evaluation cases. STOP.
```

## Prompt 065 — Implement discovery gap detection

```text
REQUIREMENTS:
  TRACEABILITY: BR-034; NFR-008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add deterministic checks for known gap classes plus optional AI suggestions.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not allow AI prose to become a blocking validation rule.

USAGE: Deterministic gaps distinguishable from AI suggestions.

BEHAVIOR: Unit/eval tests. STOP.
```

## Prompt 066 — Build discovery AI review queue

```text
REQUIREMENTS:
  TRACEABILITY: UX-004; DS-013..014; BR-033..034
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add review UI for accepting/rejecting AI-suggested questions and gaps.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not silently merge suggestions.

USAGE: Use AI-specific design-system patterns and persist review disposition.

BEHAVIOR: Component/a11y tests. STOP.
```

# Phase 6 — Requirements matrix and traceability

## Prompt 067 — Define Requirement domain model

```text
REQUIREMENTS:
  TRACEABILITY: BR-040..044; PR-001..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create structured Requirement aggregate/value objects, types, priorities, statuses, acceptance criteria, and trace links.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create AI extraction or UI.

USAGE: Requirement IDs stable; approval explicit; links represented by identifiers, not copied prose.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 068 — Persist requirements and trace links

```text
REQUIREMENTS:
  TRACEABILITY: BR-040..044; TR-DATA-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create EF mappings/migration/repository for requirements and their trace relationships.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add document or ADR persistence here unless owned by same approved domain and required by the relation design.

USAGE: Approved version history preserved; archive rather than destructive delete.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 069 — Implement requirement CRUD/approval API

```text
REQUIREMENTS:
  TRACEABILITY: BR-040..041; SEC-002..003; GOV-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement application service and endpoints for create/edit/classify/approve/archive/list/detail.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI operations.

USAGE: Authorization and engagement isolation required; approval changes auditable.

BEHAVIOR: Unit/API tests. STOP.
```

## Prompt 070 — Build Requirements Matrix UI

```text
REQUIREMENTS:
  TRACEABILITY: MVP-004; BR-040..041; UX-002..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create dense requirements matrix with filters, status, edit/detail split view, and approval actions.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not duplicate table/form recipes outside design system.

USAGE: Responsive narrow-screen fallback; keyboard-friendly editing; AI content visually distinct when later added.

BEHAVIOR: Component/a11y/visual tests. STOP.
```

## Prompt 071 — Create discovery-to-requirement trace service

```text
REQUIREMENTS:
  TRACEABILITY: BR-004; BR-040
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement linking/unlinking of requirements to discovery answers/evidence.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not infer links using AI yet.

USAGE: Trace links auditable and navigation-resolvable.

BEHAVIOR: Unit/API tests. STOP.
```

## Prompt 072 — Create AI requirement extraction schema/context

```text
REQUIREMENTS:
  TRACEABILITY: BR-042; TR-AI-003..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Define constrained structured output schema and context assembler for extracting candidate requirements.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not invoke provider yet.

USAGE: Include source evidence identifiers and confidence/caution metadata; only authorized sources.

BEHAVIOR: Schema/context tests. STOP.
```

## Prompt 073 — Implement AI requirement extraction

```text
REQUIREMENTS:
  TRACEABILITY: BR-042; TR-AI-001..010; TR-OAI-005..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add Semantic Kernel extraction workflow returning candidate requirements.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-approve or overwrite existing requirements.

USAGE: Validate structured output; persist provenance/audit; idempotent generation request.

BEHAVIOR: Fake-provider tests + eval cases. STOP.
```

## Prompt 074 — Build requirement extraction review queue

```text
REQUIREMENTS:
  TRACEABILITY: BR-042; UX-004; DS-013..014
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add UI to compare source discovery material with candidate requirements and accept/edit/reject.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not silently insert AI output.

USAGE: Accepted candidate becomes human-reviewed requirement with attribution.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 075 — Implement requirement contradiction detection

```text
REQUIREMENTS:
  TRACEABILITY: BR-043
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create contradiction analysis over approved/current requirements with evidence.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-resolve conflicts.

USAGE: Prefer deterministic checks where possible; AI findings remain suggestions with cited inputs.

BEHAVIOR: Unit/eval tests. STOP.
```

## Prompt 076 — Build contradiction review UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-043; UX-003..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create split-view contradiction review showing both requirements and supporting evidence.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not mutate requirements without explicit user action.

USAGE: Use review queue pattern; resolution action auditable.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 077 — Implement requirement impact graph query

```text
REQUIREMENTS:
  TRACEABILITY: BR-044; BR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create query/application service that returns potentially affected ADRs, patterns, diagrams, estimates, plan items, documents, and SCRUB prompts for a changed requirement.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not regenerate affected artifacts.

USAGE: Use explicit trace links first; clearly label inferred candidates separately.

BEHAVIOR: Unit/integration tests. STOP.
```

## Prompt 078 — Build requirement impact analysis UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-044; UX-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create impact panel/view from requirement detail.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-apply downstream changes.

USAGE: Show artifact type, status, link reason, and review-required state.

BEHAVIOR: Component tests. STOP.
```

# Phase 7 — Architecture patterns, ADRs, RAID, estimation

## Prompt 079 — Define Architecture Pattern model

```text
REQUIREMENTS:
  TRACEABILITY: BR-050..052; GOV-003..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable versioned Architecture Pattern model and metadata.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add recommendation AI or UI.

USAGE: Capture applicability, contraindications, tradeoffs, security/reliability/cost/ops guidance, related patterns/ADRs, Azure mappings, status/version.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 080 — Persist and query Architecture Patterns

```text
REQUIREMENTS:
  TRACEABILITY: BR-050..052; TR-DATA-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add persistence/migration/repository and browse/filter query for patterns.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not seed unapproved guidance as Approved.

USAGE: Deprecated content excluded from new recommendation candidates by default.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 081 — Build Architecture Pattern library UI

```text
REQUIREMENTS:
  TRACEABILITY: MVP-005; BR-050..052
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create browse/detail/select pattern experience.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI recommendations yet.

USAGE: Use design system and show status/version/tradeoffs/contraindications clearly.

BEHAVIOR: Component tests. STOP.
```

## Prompt 082 — Implement pattern selection and rationale

```text
REQUIREMENTS:
  TRACEABILITY: BR-050..053; BR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create engagement-scoped selection record with architect rationale and linked requirements.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create ADR automatically.

USAGE: Selection and deselection auditable; requirement links explicit.

BEHAVIOR: Unit/API/UI flow tests. STOP.
```

## Prompt 083 — Implement AI pattern recommendation

```text
REQUIREMENTS:
  TRACEABILITY: BR-053; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Use Semantic Kernel to recommend candidate patterns from approved requirements/discovery.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not select patterns automatically.

USAGE: Return rationale, tradeoffs, requirements addressed, and alternatives; exclude deprecated guidance.

BEHAVIOR: Eval and fake-provider tests. STOP.
```

## Prompt 084 — Build pattern recommendation review UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-053; UX-004; DS-013..014
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create review queue for AI pattern recommendations.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not convert recommendation to selection without architect acceptance.

USAGE: Compare recommendation with alternatives and requirement evidence.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 085 — Define and persist ADR model

```text
REQUIREMENTS:
  TRACEABILITY: BR-060..061; TR-DATA-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create ADR model, immutable/version semantics, EF mappings, migration, repository.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI drafting.

USAGE: Include all required ADR sections and trace links.

BEHAVIOR: Domain/SQL tests. STOP.
```

## Prompt 086 — Implement ADR CRUD/approval API and UI

```text
REQUIREMENTS:
  TRACEABILITY: MVP-006; BR-060..061; GOV-001
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement ADR create/edit/version/approve/detail/list plus Angular workbench.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI drafting in this step.

USAGE: Approval immutable; changes create a new version/draft.

BEHAVIOR: Unit/API/component tests. STOP.
```

## Prompt 087 — Implement AI ADR drafting

```text
REQUIREMENTS:
  TRACEABILITY: BR-062; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Generate ADR draft from selected requirements, patterns, discovery answers, and architect notes.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not approve or overwrite approved ADR content.

USAGE: Structured sections, provenance, context minimization, audit.

BEHAVIOR: Eval/fake-provider tests. STOP.
```

## Prompt 088 — Build ADR compare/review experience

```text
REQUIREMENTS:
  TRACEABILITY: BR-062; UX-003..004; DS-013
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create side-by-side source/current/draft review with accept/edit/reject per workflow.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not merge AI changes silently.

USAGE: Show AI attribution and source links.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 089 — Define and persist RAID model

```text
REQUIREMENTS:
  TRACEABILITY: BR-090..092
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create Risk/Assumption/Issue/Dependency models, trace links, persistence, API basics.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI suggestions yet.

USAGE: Structured severity/status/owner/mitigation fields; links resolvable.

BEHAVIOR: Domain/SQL/API tests. STOP.
```

## Prompt 090 — Build RAID workbench

```text
REQUIREMENTS:
  TRACEABILITY: MVP-007; BR-090..092
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create engagement RAID list/editor/filter UI.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI suggestions.

USAGE: Use design-system tables/forms/status patterns.

BEHAVIOR: Component tests. STOP.
```

## Prompt 091 — Implement AI RAID suggestions

```text
REQUIREMENTS:
  TRACEABILITY: BR-091; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Generate candidate RAID items from approved context and prior authorized knowledge.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not insert automatically.

USAGE: Persist provenance and source citations when historical material contributes.

BEHAVIOR: Eval/fake-provider tests. STOP.
```

## Prompt 092 — Build RAID AI review queue

```text
REQUIREMENTS:
  TRACEABILITY: BR-091; UX-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create accept/edit/reject review experience for suggested RAID items.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not auto-approve.

USAGE: Use standardized AI review patterns.

BEHAVIOR: Component tests. STOP.
```

## Prompt 093 — Define estimation model and work breakdown

```text
REQUIREMENTS:
  TRACEABILITY: BR-080..083
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create estimation template/work-breakdown/domain models and rationale/driver structures.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add historical comparables or AI estimation yet.

USAGE: Preserve assumptions/factors for any assisted result.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 094 — Persist estimation data and build API

```text
REQUIREMENTS:
  TRACEABILITY: BR-080..083
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add persistence, migration, repository, application service, and endpoints for estimate structures.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add UI or historical comparison.

USAGE: Version/audit significant estimate changes.

BEHAVIOR: SQL/API tests. STOP.
```

## Prompt 095 — Build estimation workbench UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-080..083
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create estimate hierarchy editor and rationale/driver UI.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not add AI estimate generation unless explicitly required by later prompt.

USAGE: Keyboard-efficient, autosave drafts, explicit approval.

BEHAVIOR: Component tests. STOP.
```

# Phase 8 — AI kernel, provider boundary, provenance and evaluations

## Prompt 096 — Create AI application interfaces

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-010; PR-007
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create IAiCompletionService, IEmbeddingService, IKnowledgeRetriever, IDocumentGenerationService and supporting provider-neutral request/result contracts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not reference OpenAI or Semantic Kernel SDK types outside AI/infrastructure boundary.

USAGE: Contracts include cancellation, correlation, structured-output metadata, and typed failures.

BEHAVIOR: Architecture/unit tests. STOP.
```

## Prompt 097 — Create Semantic Kernel composition root

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-001..008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create Semantic Kernel setup inside AI/infrastructure boundary.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement product prompts or business workflows.

USAGE: Model/provider profiles from configuration; plugins explicitly registered; domain code unaware of Kernel types.

BEHAVIOR: Configuration/integration tests with fake connector. STOP.
```

## Prompt 098 — Create OpenAI adapter

```text
REQUIREMENTS:
  TRACEABILITY: TR-OAI-001..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement OpenAI provider adapter behind internal AI interfaces.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not expose credentials/client objects to Angular or domain/application layers.

USAGE: Handle timeout/rate limit/refusal/outage/invalid output with typed failures; bounded retries only where safe.

BEHAVIOR: Contract tests using mock/fake HTTP/provider boundary. STOP.
```

## Prompt 099 — Create AI execution audit/provenance model

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-009; GOV-002; OPS-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create durable AI execution/generation record capturing user, engagement, operation, prompt/version, model/provider, source IDs, citations, tool calls, output artifact, review disposition, telemetry, timestamp.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not store raw sensitive prompts/outputs indiscriminately.

USAGE: Separate metadata/provenance from content storage; support correlation.

BEHAVIOR: Persistence/unit tests. STOP.
```

## Prompt 100 — Create prompt asset/versioning infrastructure

```text
REQUIREMENTS:
  TRACEABILITY: GOV-005; §27 SCRUB generator; TR-AI-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create source-controlled prompt-template asset loader/version model and promotion statuses.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not hard-code prompts inside business services.

USAGE: Prompt assets are versioned, reviewable, testable, and environment-promotable.

BEHAVIOR: Unit tests for version resolution and missing/invalid assets. STOP.
```

## Prompt 101 — Create structured-output validation pipeline

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-003; NFR-008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable schema validation/repair-or-fail pipeline for AI structured outputs.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not parse arbitrary prose into business actions.

USAGE: Validation failure is explicit; bounded repair only if policy allows; no mutation before validation.

BEHAVIOR: Unit tests with malformed/adversarial outputs. STOP.
```

## Prompt 102 — Create AI authorization/tool execution guard

```text
REQUIREMENTS:
  TRACEABILITY: TR-AI-007..008; SEC-002..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create wrapper enforcing user/engagement/operation authorization before Semantic Kernel function/plugin execution.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not trust model-selected function arguments without validation.

USAGE: Every tool call revalidates authorization and structured inputs.

BEHAVIOR: Security unit tests. STOP.
```

## Prompt 103 — Create AI telemetry instrumentation

```text
REQUIREMENTS:
  TRACEABILITY: OPS-001..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Instrument AI operations for model/profile, tokens/cost where available, latency, tool calls, retries, structured-output failures, citations, and disposition.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not log raw confidential prompt/document content by default.

USAGE: Correlate browser→API→SK→provider→retrieval→artifact.

BEHAVIOR: Telemetry tests with in-memory exporter. STOP.
```

## Prompt 104 — Create AI evaluation test harness

```text
REQUIREMENTS:
  TRACEABILITY: TEST-003; OPS-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable evaluation-case format and runner for prompt assets.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not require live OpenAI in unit CI.

USAGE: Support deterministic property checks and optional provider-backed evaluation tier.

BEHAVIOR: Run sample eval suite. STOP.
```

## Prompt 105 — Add AI resilience smoke tests

```text
REQUIREMENTS:
  TRACEABILITY: TR-OAI-005..006; NFR-002..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create tests for timeout, rate limit, refusal, invalid output, provider outage, and cancellation.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not retry non-idempotent product mutations.

USAGE: Prove failures do not corrupt approved engagement data.

BEHAVIOR: Run resilience suite. STOP.
```

# Phase 9 — RAG ingestion, retrieval, citations and knowledge governance

## Prompt 106 — Define knowledge source and chunk models

```text
REQUIREMENTS:
  TRACEABILITY: BR-120; TR-RAG-001..004; SEC-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider-neutral source artifact, ingestion job, chunk metadata, citation reference, and knowledge lifecycle models.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not ingest files yet.

USAGE: Retain artifact/engagement/classification/type/section/version/date/approval/tags/confidentiality metadata.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 107 — Create source registration API

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001..002; SEC-002..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement authorized source registration and metadata validation.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not extract/chunk/embed yet.

USAGE: Only authorized sources can enter pipeline; reusable eligibility explicit.

BEHAVIOR: API/security tests. STOP.
```

## Prompt 108 — Create content extraction provider seam

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001; PR-007
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create provider abstraction for extracting text/structure from supported source artifacts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not embed or index.

USAGE: Treat source content as untrusted data; preserve section/page locators when possible.

BEHAVIOR: Contract tests. STOP.
```

## Prompt 109 — Create deterministic chunking pipeline

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001..002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement chunking and metadata enrichment from extracted source content.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not invoke OpenAI for instructions contained inside source documents.

USAGE: Stable chunk identifiers and source locators required.

BEHAVIOR: Unit tests across representative documents. STOP.
```

## Prompt 110 — Create embedding provider integration

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001; TR-OAI-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement IEmbeddingService provider adapter and batching policy.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not index unauthorized chunks or expose provider SDK types.

USAGE: Embedding model configured by profile; bounded retries/cancellation.

BEHAVIOR: Contract tests. STOP.
```

## Prompt 111 — Create search index writer adapter

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001..003; approved search ADR
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement index writer behind provider-neutral abstraction.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create retrieval query UI.

USAGE: Persist all authorization/filter metadata alongside vector/text representation.

BEHAVIOR: Integration/contract tests. STOP.
```

## Prompt 112 — Implement ingestion workflow state machine

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001; NFR-002..004; README long-lived workflows
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement persisted ingestion workflow stages: register→extract→classify→chunk→enrich→embed→index→validate→available.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not run as a hidden chain of synchronous HTTP calls.

USAGE: Use approved durable workflow host, outbox/inbox/idempotency, resumable stage state.

BEHAVIOR: Workflow failure/retry/resume tests. STOP.
```

## Prompt 113 — Expose ingestion status API

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-001; NFR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Expose create/status/cancel/retry operations for ingestion workflows.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not expose internal queue details or secrets.

USAGE: POST returns accepted/status resource for long work.

BEHAVIOR: API tests. STOP.
```

## Prompt 114 — Implement confidentiality-aware retrieval

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-003; SEC-003..004..006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement IKnowledgeRetriever hybrid/semantic query with mandatory authorization metadata filters.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not retrieve broad organization corpus then filter only in application memory.

USAGE: Filtering must prevent cross-engagement/confidentiality leakage before/during retrieval.

BEHAVIOR: Security/integration tests for forbidden cross-scope retrieval. STOP.
```

## Prompt 115 — Implement citation resolution

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-004..005; TEST-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement stable citation IDs that resolve to authorized source artifact/section/chunk locators.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not expose source content the user cannot access.

USAGE: Citation resolution rechecks authorization.

BEHAVIOR: Citation resolution/security tests. STOP.
```

## Prompt 116 — Implement explicit source selection

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Allow generation requests to nominate specific authorized engagements/artifacts as retrieval context.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not allow source IDs to bypass authorization filters.

USAGE: Selection is recorded in generation provenance.

BEHAVIOR: API/security tests. STOP.
```

## Prompt 117 — Implement knowledge lifecycle governance

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-007; GOV-003..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement promote/review/approve/deprecate/archive lifecycle for reusable knowledge.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not make client-confidential content organization-wide without explicit authorized promotion.

USAGE: Deprecated content excluded from automatic retrieval/recommendation.

BEHAVIOR: Domain/API/security tests. STOP.
```

## Prompt 118 — Build Knowledge ingestion UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-120; TR-RAG-001; UX-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create source registration, ingestion progress, failure/retry, and lifecycle UI.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create a generic file dump.

USAGE: Show classification, reusable eligibility, workflow state, and provenance.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 119 — Build citation chip and source preview integration

```text
REQUIREMENTS:
  TRACEABILITY: TR-RAG-004..005; DS-013
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Wire citation chip to authorized source preview panel in real feature data.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not show unfiltered raw artifact content.

USAGE: Preview resolves stable citation and highlights source section when possible.

BEHAVIOR: Component/security flow tests. STOP.
```

# Phase 10 — Document generation and durable consulting-package workflows

## Prompt 120 — Define generated document and section models

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..105; TR-DATA-002..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create document, section, section-version, approval/lock state, generation provenance reference, and artifact metadata models.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not generate text or export files.

USAGE: Approved versions immutable; regeneration isolated to target section; content metadata separated from binary artifact storage.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 121 — Persist document metadata and sections

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..105; TR-DATA-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add EF mappings/migration/repository for document/section/version state.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not store large binary exports in core relational rows.

USAGE: Concurrency/version rules prevent overwriting approved content.

BEHAVIOR: SQL integration tests. STOP.
```

## Prompt 122 — Define reusable document template/section models

```text
REQUIREMENTS:
  TRACEABILITY: BR-102; GOV-003..005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create reusable document template and section composition models.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not author every template or generate content yet.

USAGE: Versioned, lifecycle-governed sections; composition explicit rather than monolithic prompt.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 123 — Create section context assembler

```text
REQUIREMENTS:
  TRACEABILITY: BR-104; PR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create deterministic context assembler for one document section.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not send entire engagement or corpus by default.

USAGE: Include only relevant approved facts, requirements, patterns, ADRs, RAID, estimates, templates, explicitly selected sources, and citation-ready retrieval.

BEHAVIOR: Unit tests for minimality and authorization. STOP.
```

## Prompt 124 — Create section generation prompt assets

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..104; GOV-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create versioned SCRUB prompt assets for initial MVP document-section types.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement orchestration or embed prompts in code.

USAGE: Separate system policy, task template, schema, and reusable context instructions.

BEHAVIOR: Prompt lint/eval cases. STOP.
```

## Prompt 125 — Implement single-section generation service

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..104; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement generation for exactly one document section through Semantic Kernel.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not generate a whole consulting package in one model call.

USAGE: Persist generation record/provenance; validate output; citations retained; approved unrelated sections untouched.

BEHAVIOR: Fake-provider/integration/eval tests. STOP.
```

## Prompt 126 — Implement section regenerate/edit/approve/lock API

```text
REQUIREMENTS:
  TRACEABILITY: BR-103
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add section lifecycle operations.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not allow regeneration to overwrite locked/approved content without creating a new draft/version.

USAGE: Human approval explicit and attributable.

BEHAVIOR: API/domain tests. STOP.
```

## Prompt 127 — Build document section editor/review UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..104; UX-003..005; DS-013..014
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create split-view section editor with generate/regenerate, citations, version compare, accept/reject/edit/approve/lock.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not present AI draft as approved.

USAGE: Autosave drafts but preserve explicit approval/publish.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 128 — Define consulting package workflow model

```text
REQUIREMENTS:
  TRACEABILITY: BR-100..105; NFR-002..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create persisted package-generation workflow/state machine and requested-artifact plan.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not start consumers or AI calls.

USAGE: Support stage state, retries, partial completion, human review gates, cancellation, correlation, idempotency.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 129 — Persist package workflow and outbox atomically

```text
REQUIREMENTS:
  TRACEABILITY: README outbox rule; BR-100..105
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement package-start transaction that persists workflow/request state and required integration event in the same SQL transaction.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not publish directly from the HTTP request.

USAGE: Return typed result/status resource identifier.

BEHAVIOR: SQL integration test proves state+outbox atomicity. STOP.
```

## Prompt 130 — Add POST package-generation endpoint

```text
REQUIREMENTS:
  TRACEABILITY: README long-lived workflow shape; BR-100
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add endpoint to validate/start package workflow and return 202 Accepted with status URI.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not wait for model calls or message completion.

USAGE: Authorization, idempotency key, correlation, and requested artifact validation required.

BEHAVIOR: API tests. STOP.
```

## Prompt 131 — Create package workflow consumer

```text
REQUIREMENTS:
  TRACEABILITY: Approved workflow ADR; BR-100..105
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement first workflow consumer/processor that advances persisted package stages.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not hide state in memory or rely on caller connection.

USAGE: Use inbox/idempotency where durable side effects matter; emit next-stage events through outbox if required.

BEHAVIOR: Duplicate/retry/resume tests. STOP.
```

## Prompt 132 — Fan out independent document section work

```text
REQUIREMENTS:
  TRACEABILITY: BR-101..104; README async rules
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add workflow step that fans out independent artifact/section generation jobs where parallelism is safe.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not parallelize sections with explicit dependencies.

USAGE: Persist child work IDs and aggregate completion deterministically.

BEHAVIOR: Workflow concurrency tests. STOP.
```

## Prompt 133 — Implement package workflow status API

```text
REQUIREMENTS:
  TRACEABILITY: BR-100; NFR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Expose workflow stage, progress, generated artifact statuses, failures, review waits, and retry/cancel eligibility.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not leak queue internals.

USAGE: Status is durable and queryable over HTTP.

BEHAVIOR: API tests. STOP.
```

## Prompt 134 — Build generation progress UI

```text
REQUIREMENTS:
  TRACEABILITY: MVP-008; DS-013; UX-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create Documents/package progress UI driven by workflow status.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not fake progress based on timers alone.

USAGE: Show persisted stage progress, failures, retry/cancel, artifacts ready for review.

BEHAVIOR: Component tests. STOP.
```

## Prompt 135 — Implement Markdown export

```text
REQUIREMENTS:
  TRACEABILITY: MVP-011; SEC-008; TR-DATA-002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create Markdown export for approved document/package content.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not export unauthorized or unapproved content unless explicitly marked draft export by requirement/policy.

USAGE: Validate access to every included artifact; preserve citations/provenance references where appropriate.

BEHAVIOR: Export/security tests. STOP.
```

# Phase 11 — SCRUB prompt generator and implementation bootstrap

## Prompt 136 — Define SCRUB prompt artifact model

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; GOV-005; BR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create structured SCRUB prompt artifact/version model with Scope, Constraints, Restrictions, Usage, Behavior, requirement links, architecture-decision links, verification and status.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not generate prompts yet.

USAGE: Prompt traceability must resolve backward to ADR/requirement/discovery evidence.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 137 — Create SCRUB prompt generation context assembler

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; BR-004; PR-004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Assemble approved requirements, ADRs, patterns, constraints, repository conventions, and implementation target context for one implementation seam.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not include unrelated engagement material.

USAGE: Only approved architecture decisions become hard implementation constraints.

BEHAVIOR: Unit tests for traceability/minimal context. STOP.
```

## Prompt 138 — Create SCRUB prompt generation template

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; GOV-005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create versioned prompt asset instructing AI to emit one microstep implementation prompt at a time.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not generate whole-project mega-prompts.

USAGE: Output schema must require requirement IDs/links, S/C/R/U/B, verification, adjacent-work prohibitions, and STOP.

BEHAVIOR: Prompt eval cases. STOP.
```

## Prompt 139 — Implement SCRUB prompt generation service

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; TR-AI-001..010
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Generate candidate implementation micro-prompts from approved requirements/ADRs.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not publish generated prompts as approved automatically.

USAGE: Structured output validation and AI provenance required.

BEHAVIOR: Fake-provider/eval tests. STOP.
```

## Prompt 140 — Build SCRUB prompt review/editor UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; UX-003..004; DS-013
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create prompt review/edit/approve/version UI with traceability inspector.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not allow AI-generated prompts to masquerade as approved.

USAGE: Show linked requirement/ADR evidence and diffs between versions.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 141 — Implement prompt export to repository-ready Markdown

```text
REQUIREMENTS:
  TRACEABILITY: BR-140; MVP-008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Export approved SCRUB prompt sets as deterministic Markdown.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not write directly to external repositories yet.

USAGE: Preserve ordering, IDs, traceability links, and version metadata.

BEHAVIOR: Golden-file tests. STOP.
```

## Prompt 142 — Define implementation bootstrap package model

```text
REQUIREMENTS:
  TRACEABILITY: BR-101; north-star journey
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create model for README/repository bootstrap assets produced from approved engagement artifacts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create GitHub repositories or commits.

USAGE: Bootstrap content is traceable to approved source decisions.

BEHAVIOR: Domain tests. STOP.
```

## Prompt 143 — Implement README/bootstrap generation

```text
REQUIREMENTS:
  TRACEABILITY: BR-101; MVP-008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Generate README/repository-bootstrap draft sections using approved architecture and SCRUB prompts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not infer unapproved hosting/service boundaries.

USAGE: Section-level generation, provenance, human approval.

BEHAVIOR: Eval and generation tests. STOP.
```

# Phase 12 — Global search, review, audit, quality and production readiness

## Prompt 144 — Implement global structured search API

```text
REQUIREMENTS:
  TRACEABILITY: BR-130; SEC-002..003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create search abstraction/query across authorized engagements, requirements, ADRs, patterns, findings, RAID, templates, deliverables, prompts, and historical artifacts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not bypass domain ownership by querying another service database directly.

USAGE: Use approved HTTP/query or search-index projections; authorization filters mandatory.

BEHAVIOR: Integration/security tests. STOP.
```

## Prompt 145 — Implement architecture-centric knowledge queries

```text
REQUIREMENTS:
  TRACEABILITY: BR-131; TR-SEARCH-001; TR-RAG-003..005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add hybrid retrieval query path for architecture-centric questions with citations.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not return uncited historical claims from restricted material.

USAGE: Results distinguish structured matches from semantic knowledge results.

BEHAVIOR: Retrieval/citation/security tests. STOP.
```

## Prompt 146 — Build global search UI

```text
REQUIREMENTS:
  TRACEABILITY: UX-001; BR-130..131
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Implement global search and result grouping in workbench shell.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not create a separate ungoverned search UI system.

USAGE: Keyboard access, command-palette integration, citation/source preview for knowledge hits.

BEHAVIOR: Component/a11y tests. STOP.
```

## Prompt 147 — Implement audit/change history persistence

```text
REQUIREMENTS:
  TRACEABILITY: GOV-001..002; MVP-012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create append-only significant-change records and attribution model for governed artifacts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not log secrets or indiscriminate full-content snapshots.

USAGE: Capture actor, time, operation, entity/version, source (human/AI), correlation, safe change metadata.

BEHAVIOR: Persistence/unit tests. STOP.
```

## Prompt 148 — Build activity/history UI

```text
REQUIREMENTS:
  TRACEABILITY: BR-023; GOV-001..002
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create engagement activity/history view using audit data.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not expose sensitive internals.

USAGE: Filter by artifact/action/actor/source and link to resolvable versions.

BEHAVIOR: Component tests. STOP.
```

## Prompt 149 — Implement AI acceptance/rejection metrics

```text
REQUIREMENTS:
  TRACEABILITY: OPS-005; KPI-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Aggregate AI suggestion dispositions and regeneration/edit metrics.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not infer quality solely from acceptance rate.

USAGE: Metrics exclude sensitive prompt/body logging and retain prompt/version dimensions.

BEHAVIOR: Unit/query tests. STOP.
```

## Prompt 150 — Add end-to-end trace verification

```text
REQUIREMENTS:
  TRACEABILITY: OPS-001..004
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create integration test proving one representative operation traces Angular/API/service/SQL and one AI operation traces SK/provider/retrieval/artifact; async test includes outbox/bus/inbox path.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not rely on manual log inspection only.

USAGE: Correlation identifiers must be consistent and sensitive content absent.

BEHAVIOR: Run trace test with local telemetry collector. STOP.
```

## Prompt 151 — Add authorization isolation test suite

```text
REQUIREMENTS:
  TRACEABILITY: SEC-001..008; TR-AI-008; TR-RAG-003
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create cross-role/cross-engagement tests for API, AI tools, retrieval, citation preview, and export.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not mock away the authorization boundary under test.

USAGE: Prove forbidden engagement content cannot leak through direct API or AI/retrieval paths.

BEHAVIOR: Run security suite. STOP.
```

## Prompt 152 — Add prompt-injection defense tests

```text
REQUIREMENTS:
  TRACEABILITY: SEC-007; TR-AI-007..008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create adversarial source documents that attempt to override system/tool policies and verify they remain inert data.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not weaken system policy to satisfy document instructions.

USAGE: Tool authorization and retrieval boundaries remain authoritative.

BEHAVIOR: Run security/eval tests. STOP.
```

## Prompt 153 — Add full design-system adoption scan

```text
REQUIREMENTS:
  TRACEABILITY: KPI-007; DS-004..005
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create lint/test/report detecting repeated feature-level Tailwind/CSS recipes and shell duplication.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not rewrite feature UI automatically in this prompt.

USAGE: Flag recurring patterns as design-system defects.

BEHAVIOR: Run scan and report violations. STOP.
```

## Prompt 154 — Add accessibility CI checks

```text
REQUIREMENTS:
  TRACEABILITY: NFR-005; TEST-007
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add automated accessibility checks for design system and critical workbench flows.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not claim automation replaces manual keyboard/screen-reader review.

USAGE: WCAG 2.2 AA target; include focus, labels, errors, announcements, contrast where testable.

BEHAVIOR: Run CI-local a11y suite. STOP.
```

## Prompt 155 — Add visual regression CI checks

```text
REQUIREMENTS:
  TRACEABILITY: DS-012; TEST-006
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Add visual regression coverage for critical design-system components/layouts.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not baseline known broken states without documenting exceptions.

USAGE: Cover light/dark and key responsive widths.

BEHAVIOR: Run visual suite. STOP.
```

## Prompt 156 — Add critical MVP end-to-end journey

```text
REQUIREMENTS:
  TRACEABILITY: MVP-001..012; north-star journey
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Create one end-to-end test from engagement creation through discovery, approved requirement, pattern selection, ADR, RAID, document section generation/review, citation inspection, and Markdown export.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not bypass APIs by inserting database fixtures for steps whose behavior is under test, except controlled seed/reference data.

USAGE: AI provider may be deterministic fake; workflow durability and review gates remain real application behavior.

BEHAVIOR: Run E2E test and report trace. STOP.
```

## Prompt 157 — Perform requirement-to-implementation coverage audit

```text
REQUIREMENTS:
  TRACEABILITY: All requirements; MVP-001..012
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Produce a read-only coverage matrix mapping implemented seams/tests to canonical requirements and identifying gaps.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not implement missing items in this prompt.

USAGE: Distinguish MVP-required, post-MVP, deliberately deferred, and unimplemented.

BEHAVIOR: Report matrix and clean git status. STOP.
```

## Prompt 158 — Perform architecture conformance audit

```text
REQUIREMENTS:
  TRACEABILITY: README architecture principles; §36 guardrails
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Run architecture tests plus manual review for domain ownership, HTTP vs Service Bus, outbox/inbox, provider boundaries, Angular AI isolation, design-system use, and versioning.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not fix violations in this prompt.

USAGE: Every violation must cite the governing ADR/requirement/rule.

BEHAVIOR: Report violations by severity. STOP.
```

## Prompt 159 — Perform production-readiness review

```text
REQUIREMENTS:
  TRACEABILITY: NFR-001..008; OPS-001..005; TEST-001..007; SEC-001..008
  REQUIREMENT LINKS: [Canonical Project Lake Shore Drive requirements](../requirements/requirements.md)
  REQUIREMENT INTENT: Implement only the linked requirement intent needed for this atomic step. Preserve structured data, human approval, traceability, authorization, design-system ownership, provider boundaries, and durable workflow rules that apply to this seam.
  SOURCE OF TRUTH: Read the linked canonical requirements and applicable CLAUDE.md/.claude rules before coding. If this prompt conflicts with the canonical requirements or an approved ADR, STOP and report the drift.

SCOPE: Conduct a read-only production-readiness review of reliability, security, data protection, observability, migration, backup/recovery assumptions, AI failure behavior, DLQ operations, and runbooks.

CONSTRAINT: Make the smallest coherent change that completes this seam. Keep the repository buildable/testable and preserve approved domain ownership and dependency direction.

RESTRICTION: Do not deploy or change infrastructure.

USAGE: Separate missing requirements from implementation gaps and open architecture decisions.

BEHAVIOR: Return go/no-go findings and follow-up microsteps only. STOP.
```

# Execution discipline

Run these prompts in order unless an approved ADR explicitly changes the dependency sequence. A prompt may be skipped only when the repository inventory proves its seam already exists and its verification criteria pass unchanged. Never combine several prompts simply because they touch the same feature. The intent is to keep failures local, architecture decisions explicit, and every commit reviewable.

For feature work, prefer a vertical sequence that introduces domain model → persistence → application behavior → transport contract → API → typed Angular client → page/UI → AI augmentation → review queue, rather than generating an entire feature stack in one prompt. For asynchronous work, introduce envelope → outbox/inbox persistence → publisher/serializer → relay/consumer substrate → business workflow state → producer transaction → consumer stage → HTTP status resource → UI progress.

# MVP completion boundary

Prompts through 159 intentionally cover the full MVP loop plus production-readiness verification. Post-MVP capabilities from the requirements (automatic diagram rendering, Azure cost estimation, CRM/PSA integration, repository creation, code-to-ADR conformance, documentation drift detection, etc.) should receive a separate continuation library after the MVP coverage audit rather than being smuggled into these prompts.
