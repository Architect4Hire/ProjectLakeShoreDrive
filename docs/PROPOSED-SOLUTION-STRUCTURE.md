# Proposed Solution Structure

This is structural guidance, not authorization to scaffold every proposed bounded domain immediately.

```text
/
├── README.md
├── CLAUDE.md
├── .claude/
├── docs/
│   ├── README.md
│   ├── PROPOSED-SOLUTION-STRUCTURE.md
│   ├── design/
│   │   ├── adr/
│   │   ├── high-level-design.md
│   │   ├── bounded-context-catalog.md
│   │   ├── domain-model.md
│   │   ├── integration-design.md
│   │   ├── integration-event-catalog.md
│   │   ├── long-lived-workflow-design.md
│   │   ├── ai-orchestration-design.md
│   │   ├── rag-knowledge-design.md
│   │   ├── document-generation-design.md
│   │   ├── angular-design-system.md
│   │   ├── security-design.md
│   │   ├── observability-design.md
│   │   ├── requirements-traceability.md
│   │   ├── service-implementation-template.md
│   │   ├── why-this-architecture.md
│   │   ├── product-completeness.md
│   │   ├── ongoing-architecture-plan.md
│   │   └── project-story.md
│   └── prompts/
│       └── project-lsd-scrub-microprompts.md
├── src/
│   ├── ProjectLakeShoreDrive.AppHost/
│   ├── ProjectLakeShoreDrive.ServiceDefaults/
│   ├── ProjectLakeShoreDrive.Gateway/
│   ├── ProjectLakeShoreDrive.Contracts/
│   ├── ProjectLakeShoreDrive.Shared/
│   ├── services/
│   │   ├── ProjectLakeShoreDrive.<Capability>/
│   │   ├── ProjectLakeShoreDrive.<Capability>.Core/
│   │   └── ProjectLakeShoreDrive.<Capability>.Functions/
│   ├── ai/
│   │   ├── ProjectLakeShoreDrive.AI.Abstractions/
│   │   ├── ProjectLakeShoreDrive.AI.SemanticKernel/
│   │   └── prompts/
│   └── web/
│       ├── design-system/
│       │   ├── tokens/
│       │   ├── foundations/
│       │   ├── primitives/
│       │   ├── components/
│       │   ├── patterns/
│       │   ├── recipes/
│       │   ├── layouts/
│       │   └── documentation/
│       └── src/app/
│           ├── core/
│           ├── shell/
│           └── features/
└── tests/
    ├── unit/
    ├── integration/
    ├── architecture/
    ├── ai-evals/
    └── web/
```

## Synchronous request path

```text
Angular 22
  → API Edge / Gateway
    → Capability Controller
      → Facade/Application Use Case
        → Business/Domain
          → Data
            → Repository
              → service-owned SQL
```

## Durable event path

```text
Domain mutation
  → local SQL transaction
      - authoritative state
      - OutboxMessage
  → Outbox Relay
  → Azure Service Bus
  → Consumer
  → Inbox/idempotency + local durable side effect
```

## Long-lived generation path

```text
Angular
  → POST operation
  → persist Workflow/Generation + Outbox
  → 202 + operation URI
  → Service Bus
  → workflow consumer
  → Semantic Kernel / Retrieval / Model
  → persist result + provenance
  → operation status
```
