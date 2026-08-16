# Project Lake Shore Drive — Domain Model

## Domain model philosophy

Important facts are modeled as structured records first. Documents are projections/compositions of those facts, not the canonical store of architectural truth.

## Core model

```text
Engagement
├── DiscoverySession(s)
│   └── DiscoveryAnswer(s)
├── Requirement(s)
├── EngagementPattern(s)
├── ADR(s)
├── Finding(s)
├── RaidItem(s)
├── Estimate(s)
├── Deliverable(s)
├── Document(s)
│   └── DocumentSection(s)
│       └── Generation(s)
├── Approval(s)
└── Citation / SourceArtifact link(s)
```

## Engagement

An Engagement is the primary consulting workspace and security boundary.

Lifecycle:

```text
Draft → Discovery → Analysis → Architecture → Estimation
      → Package Generation → Review → Approved → Delivery
      → Closed → Archived
```

Key invariants:

- stable identifier;
- confidentiality classification;
- lifecycle transitions are audited;
- approval state is explicit;
- archived engagements remain historically queryable subject to policy.

## Discovery

A DiscoverySession captures a point-in-time interaction with participants, questions, answers, notes, evidence, open questions, and follow-ups.

An AI suggestion does not become a DiscoveryQuestion or authoritative answer until accepted.

## Requirement

A Requirement is a typed, traceable statement with:

- requirement ID;
- type/category;
- description and rationale;
- priority/status;
- source;
- acceptance criteria;
- owner;
- links to evidence, ADRs, risks, deliverables, estimates and SCRUB prompts.

Changing an approved requirement creates impact-analysis work; it does not silently rewrite downstream artifacts.

## Architecture Pattern

ArchitecturePattern is reusable knowledge. EngagementPattern records use of a pattern in one engagement plus rationale, applicability, trade-offs, and selected implementation guidance.

Patterns have a governed lifecycle and may be deprecated.

## ADR

An ADR captures one architecturally significant decision and links to its requirements, patterns, evidence and alternatives.

Accepted ADRs are immutable historical records. A changed decision is represented by a new ADR that supersedes the previous ADR.

## RAID

RaidItem represents Risk, Assumption, Issue or Dependency. Each item may link to requirements, ADRs, estimates, documents and delivery work.

## Estimate

Estimate is structured as:

```text
Engagement → Phase → Workstream → Deliverable → Activity → Estimate
```

Assumptions and estimation drivers remain part of the estimate record.

## Document

Document is a structured composition, not a monolithic text blob.

A Document contains ordered DocumentSections. Sections have lifecycle, provenance, version, lock state, approval state and generation history.

Suggested section lifecycle:

```text
AI Draft → Architect Edited → In Review → Approved → Published → Superseded
```

## Generation

Generation records the AI operation that created or transformed content:

- user;
- engagement;
- operation type;
- prompt/version;
- model profile;
- source context IDs;
- citations;
- tool calls;
- output artifact/section;
- token/cost telemetry where available;
- review disposition.

## SourceArtifact and Citation

SourceArtifact represents uploaded, generated or historical source material.

Citation identifies the exact source artifact and source location where practical. A citation remains resolvable even if an index is rebuilt.

## Knowledge lifecycle

Reusable content uses:

```text
Draft → Reviewed → Approved → Deprecated → Archived
```

Only approved and authorized material is eligible for broad reuse.
