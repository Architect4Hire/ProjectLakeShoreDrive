# Project Lake Shore Drive — Documentation

This folder is the architecture and delivery documentation set for **Project Lake Shore Drive**, an AI Architecture Accelerator / Architect Workbench.

The documentation structure is modeled after Project Chicago, but it is intentionally expanded for Lake Shore Drive's core concerns: governed AI, RAG and citations, document generation, long-lived workflows, Angular 22, and the local design system.

## Start here

| Document | Purpose |
|---|---|
| [design/project-story.md](design/project-story.md) | Product and architecture narrative |
| [design/high-level-design.md](design/high-level-design.md) | Living target architecture |
| [design/domain-model.md](design/domain-model.md) | Core domain concepts, aggregates, lifecycles, invariants |
| [design/bounded-context-catalog.md](design/bounded-context-catalog.md) | Proposed domain/service boundaries and ownership |
| [design/why-this-architecture.md](design/why-this-architecture.md) | Architecture rationale and trade-offs |
| [design/requirements-traceability.md](design/requirements-traceability.md) | Requirement → design → decision → implementation traceability |
| [design/integration-design.md](design/integration-design.md) | HTTP vs Service Bus rules, outbox/inbox, contracts |
| [design/integration-event-catalog.md](design/integration-event-catalog.md) | Initial integration-event taxonomy |
| [design/long-lived-workflow-design.md](design/long-lived-workflow-design.md) | Durable generation/ingestion/export workflow model |
| [design/ai-orchestration-design.md](design/ai-orchestration-design.md) | Semantic Kernel and model-provider architecture |
| [design/rag-knowledge-design.md](design/rag-knowledge-design.md) | Retrieval, citations, knowledge governance, ingestion |
| [design/document-generation-design.md](design/document-generation-design.md) | Section-based document composition and approval |
| [design/angular-design-system.md](design/angular-design-system.md) | Angular 22 application and local design-system architecture |
| [design/security-design.md](design/security-design.md) | Authentication, authorization, confidentiality, AI safety |
| [design/observability-design.md](design/observability-design.md) | End-to-end OTel and AI/workflow observability |
| [design/service-implementation-template.md](design/service-implementation-template.md) | Required implementation shape for a bounded service |
| [design/product-completeness.md](design/product-completeness.md) | MVP completeness scorecard |
| [design/ongoing-architecture-plan.md](design/ongoing-architecture-plan.md) | Decision backlog and architecture evolution plan |
| [prompts/project-lsd-scrub-microprompts.md](prompts/project-lsd-scrub-microprompts.md) | Microstep implementation prompts |
| [PROPOSED-SOLUTION-STRUCTURE.md](PROPOSED-SOLUTION-STRUCTURE.md) | Target repository organization |

## ADRs

Initial ADRs are under [`design/adr/`](design/adr/).

They are intentionally **Proposed** until the implementation confirms the decision and its operational consequences.

## Documentation rules

1. Requirements are authoritative for product intent.
2. Accepted ADRs are authoritative for architecture decisions.
3. Design documents explain how accepted requirements and ADRs fit together.
4. Generated AI content is never promoted to architectural truth without human approval.
5. Accepted ADRs are not rewritten when a decision changes; a new ADR supersedes the old one.
6. Documentation should link to requirement IDs and ADR IDs wherever a decision is constrained by them.
