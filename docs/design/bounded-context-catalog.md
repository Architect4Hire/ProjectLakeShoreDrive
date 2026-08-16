# Project Lake Shore Drive — Proposed Bounded Context Catalog

**Status:** Proposed architecture boundary model.

The product requirements define business modules but do not require one deployable service per module. This catalog groups capabilities by ownership, transactional cohesion, security boundary and scaling behavior.

## 1. Engagement Context

**Owns**

- Engagement
- DiscoverySession / Question / Answer
- Requirement
- EngagementPattern
- ADR
- Finding
- RaidItem
- Estimate
- Deliverable metadata
- Approval
- traceability relationships

**Why together**

These concepts form the tightly connected consulting engagement source of truth. Splitting them too early would create chatty synchronous calls and distributed transactions around ordinary architect workflows.

**Publishes facts such as**

- EngagementPhaseChanged
- RequirementApproved
- RequirementChanged
- AdrAccepted
- RaidItemChanged
- EngagementClosed

## 2. Knowledge Context

**Owns**

- reusable templates;
- architecture patterns;
- prompt templates;
- source artifact registration;
- knowledge classification;
- ingestion records;
- chunk/index metadata;
- reuse governance;
- knowledge lifecycle.

**Provides**

- HTTP queries for templates/patterns and explicit source selection;
- search/retrieval capability;
- asynchronous ingestion/reindex processing.

## 3. Document & Generation Context

**Owns**

- Document;
- DocumentSection;
- Generation;
- version comparison metadata;
- section locks and approvals;
- export jobs;
- package-generation workflows;
- artifact output metadata.

**Why separate**

Document generation has a different scaling and reliability profile from CRUD engagement work. It performs long-running AI/provider work and benefits from independent workflow processing.

## 4. Identity & Administration Context

**Owns**

- user/account identity integration;
- roles and authorization configuration;
- model/provider profiles;
- confidentiality/data-policy configuration;
- feature/application administration.

The final identity implementation and session transport require ADRs.

## 5. Search projections are not authoritative domains

Global search may maintain denormalized projections and vector/hybrid indexes. These are rebuildable read models, not sources of truth.

## Boundary rules

1. A context owns its database schema and migrations.
2. No context reads another context's tables.
3. Cross-context queries use explicit HTTP contracts or local projections.
4. Cross-context durable state propagation uses versioned integration events.
5. Redis keys are owned and namespaced by one context.
6. AI plugins call approved application capabilities; they never reach directly into foreign persistence.
7. A physical service split is justified by operational need, not by the existence of a folder/module.

## Initial deployment recommendation

For an MVP, keep the number of physical deployables smaller than the logical domain catalog where practical:

- API Edge / Gateway
- Engagement API
- Knowledge API
- Document/Generation API
- Workflow Functions/Workers
- Angular Web
- Aspire AppHost / ServiceDefaults

Identity/Administration may initially be co-hosted while retaining a code-level ownership boundary.
