# ADR-0011 — Identity, Session, and Authorization Boundaries

**Status:** Proposed

## Context

Five roles (Principal Architect, Consulting Contributor, Reviewer, Knowledge Curator, Administrator — BR-010..014) must be authorized consistently across the browser-facing API edge (ADR-0010), the bounded domains (ADR-0009), and AI-accessible functions (TR-AI-008). Role alone is insufficient: Consulting Contributor authority is scoped to "assigned permissions" per engagement (BR-011), and SEC-003 requires engagement isolation. Without an explicit boundary, authorization logic risks being duplicated or diverging between HTTP endpoints and Semantic Kernel plugins.

## Decision

### Authentication / session transport

- The API edge (ADR-0010) is the sole authentication boundary. It is provider-agnostic: no external identity provider is named by this decision.
- Browser ↔ Edge: the edge issues an **HttpOnly, Secure, SameSite=Lax session cookie** scoped to the edge's own origin. No session token is placed anywhere Angular's JavaScript can read (no localStorage/sessionStorage), consistent with SEC-005.
- Edge ↔ Domain APIs: on each forwarded request, the edge attaches a **short-lived, server-signed internal token** (claims: user ID, role, correlation ID) to the downstream call. Domain APIs trust only this internal token, never a client-supplied claim, and re-derive engagement-scope authorization themselves.

### Authorization policy structure

Two-dimensional, resource-based authorization — role is necessary but not sufficient:

- **Role policies** — coarse gate: is this operation in scope for this role at all.
- **Engagement-scope resource policies** — fine gate: is this user authorized for this specific engagement (owner/assigned architect, assigned contributor, assigned reviewer), evaluated against Engagement Context's own membership/ownership data (ADR-0009 — no other context queries it directly).

### Policy matrix

| Operation | Principal Architect | Consulting Contributor | Reviewer | Knowledge Curator | Administrator |
|---|---|---|---|---|---|
| Create engagement (BR-010) | Allow | Deny | Deny | Deny | Deny |
| Author discovery/requirements/RAID/estimate drafts (BR-011) | Allow | Allow — assigned engagements only | Deny (comment only) | Deny | Deny |
| Select architecture patterns / draft ADR | Allow | Allow — assigned engagements, draft only | Deny (comment only) | Deny | Deny |
| Approve requirement / accept ADR / approve estimate — final (BR-003) | Allow | Deny | Deny | Deny | Deny |
| Review-gate approve/reject/request-revision on proposed decisions/deliverables (BR-012) | Allow | Deny | Allow — assigned engagements | Deny | Deny |
| Generate/regenerate/edit AI document sections | Allow | Allow — assigned engagements | Deny (comment/review only) | Deny | Deny |
| Approve/lock/publish document (BR-105) | Allow | Deny | Deny | Deny | Deny |
| Promote/deprecate/classify reusable knowledge, templates, patterns, prompts (BR-013) | Deny | Deny | Deny | Allow | Deny |
| Manage users/roles/config/model-provider settings/retention (BR-014) | Deny | Deny | Deny | Deny | Allow |
| Invoke AI/Semantic Kernel plugin actions | Same policy as the equivalent HTTP action above | same | same | same | same |

Reviewer approve/reject/request-revision (BR-012) is a **review-gate** action, distinct from the Principal Architect's **final** approval authority over requirements/estimates/ADRs/deliverables (BR-003). Both exist as separately named policies.

### AI function authorization (TR-AI-008)

Semantic Kernel plugin functions call into the same Facade/Business authorization checks as the corresponding HTTP endpoint — never a parallel or looser check. A plugin has no privilege an equivalent HTTP call would not have.

## Consequences

- Angular never holds a readable session token; only the edge terminates authentication.
- Domain APIs authorize every request against role + engagement scope, never trusting client-supplied engagement claims.
- AI-accessible functions cannot bypass domain authorization, satisfying TR-AI-008 and the AI approval boundary in `docs/design/security-design.md`.
- The concrete external identity provider, token issuance mechanism, and identity data model are not decided here and remain open.
- No identity code, middleware, or scaffolding is introduced by this ADR.

## Related requirements

BR-010, BR-011, BR-012, BR-013, BR-014, SEC-001, SEC-002, SEC-003, SEC-004, SEC-005, SEC-006, SEC-007, SEC-008, TR-AI-008.

## Related ADRs

Builds on ADR-0009 (bounded-domain catalog, for engagement-scope data ownership) and ADR-0010 (browser-facing API edge, for authentication termination and correlation).
