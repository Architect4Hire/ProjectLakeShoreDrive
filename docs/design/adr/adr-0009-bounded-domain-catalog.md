# ADR-0009 — MVP Bounded-Domain Catalog

**Status:** Proposed

## Context

Product requirements define business capabilities (BR-020..023, BR-030..034, BR-040..044, BR-050..053, BR-060..063, BR-090..092, BR-100..105, BR-120) but do not require one deployable service per capability. Without an explicit catalog, implementation work risks inventing services ad hoc, one per noun, which recreates distributed transactions and chatty synchronous coupling across a single traceability chain (BR-004). ADR-0008 already establishes that each bounded domain owns its persistence; this ADR names the specific domains that rule applies to for the MVP.

## Decision

Adopt three bounded domains for the MVP, each owning its own relational database (per ADR-0008 — no cross-database access, no shared EF entities across domains):

- **Engagement Context** — owns `Engagement`, `DiscoverySession`, `DiscoveryQuestion`, `DiscoveryAnswer`, `Requirement`, `EngagementPattern` (selection + rationale), `Adr`, `RaidItem`, engagement-scoped `Approval`, engagement `AuditEvent`. Covers BR-020..023, BR-030..034, BR-040..044, BR-060..063, BR-090..092. These form one transactional/traceability aggregate and are not split into per-noun services.
- **Knowledge Context** — owns `ArchitecturePattern` (catalog), `Template`, `PromptTemplate`, `KnowledgeRecord`, `SourceArtifact`, ingestion/chunk metadata. Covers BR-050..052, BR-120. Cross-engagement, reuse-governed content with its own approval/deprecation lifecycle and confidentiality boundary, separate from any single engagement.
- **Document & Generation Context** — owns `Document`, `DocumentSection`, `Generation`, `Citation`. Covers BR-100..105. Distinct scaling/reliability profile (long-running, retryable, multi-call AI work) from ordinary engagement CRUD.

AI-assisted capabilities (BR-053 AI Pattern Recommendation, BR-062 AI ADR Drafting, BR-042 AI Requirement Extraction) are operations invoked from Engagement Context, not domains in their own right; they hold no persistence.

Interaction pattern:

- HTTP (synchronous) for immediate queries and bounded interactive AI: Engagement Context → Knowledge Context (catalog/template/prior-ADR lookups, AI extraction/recommendation context); Document & Generation Context → Engagement Context (grounded-generation context) and → Knowledge Context (templates, selected retrieval context).
- Service Bus (asynchronous) for cross-domain fact propagation (`RequirementApproved`, `AdrAccepted`, `RaidItemChanged`), knowledge ingestion (chunk/embed/index pipeline), and multi-document package generation workflows, per the outbox/inbox rules in ADR-0002.

Rejected alternatives: one microservice per BR-family noun (Discovery/Requirements/ADR/RAID services); folding Document & Generation into Engagement Context; folding Knowledge into Engagement Context; splitting the Pattern Catalog out of Knowledge Context; treating AI Pattern Recommendation/AI ADR Drafting as standalone data-owning domains.

## Consequences

- No context reads another context's database; cross-context reads use HTTP contracts or rebuildable projections (ADR-0008).
- Requirements, ADRs, and RAID remain inside Engagement Context, avoiding distributed transactions across the BR-004 traceability chain.
- Document/Generation work is isolated from engagement CRUD availability, so AI-provider latency and retries do not affect ordinary engagement operations.
- Knowledge reuse and governance (GOV-003) operate on a different lifecycle and confidentiality boundary (SEC-003) than any single engagement.
- Physical deployment topology (edge/gateway, hosting, number of deployables) is not decided by this ADR and remains open per the ongoing architecture plan.

## Related requirements

PR-001..007, BR-020..023, BR-030..034, BR-040..044, BR-050..053, BR-060..063, BR-090..092, BR-100..105, BR-120, TR-DATA-001, §36.

## Related ADRs

Complements ADR-0008 (database ownership per bounded domain) by naming the specific domain catalog; complements ADR-0001 (HTTP/Service Bus interaction semantics) and ADR-0002 (transactional outbox/inbox) by applying them to this catalog.
