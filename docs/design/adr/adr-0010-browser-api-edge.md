# ADR-0010 — Single Browser-Facing API Edge (Gateway/BFF)

**Status:** Proposed

## Context

Angular is the only browser client and must reach three bounded domains (Engagement, Knowledge, Document & Generation — ADR-0009). Each domain independently exposing a public browser-facing surface would duplicate authentication/authorization enforcement, correlation propagation, and error handling across three origins, and would require Angular components to know internal service hostnames, which TR-WEB-007 and CLAUDE.md's Angular service/API boundary rules forbid.

## Decision

Angular talks to **one browser-facing API edge**; the edge is the only origin the browser trusts. No bounded-domain API (Engagement, Knowledge, Document & Generation) is exposed directly to the browser.

- **Browser routing:** all Angular HTTP traffic targets a single edge base address sourced from environment/configuration (TR-WEB-007). Angular components/services never construct URLs to individual domain APIs.
- **Service discovery expectations:** the edge resolves and routes to Engagement/Knowledge/Document & Generation Context APIs using Aspire service discovery/configuration locally (`.claude/rules/aspire.md`); the browser has no knowledge of, and does not participate in, that resolution.
- **Error/correlation policy:** the edge is the point that mints/propagates a correlation ID into every downstream domain call, normalizes error contracts back to the browser, and applies consistent timeout/retry policy per `.claude/rules/http-integration.md`, satisfying the Angular → API edge → ... traceability chain in CLAUDE.md's Observability section and OPS-001.
- **Ownership:** the edge terminates browser authentication and performs cross-domain authorization/engagement-isolation checks (SEC-001, SEC-002, SEC-003, SEC-004, SEC-008) before forwarding to a domain; it owns no business data of its own and is not a fourth bounded domain.

Not decided by this ADR: the edge's concrete technology (e.g., YARP, Azure API Management, a hand-rolled ASP.NET Core reverse proxy) and the authentication/session transport (cookies vs. bearer tokens, OIDC provider, etc.). Both remain open decisions in `docs/design/ongoing-architecture-plan.md`.

## Consequences

- Angular components/services depend on one typed client boundary and one base address, never on individual domain hostnames.
- Authentication, engagement-scoped authorization, and correlation are enforced once, not duplicated per domain.
- Every browser-initiated operation is traceable from Angular through the edge into the owning domain and back, satisfying OPS-001.
- The edge adds one additional network hop and one additional deployable to design, build, and operate.
- Choosing the edge's implementation technology and the auth transport are separate, still-open decisions and are not authorized by this ADR.

## Related requirements

PR-007, SEC-001, SEC-002, SEC-003, SEC-004, SEC-005, SEC-006, SEC-007, SEC-008, OPS-001, NFR-001, NFR-002, NFR-003, TR-WEB-007.

## Related ADRs

Builds on ADR-0009 (bounded-domain catalog) by defining how the browser reaches those domains; complements ADR-0001 (HTTP/Service Bus interaction semantics) for the edge's own downstream HTTP behavior.
