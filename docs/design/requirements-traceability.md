# Project Lake Shore Drive — Requirements Traceability

## Objective

Lake Shore Drive must be able to explain why an implementation, document statement or AI prompt exists.

The north-star trace is:

> Discovery → Requirement → Pattern → ADR → RAID/Estimate → Deliverable → SCRUB Prompt → Implementation Artifact

## Traceability rules

- every approved requirement has a stable ID;
- ADRs list related requirement IDs;
- selected patterns list requirements they address;
- RAID items may reference the requirement/decision that creates or mitigates them;
- estimates identify the requirements/deliverables driving effort;
- generated document sections retain source structured-record IDs;
- SCRUB prompts list requirement IDs and ADR IDs;
- implementation PRs/commits should reference the prompt/requirement/ADR where practical.

## Coverage matrix

| Requirement family | Primary design artifact |
|---|---|
| Engagement/discovery | domain-model.md / high-level-design.md |
| Requirements/ADR/RAID | domain-model.md / requirements-traceability.md |
| AI orchestration | ai-orchestration-design.md |
| RAG/citations | rag-knowledge-design.md |
| Document generation | document-generation-design.md |
| Angular/design system | angular-design-system.md |
| Long-running work | long-lived-workflow-design.md |
| HTTP/messaging/outbox/inbox | integration-design.md |
| Security/confidentiality | security-design.md |
| Telemetry | observability-design.md |

## Change impact

When an approved requirement changes, the application should identify potentially affected:

- ADRs;
- selected patterns;
- diagrams;
- estimates;
- RAID items;
- generated documents;
- SCRUB prompts;
- implementation artifacts.

Impact detection may be AI-assisted, but the relationship graph and approved facts remain authoritative.

## Prompt header standard

Generated implementation prompts should include:

```text
Implements: REQ-xxx, REQ-yyy
Constrained By: ADR-xxx
Related Pattern: PAT-...
Source Design: docs/design/...
```

## Documentation health

A design document is considered stale when it contradicts an accepted ADR or current approved requirement.

Documentation drift detection can later automate this check, but accepted requirements and ADRs remain the authority.
