# Project Lake Shore Drive — Product Completeness

**Purpose:** Track whether the MVP proves the complete consulting acceleration loop rather than isolated technical demos.

## MVP scorecard

| Capability | Complete when |
|---|---|
| Engagement | create/edit/phase/archive/search works with audit |
| Design system | MVP primitives, shell, tables, AI/citation/review states exist |
| Discovery | reusable questionnaires and sessions work |
| Requirements | structured matrix, approval and links work |
| Patterns | browse/select/rationale works |
| ADRs | create, draft with AI, approve/supersede works |
| RAID | structured log + suggestions works |
| Estimates | structured estimate with rationale works |
| AI boundary | Semantic Kernel + versioned prompts + provider abstraction works |
| RAG | governed ingest/retrieve/cite works |
| Documents | section generation, versioning, review, lock/approve works |
| Workflows | persisted async status + retry-safe generation works |
| Export | Markdown consulting package works |
| Traceability | requirement → ADR → prompt navigation works |
| Audit | human/AI creation and approval attribution works |
| Observability | HTTP + workflow + AI operation trace is diagnosable |

## Release gate

The MVP is not complete if it demonstrates AI generation without:

- authorization;
- provenance;
- review;
- citation governance where historical sources are used;
- retry-safe long-running behavior;
- structured engagement facts.

Likewise, it is not complete if it builds feature pages outside the local design system.

## Post-MVP

- Word/PDF generation;
- automated diagram rendering;
- Azure cost estimation;
- Well-Architected assessment scoring;
- CRM/PSA integrations;
- repository creation/commits;
- code-to-ADR conformance;
- documentation drift detection;
- client portal;
- advanced quality/evaluation pipelines.
