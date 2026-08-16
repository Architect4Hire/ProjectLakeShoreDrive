# Project Lake Shore Drive
## Business, Product, Technical, UX, Design System, and AI Requirements

**Product:** Project Lake Shore Drive (LSD)  
**Product Type:** AI Architecture Accelerator / Architect Workbench  
**Primary Experience:** Engagement → Discovery → Requirements → Architecture → Estimation → Consulting Package → Implementation Bootstrap  
**Primary Front End:** Angular 22  
**AI Orchestration:** Microsoft Semantic Kernel (.NET)  
**AI Provider:** OpenAI  
**Knowledge Retrieval:** RAG with governed citations and source provenance  
**Status:** Initial product requirements baseline

---

# 1. Product Vision

Project Lake Shore Drive is an internal **AI Architecture Accelerator** that productizes the repeatable work of a consulting architect.

The platform shall combine structured consulting workflows, reusable architecture knowledge, prior engagement artifacts, estimation models, approved templates, a production design system, and AI-assisted document generation into one governed workbench.

The north-star workflow is:

> **New Engagement → Select Template → Conduct Discovery → Build Requirements → Select Architecture Patterns → Record Decisions → Estimate Work → Generate Consulting Package → Review → Approve → Bootstrap Delivery**

Lake Shore Drive shall not behave as a generic chatbot or generic document generator. It shall be an **architecture-aware system of work** in which every generated artifact is grounded in structured engagement data, approved patterns, architecture decisions, and cited historical knowledge.

The business flywheel is:

> **Every completed engagement should make the next engagement easier, faster, and better.**

---

# 2. Product Goals

## BR-001 — Reduce Consulting Preparation Time

The system shall materially reduce the time required to create architecture consulting deliverables.

The desired outcome is to move common first-draft activities from days to hours while preserving architect review and control.

## BR-002 — Productize Architecture Practice

The system shall capture and reuse the organization's architecture practice, including:

- Discovery questions
- Assessment templates
- Architecture patterns
- Proposal sections
- SOW sections
- Assumptions
- Risks
- Deliverables
- Estimation models
- ADR templates
- Requirements templates
- SCRUB prompts
- Kickoff templates
- Executive-summary patterns
- Diagram definitions
- Lessons learned
- Architecture review checklists
- Delivery bootstrap instructions

## BR-003 — Preserve Architect Judgment

AI output shall be treated as a recommendation or draft until approved by a human architect.

The architect shall remain responsible for:

- Final architecture choices
- Requirements acceptance
- Estimate approval
- Risk acceptance
- Client-facing language
- Architecture decision approval
- Final deliverable approval

## BR-004 — Make Architecture Traceable

The platform shall provide traceability across the consulting lifecycle.

At minimum, the following chain shall be supported:

> **Discovery → Requirement → Architecture Pattern → ADR → Risk/Assumption → Estimate → Deliverable → SCRUB Prompt → Implementation Artifact**

## BR-005 — Establish a Consulting Knowledge Flywheel

Approved outputs from completed engagements shall be available as reusable institutional knowledge subject to confidentiality and governance rules.

---

# 3. Product Principles

Lake Shore Drive shall be designed according to the following principles.

### PR-001 — Structured Data Before Generated Prose

Important engagement facts shall be captured as typed, queryable records rather than existing only inside generated documents.

### PR-002 — AI Assists; Humans Approve

No AI generation shall silently become approved consulting guidance.

### PR-003 — Cite Before Reuse

Historical engagement material used by AI shall retain source provenance and citations.

### PR-004 — Generate From a Shared Source of Truth

Proposal, SOW, Architecture Vision, RAID, ADRs, requirements, project plan, and SCRUB prompts shall derive from the same engagement model.

### PR-005 — Design System First

Application pages shall be assembled from a governed local design system rather than page-specific Tailwind/CSS composition.

### PR-006 — Architecture Workbench, Not Chat Wrapper

Chat is one interaction mode. The primary product shall remain a structured workbench consisting of forms, matrices, editors, workflows, review states, history, search, and generated artifacts.

### PR-007 — Provider Boundaries

OpenAI, search, storage, and export providers shall be accessed through application abstractions so product logic is not coupled directly to vendor SDKs.

---

# 4. Primary User Roles

## BR-010 — Principal Architect

The Principal Architect shall be able to create engagements, conduct discovery, approve requirements, select architecture patterns, approve ADRs, estimate work, generate deliverables, and promote reusable knowledge.

## BR-011 — Consulting Contributor

A Consulting Contributor shall be able to add discovery notes, requirements, findings, risks, assumptions, estimates, and comments according to assigned permissions.

## BR-012 — Reviewer

A Reviewer shall be able to inspect proposed decisions and deliverables, comment, approve, reject, or request revision.

## BR-013 — Knowledge Curator

A Knowledge Curator shall be able to promote, deprecate, classify, and govern templates, patterns, reusable sections, prompt templates, and historical knowledge.

## BR-014 — Administrator

An Administrator shall manage users, roles, configuration, model/provider settings, data classifications, retention policies, and design-system feature flags where applicable.

---

# 5. Engagement Management

## BR-020 — Engagement Creation

The system shall support creation of an engagement with at least:

- Client
- Engagement name
- Engagement type
- Business problem
- Business objectives
- Current-state summary
- Target-state summary
- Known technology landscape
- Timeline
- Stakeholders
- Constraints
- Requested deliverables
- Confidentiality classification

## BR-021 — Engagement Types

The platform shall support configurable engagement templates including:

- Architecture Assessment
- Application Modernization
- Cloud Migration
- New Application Architecture
- Microservices Assessment
- Azure Architecture Review
- AI / RAG Assessment
- Proof of Concept
- Architecture Advisory
- Technical Due Diligence
- Development Accelerator
- Implementation Engagement

## BR-022 — Engagement Lifecycle

The baseline engagement lifecycle shall be:

`Draft → Discovery → Analysis → Architecture → Estimation → Package Generation → Review → Approved → Delivery → Closed → Archived`

Transitions shall be auditable.

## BR-023 — Engagement Workspace

Each engagement shall provide a unified workbench showing:

- Engagement summary
- Current phase
- Completion indicators
- Discovery status
- Requirements
- Findings
- Architecture patterns
- ADRs
- RAID items
- Estimates
- Generated documents
- AI suggestions awaiting review
- Citations and source material
- Activity/history

---

# 6. Guided Discovery

## BR-030 — Discovery Question Library

The platform shall maintain reusable discovery questions grouped by domains such as:

- Business
- Application
- Integration
- Data
- Identity
- Security
- Infrastructure
- Networking
- DevOps
- Observability
- Reliability
- Performance
- Scalability
- Compliance
- Operations
- AI
- Cost
- Developer Experience

## BR-031 — Conditional Questioning

Discovery questions shall support conditional display based on previous answers, engagement type, selected patterns, and technology choices.

## BR-032 — Discovery Sessions

The system shall support multiple discovery sessions within an engagement and preserve:

- Date/time
- Participants
- Questions asked
- Responses
- Notes
- Open questions
- Evidence/source
- Follow-up assignments

## BR-033 — AI-Suggested Questions

The AI assistant may suggest additional discovery questions based upon gaps, contradictions, selected patterns, or historical engagements.

AI-suggested questions shall remain visually distinct until accepted into the engagement.

## BR-034 — Discovery Gap Detection

The system shall detect likely gaps such as availability requirements without RTO/RPO, regulated data without retention rules, or high-throughput claims without measurable throughput targets.

---

# 7. Requirements Management

## BR-040 — Requirements Matrix

Every engagement shall maintain a structured requirements matrix.

Each requirement shall support:

- Requirement ID
- Title
- Description
- Type
- Category
- Business rationale
- Priority
- Source
- Status
- Acceptance criteria
- Owner
- Related discovery answers
- Related ADRs
- Related risks
- Related deliverables
- Related SCRUB prompts

## BR-041 — Requirement Types

Supported requirement types shall include:

- Business
- Functional
- Non-functional
- Security
- Performance
- Availability
- Scalability
- Integration
- Data
- Compliance
- Operational
- Maintainability
- Developer Experience

## BR-042 — AI Requirement Extraction

The platform shall allow AI to propose requirements from discovery notes and uploaded source material.

AI-extracted requirements shall require review before becoming approved requirements.

## BR-043 — Requirement Contradiction Detection

The platform shall identify potentially conflicting requirements and provide the architect with supporting evidence.

## BR-044 — Requirement Impact Analysis

When an approved requirement changes, the platform shall identify potentially affected:

- ADRs
- Patterns
- Diagrams
- Estimates
- Project plan items
- Generated documents
- SCRUB prompts

---

# 8. Architecture Pattern Library

## BR-050 — Pattern Catalog

The system shall maintain reusable architecture patterns including, but not limited to:

- Modular Monolith
- Microservices
- Event-Driven Architecture
- Transactional Outbox
- API Gateway
- Backend for Frontend
- CQRS
- Distributed Cache
- Serverless Processing
- Background Processing
- RAG
- Retrieval + Citation
- Human-in-the-Loop AI

## BR-051 — Pattern Metadata

Each pattern shall include:

- Name
- Problem addressed
- Context
- Applicability
- Contraindications
- Benefits
- Tradeoffs
- Risks
- Security considerations
- Reliability considerations
- Cost considerations
- Operational considerations
- Related patterns
- Implementation guidance
- Related ADR templates
- Example engagements
- Status/version

## BR-052 — Azure Pattern Mapping

Architecture patterns may map to Azure implementation options such as:

- Azure App Service
- Azure Container Apps
- AKS
- Azure Functions
- Azure Service Bus
- Azure SQL
- Cosmos DB
- Azure Cache for Redis
- Blob Storage
- Key Vault
- API Management
- Application Insights / Azure Monitor
- Azure AI Search
- OpenAI integrations

## BR-053 — AI Pattern Recommendation

AI may recommend architecture patterns based upon approved requirements and discovery context.

Recommendations shall include rationale, tradeoffs, requirements addressed, and alternatives considered.

---

# 9. Architecture Decision Records

## BR-060 — ADR Management

The system shall support creation and lifecycle management of ADRs.

## BR-061 — ADR Structure

Each ADR shall include:

- ADR number
- Title
- Status
- Context
- Decision drivers
- Decision
- Alternatives considered
- Rationale
- Consequences
- Risks
- Related requirements
- Related patterns
- Related evidence

## BR-062 — AI ADR Drafting

AI shall be able to generate an ADR draft from selected requirements, patterns, discovery answers, and architect notes.

## BR-063 — Similar ADR Retrieval

The system shall retrieve semantically similar prior ADRs and show their source engagements and citations.

---

# 10. Assessment and Findings

## BR-070 — Assessment Frameworks

The platform shall support reusable assessment frameworks across:

- Architecture
- Security
- Reliability
- Performance
- Cost
- Operations
- Developer productivity
- Maintainability
- Integration
- Data
- AI readiness

## BR-071 — Structured Findings

Each finding shall support:

- Finding ID
- Observation
- Evidence
- Impact
- Severity
- Recommendation
- Remediation
- Related requirements
- Related ADRs
- Related source citations

## BR-072 — Executive Translation

AI shall be able to transform detailed technical findings into executive-ready language without altering the underlying approved facts.

---

# 11. Estimation Workbench

## BR-080 — Estimation Models

The platform shall maintain reusable estimation models for consulting and implementation activities.

## BR-081 — Work Breakdown

Estimates shall support:

`Engagement → Phase → Workstream → Deliverable → Activity → Estimate`

## BR-082 — Estimation Drivers

Estimation drivers may include:

- Complexity
- Integration count
- Service count
- Data migration
- Environment count
- Security complexity
- Testing depth
- Deployment complexity
- Documentation scope
- Client dependency
- Unknowns

## BR-083 — Estimate Rationale

Generated or assisted estimates shall retain the assumptions and factors used to produce them.

## BR-084 — Historical Comparables

The system shall allow an architect to compare a proposed estimate with similar previous engagements.

---

# 12. RAID Management

## BR-090 — RAID Log

Each engagement shall contain structured:

- Risks
- Assumptions
- Issues
- Dependencies

## BR-091 — AI RAID Suggestions

AI may suggest RAID items based on requirements, architecture choices, current findings, and previous engagements.

## BR-092 — RAID Traceability

Each RAID item may link to requirements, ADRs, work items, estimates, and generated documents.

---

# 13. AI-Assisted Document Creation

## BR-100 — Document Generation Workbench

Lake Shore Drive shall provide an AI-assisted document creation experience that generates consulting artifacts from approved structured engagement data and governed knowledge sources.

## BR-101 — Supported Generated Artifacts

The system shall generate, at minimum:

- Executive Summary
- Proposal
- Statement of Work
- Architecture Vision
- Architecture Assessment
- Project Plan
- RAID Log
- Requirements Matrix
- ADR Starter Set
- SCRUB Implementation Prompts
- README / Repository Bootstrap
- Project Kickoff Package

## BR-102 — Document Composition

Documents shall be assembled from reusable sections rather than generated as uncontrolled monolithic prompts.

Example SOW composition:

`Background + Objectives + Scope + Out of Scope + Approach + Activities + Deliverables + Assumptions + Dependencies + Risks + Timeline + Acceptance Criteria`

## BR-103 — Section-Level Generation

Users shall be able to generate, regenerate, edit, approve, and lock individual document sections.

Regenerating one section shall not overwrite manually approved content in unrelated sections.

## BR-104 — Grounded Generation

Document generation shall provide the model only the relevant context needed for the requested section, including:

- Approved engagement facts
- Approved requirements
- Selected architecture patterns
- Approved ADRs
- Approved RAID items
- Relevant estimates
- Relevant reusable templates
- Explicitly selected historical sources

## BR-105 — AI Draft State

Generated content shall initially be marked `AI Draft`.

Suggested document lifecycle:

`AI Draft → Architect Edited → In Review → Approved → Published → Superseded`

## BR-106 — Source Provenance

Generated sections shall preserve provenance indicating whether content came from:

- Current engagement structured data
- Approved template content
- Pattern library
- Historical engagement retrieval
- User-authored text
- AI inference

## BR-107 — Citation-Aware Generation

When historical documents or source files influence an output, generated content shall provide citations that resolve to the underlying source artifact and source location where possible.

## BR-108 — No Fabricated Evidence

The system shall not present model-generated statements as sourced facts unless a valid source exists.

## BR-109 — Document Comparison

Users shall be able to compare regenerated document versions and accept/reject changes at section level.

## BR-110 — Document Export

Approved documents shall be exportable to appropriate formats including:

- Markdown
- Word
- PDF
- Excel/CSV where tabular
- Repository-ready files

---

# 14. Semantic Kernel AI Orchestration Requirements

## TR-AI-001 — Semantic Kernel Boundary

Microsoft Semantic Kernel shall act as the application-level AI orchestration layer in the .NET backend.

Angular shall never call OpenAI directly.

## TR-AI-002 — Kernel Construction

Semantic Kernel kernels shall be created through application-managed factories so model configuration, telemetry, authentication, policies, and plugins are consistently applied.

## TR-AI-003 — Semantic Kernel Plugins

Application capabilities exposed to AI shall be represented through explicit Semantic Kernel plugins/functions rather than unrestricted data access.

Candidate plugins include:

- `EngagementPlugin`
- `DiscoveryPlugin`
- `RequirementsPlugin`
- `ArchitecturePatternPlugin`
- `AdrPlugin`
- `RaidPlugin`
- `EstimationPlugin`
- `KnowledgeSearchPlugin`
- `CitationPlugin`
- `DocumentComposerPlugin`
- `TemplatePlugin`

## TR-AI-004 — Prompt Templates

Prompts shall be stored as versioned application assets/configuration rather than hard-coded inline throughout business services.

Each prompt template shall define:

- Prompt ID
- Purpose
- SCRUB definition
- Expected inputs
- Expected structured output
- Allowed plugins/functions
- Model policy
- Version
- Evaluation cases
- Status

## TR-AI-005 — SCRUB Prompt Standard

AI prompt templates shall use the SCRUB framework:

- **Scope** — bounded task to perform
- **Constraints** — architecture/business requirements that must hold
- **Restrictions** — actions, assumptions, data, or output that are forbidden
- **Usage** — context and source material supplied to the model
- **Behavior** — required response shape and interaction behavior

## TR-AI-006 — Structured AI Outputs

Where output will become application data, the AI layer shall request schema-constrained structured results rather than parse free-form prose.

Examples include:

- Extracted requirements
- Suggested risks
- Architecture pattern recommendations
- ADR metadata
- Finding classification
- Document section plans

## TR-AI-007 — Function Calling

Semantic Kernel function calling shall be used for approved application actions and retrieval operations rather than asking the model to infer hidden application state.

## TR-AI-008 — AI Authorization

AI-accessible functions shall honor the same authorization and engagement-boundary policies as non-AI application operations.

The model shall not bypass domain authorization.

## TR-AI-009 — AI Audit Record

Each meaningful AI execution shall record:

- User
- Engagement
- Operation type
- Prompt template/version
- Model/provider identifier
- Source context IDs
- Retrieved citations
- Tool/plugin calls
- Output artifact ID
- Review disposition
- Token/cost telemetry where available
- Execution timestamp

## TR-AI-010 — Provider Abstraction

The domain/application layers shall depend on internal interfaces such as `IAiCompletionService`, `IEmbeddingService`, `IKnowledgeRetriever`, and `IDocumentGenerationService` rather than OpenAI SDK types.

---

# 15. OpenAI Integration Requirements

## TR-OAI-001 — OpenAI as Generation Provider

OpenAI shall be the initial generative AI provider used by the Semantic Kernel orchestration layer.

## TR-OAI-002 — Server-Side Access Only

OpenAI API credentials shall never be exposed to Angular or stored in client-side configuration.

## TR-OAI-003 — Model Configuration

Model selection shall be environment/configuration driven and shall not be hard-coded into domain logic.

Different tasks may use different model profiles for:

- Extraction
- Reasoning
- Document drafting
- Summarization
- Embeddings
- Evaluation

## TR-OAI-004 — Request Correlation

OpenAI requests shall be correlated with the originating engagement, user operation, and generation record for observability and auditability.

## TR-OAI-005 — Failure Handling

The application shall handle AI provider failures explicitly, including:

- Timeouts
- Rate limits
- Invalid structured output
- Safety refusal
- Provider outage
- Retrieval failure

A failed AI operation shall not corrupt approved engagement data.

## TR-OAI-006 — Retry Policy

Retries shall be bounded and appropriate to failure type. Document generation operations must be idempotent at the application level.

## TR-OAI-007 — Streaming UX

The backend may stream generation progress/content to the Angular client for long-running document drafting while preserving a final persisted generation record.

---

# 16. RAG and Knowledge Retrieval

## BR-120 — Knowledge Ingestion

The platform shall ingest approved reusable knowledge including:

- Proposals
- SOWs
- ADRs
- Architecture documents
- Assessment findings
- Requirements
- README files
- SCRUB prompts
- Project plans
- Diagrams and diagram descriptions
- Lessons learned

## TR-RAG-001 — Ingestion Pipeline

The ingestion pipeline shall perform:

`Source Registration → Content Extraction → Classification → Chunking → Metadata Enrichment → Embedding → Indexing → Validation → Availability`

## TR-RAG-002 — Source Metadata

Indexed chunks shall retain metadata including:

- Source artifact ID
- Engagement ID
- Client classification
- Artifact type
- Section
- Version
- Created date
- Approved status
- Technology tags
- Architecture pattern tags
- Confidentiality classification

## TR-RAG-003 — Retrieval Filters

Retrieval shall support metadata filtering before or during semantic search to prevent cross-engagement leakage and irrelevant retrieval.

## TR-RAG-004 — Citation Model

Every retrieved chunk used in a generated answer shall retain a stable citation reference capable of resolving back to its source artifact.

## TR-RAG-005 — Retrieval Transparency

The UI shall allow users to inspect the sources used to generate a response or document section.

## TR-RAG-006 — Explicit Source Selection

Users shall be able to select specific engagements/documents as generation context.

Example:

> Generate this assessment using the patterns from Engagement A and the ADRs from Engagement B.

## TR-RAG-007 — Knowledge Governance

Only material authorized for reusable knowledge shall be eligible for organization-wide retrieval.

Client-confidential content shall remain engagement-scoped unless explicitly promoted under governance rules.

---

# 17. Angular 22 Web Application Requirements

## TR-WEB-001 — Angular Version

The web application shall use **Angular 22**.

## TR-WEB-002 — Standalone Architecture

New Angular components, routes, directives, and pipes shall use standalone APIs. New feature development shall not introduce application `NgModule` architecture unless required by a third-party dependency.

## TR-WEB-003 — Signals-First State

Angular Signals shall be the default mechanism for local reactive state, derived state, and UI state.

RxJS shall continue to be used where streams are naturally asynchronous or event-based, including HTTP composition where appropriate.

## TR-WEB-004 — Signal Forms

New form-heavy workbench experiences should use Angular 22 Signal Forms where practical, particularly:

- Discovery questionnaires
- Requirement editing
- Pattern configuration
- ADR editing
- RAID editing
- Engagement metadata

## TR-WEB-005 — Lazy Feature Routes

Major workbench areas shall be lazy loaded by route.

Candidate route structure:

```text
/engagements
/engagements/:id/overview
/engagements/:id/discovery
/engagements/:id/requirements
/engagements/:id/architecture
/engagements/:id/adrs
/engagements/:id/raid
/engagements/:id/estimates
/engagements/:id/documents
/engagements/:id/ai
/knowledge
/patterns
/templates
/admin
```

## TR-WEB-006 — Feature Boundaries

Feature areas shall not directly import private implementation details from other features.

Shared cross-cutting UI shall come from the design system or documented shared application abstractions.

## TR-WEB-007 — API Access

Angular shall access backend functionality through typed application services/facades. Components shall not construct API URLs or contain provider-specific integration logic.

## TR-WEB-008 — Route Authorization

Routes and actions shall enforce role- and engagement-level authorization.

## TR-WEB-009 — Unsaved Work Protection

Editors for requirements, ADRs, templates, and documents shall warn users before navigating away from unsaved changes.

## TR-WEB-010 — Optimistic UI

Optimistic updates may be used for low-risk actions but shall reconcile with authoritative server state and surface conflicts.

---

# 18. Lake Shore Drive Design System

## DS-001 — First-Class Design System

Project Lake Shore Drive shall include a local production design system that defines visual language, interaction patterns, accessibility behavior, and reusable application composition.

The design system is a product requirement, not an optional styling library.

## DS-002 — Required Repository Location

The design system shall live within the repository under:

```text
/src/web/design-system/
```

Application feature code shall consume the local design system rather than duplicating utility-class combinations.

## DS-003 — Design System Layers

The design system shall be organized into explicit layers:

```text
/src/web/design-system/
  tokens/
  foundations/
  primitives/
  components/
  patterns/
  recipes/
  layouts/
  icons/
  utilities/
  documentation/
```

### Tokens

Machine-readable design decisions such as:

- Color
- Typography
- Spacing
- Sizing
- Radius
- Elevation
- Border
- Motion
- Z-index
- Breakpoints

### Foundations

Global rules such as typography, focus behavior, page background, density, and accessibility defaults.

### Primitives

Low-level reusable controls such as button, input, select, checkbox, badge, icon, separator, tooltip, and surface.

### Components

Higher-level controls such as data table, dialog, drawer, command palette, tabs, stepper, status banner, file picker, citation chip, and structured editor.

### Patterns

Business-neutral UX patterns such as empty states, master/detail, review/approval, filters, search results, activity stream, form sections, and AI suggestion review.

### Recipes

Lake Shore Drive-specific composition recipes such as:

- Engagement header
- Engagement phase rail
- Requirement matrix row
- ADR card
- RAID register
- Source citation panel
- AI generation drawer
- Document section editor
- Approval bar
- Architecture decision comparison
- Knowledge result card

## DS-004 — No Page-Level Style Duplication

Feature components shall not repeatedly encode the same Tailwind/CSS utility groups for common surfaces, buttons, cards, forms, tables, status indicators, spacing, or typography.

Repeated visual patterns shall be promoted into design-system components or recipes.

## DS-005 — Tailwind Boundary

If Tailwind CSS is used, it shall primarily implement design-system primitives and recipes.

Application features should consume semantic design-system APIs instead of treating Tailwind class strings as the design system.

## DS-006 — Semantic Tokens

Feature UI shall use semantic tokens such as:

- `surface-page`
- `surface-panel`
- `surface-raised`
- `text-primary`
- `text-muted`
- `border-default`
- `status-success`
- `status-warning`
- `status-danger`
- `status-info`
- `accent-primary`

rather than hard-coded color values.

## DS-007 — Angular Component API Standards

Design-system components shall expose strongly typed Angular APIs and favor:

- Signal-based inputs/outputs where appropriate
- Content projection for composition
- Accessible native semantics
- Predictable variants
- Minimal feature-specific assumptions

## DS-008 — Accessibility

All design-system components shall target WCAG 2.2 AA behavior, including:

- Keyboard operation
- Focus visibility
- Semantic markup
- Accessible names
- Sufficient contrast
- Screen-reader status announcements
- Reduced-motion support
- Error association for forms

## DS-009 — Responsive Workbench

The design system shall support desktop-first architecture work while remaining functional at tablet and mobile widths.

Dense matrix experiences may adapt to cards or focused detail views rather than forcing full desktop tables onto narrow screens.

## DS-010 — Dark and Light Appearance

The token model shall be capable of supporting light and dark appearance without feature components overriding theme colors directly.

## DS-011 — Design System Documentation

Each production component or recipe shall document:

- Purpose
- Variants
- Inputs/outputs
- Accessibility behavior
- Usage examples
- Do / don't guidance
- Responsive behavior

## DS-012 — Visual Regression

Design-system components and critical workbench recipes shall be covered by visual regression tests.

## DS-013 — AI-Specific UX Components

The design system shall include standardized AI interaction patterns rather than inventing new AI UI per feature.

Required AI patterns include:

- AI Draft badge
- Generating state
- Suggested change state
- Accept / Reject control
- Source citation chip
- Source preview panel
- Confidence/caution treatment where appropriate
- Regenerate section action
- Compare versions view
- Prompt/context inspector for authorized users
- AI failure state

## DS-014 — AI Must Not Visually Masquerade as Approved Content

AI-generated content shall remain visually distinguishable from architect-approved content until approval.

---

# 19. Core UX Requirements

## UX-001 — Workbench Shell

The application shell shall provide:

- Primary navigation
- Current engagement context
- Engagement switcher
- Global search
- Command palette
- Notifications/tasks
- User menu

## UX-002 — Engagement Phase Navigation

Within an engagement, the UI shall provide consistent navigation among:

`Overview / Discovery / Requirements / Architecture / ADRs / RAID / Estimates / Documents / AI`

## UX-003 — Split-View Workflows

The application shall support split-view experiences where source/context and editable output are useful together.

Examples:

- Discovery answer beside suggested requirement
- Requirement beside related ADR
- Historical ADR beside new ADR draft
- Source document beside generated section
- Current version beside proposed regeneration

## UX-004 — Review Queues

AI suggestions requiring architect action shall be gathered into review queues rather than silently inserted into records.

## UX-005 — Autosave

Long-form editors should autosave drafts while preserving explicit approval/publish actions.

## UX-006 — Keyboard Efficiency

High-frequency architect workflows should support keyboard interaction and command-palette actions.

## UX-007 — Progressive Disclosure

Complex architecture records shall show the information needed for the current decision while allowing deeper evidence, provenance, and metadata to be expanded.

---

# 20. Document Editor UX

## UX-DOC-001 — Structured Document Canvas

The document editor shall render documents as ordered sections backed by structured section records.

## UX-DOC-002 — Section Actions

Each editable section shall support relevant actions such as:

- Edit
- Ask AI
- Generate
- Regenerate
- Shorten
- Expand
- Change audience
- Add evidence
- View sources
- Compare version
- Approve
- Lock

## UX-DOC-003 — Context Selection

Before generation, the architect shall be able to inspect or modify the sources/context selected for the operation.

## UX-DOC-004 — Inline Citations

Citations shall be visible inline or through design-system citation components and resolve to a source preview.

## UX-DOC-005 — Generation History

Each section shall maintain generation/edit history sufficient to answer:

- What changed?
- Who changed it?
- Was it AI-generated or human-written?
- Which sources informed it?
- Which prompt version generated it?

---

# 21. Backend Application Architecture

## TR-API-001 — .NET Backend

The backend shall be implemented as a modern .NET application with clearly separated application/domain/infrastructure concerns.

## TR-API-002 — Modular Boundaries

Business capability modules should align to product concepts such as:

```text
Engagements
Discovery
Requirements
Architecture
Decisions
Assessments
Raid
Estimation
Documents
Templates
Knowledge
AI
Identity
Administration
```

## TR-API-003 — Domain Ownership

Each module shall own its business rules and data access boundary. Other modules shall interact through defined contracts rather than reaching directly into internal persistence implementation.

## TR-API-004 — Long-Running Operations

Long-running operations such as ingestion, bulk embedding, multi-document generation, and export shall be executed asynchronously with persisted operation state.

## TR-API-005 — Idempotency

Retryable generation, ingestion, and export operations shall support idempotency to prevent duplicate artifacts.

---

# 22. Data Requirements

## TR-DATA-001 — Relational System of Record

Structured engagement state shall be stored in a relational database suitable for transactional consistency and rich relationships.

Core entities include:

- Engagement
- DiscoverySession
- DiscoveryQuestion
- DiscoveryAnswer
- Requirement
- ArchitecturePattern
- EngagementPattern
- Adr
- Finding
- RaidItem
- Estimate
- Deliverable
- Document
- DocumentSection
- Generation
- Citation
- SourceArtifact
- Template
- PromptTemplate
- KnowledgeRecord
- Approval
- AuditEvent

## TR-DATA-002 — Artifact Storage

Binary and generated artifacts shall be stored outside core relational rows with metadata retained in the system of record.

## TR-DATA-003 — Versioning

Approved documents, templates, prompts, patterns, and ADRs shall support immutable historical versions.

## TR-DATA-004 — Soft Delete / Archive

Records with governance or audit value shall generally be archived rather than physically deleted through normal user workflows.

---

# 23. Search Requirements

## BR-130 — Global Search

Users shall be able to search across:

- Engagements
- Requirements
- ADRs
- Patterns
- Findings
- RAID
- Templates
- Deliverables
- Prompts
- Historical artifacts

## BR-131 — Architecture-Centric Queries

The knowledge experience shall support questions such as:

- Where have we implemented transactional outbox?
- Show ADRs where Azure SQL was selected over Cosmos DB.
- Which engagements used Azure Service Bus?
- What risks repeatedly appeared in event-driven systems?
- Show architectures that combined OpenAI with retrieval.
- What effort did similar modernization engagements require?

## TR-SEARCH-001 — Hybrid Retrieval

The knowledge-search abstraction should support semantic/vector retrieval combined with keyword and metadata filtering where appropriate.

---

# 24. Security and Confidentiality

## SEC-001 — Authentication

All non-public product functions shall require authenticated users.

## SEC-002 — Authorization

Authorization shall be enforced server-side by role, engagement, and operation.

## SEC-003 — Engagement Isolation

Client data shall not be exposed across engagements without explicit authorization.

## SEC-004 — AI Context Isolation

AI prompts and retrieval operations shall respect the same access boundaries as the requesting user.

## SEC-005 — Secret Management

OpenAI credentials and other provider secrets shall be held in secure server-side secret storage and never shipped to Angular.

## SEC-006 — Confidentiality Classification

Artifacts shall support classifications such as:

- Internal reusable
- Client confidential
- Engagement restricted
- Approved reusable knowledge

## SEC-007 — Prompt Injection Defense

Retrieved and uploaded documents shall be treated as untrusted content. Instructions contained inside source documents shall not override application system policies, tool permissions, or retrieval boundaries.

## SEC-008 — Export Authorization

Export operations shall validate that the requesting user may access every included artifact.

---

# 25. Observability and AI Operations

## OPS-001 — Correlation

A user action shall be traceable across Angular, API, Semantic Kernel execution, OpenAI request, retrieval calls, persistence, and generated artifact.

## OPS-002 — Application Telemetry

The system shall capture:

- Request duration
- Failure rate
- Generation duration
- Retrieval duration
- Export duration
- Queue/background processing health

## OPS-003 — AI Telemetry

AI telemetry shall include where available:

- Provider/model
- Token usage
- Estimated cost
- Prompt template/version
- Tool calls
- Retrieval count
- Citation count
- Structured-output validation failures
- User acceptance/rejection of suggestions

## OPS-004 — Sensitive Telemetry

Raw prompts and outputs shall not be indiscriminately copied into logs. Logging policy shall account for client confidentiality and sensitive information.

## OPS-005 — Quality Metrics

The system shall support evaluation metrics such as:

- Requirement extraction acceptance rate
- Architecture recommendation acceptance rate
- Citation validity
- Document-section regeneration frequency
- AI output rejection rate
- Average edits before approval

---

# 26. Audit and Governance

## GOV-001 — Change History

The system shall record significant changes to:

- Requirements
- ADRs
- RAID
- Estimates
- Templates
- Patterns
- Prompts
- Documents

## GOV-002 — AI Attribution

The system shall distinguish content that was:

- Human authored
- AI suggested
- AI generated
- Human modified from AI
- Human approved

## GOV-003 — Knowledge Lifecycle

Reusable knowledge shall support:

`Draft → Reviewed → Approved → Deprecated → Archived`

## GOV-004 — Deprecated Guidance

Deprecated patterns/templates shall not be automatically recommended for new engagements.

## GOV-005 — Prompt Governance

Production prompt templates shall be versioned, reviewable, testable, and promotable between statuses/environments.

---

# 27. SCRUB Implementation Prompt Generator

## BR-140 — Prompt Generation

Lake Shore Drive shall transform approved requirements and architecture decisions into implementation prompts for AI-assisted development.

## BR-141 — Microstep Principle

Generated SCRUB prompts shall perform one bounded implementation task whenever practical.

## BR-142 — Prompt Traceability

Each generated prompt shall reference the requirements and ADRs that constrain it.

Example:

```text
Implements: REQ-042, REQ-043
Constrained By: ADR-007
Related Pattern: PAT-Transactional-Outbox
```

## BR-143 — Repository Context

Prompt generation shall be able to include repository conventions, architectural boundaries, design-system requirements, and relevant implementation standards.

## BR-144 — Design System Enforcement in Prompts

Frontend implementation prompts shall explicitly require reuse of `/src/web/design-system/` components and recipes and shall prohibit recreating equivalent local UI styles in feature code.

---

# 28. Diagram Requirements

## BR-150 — Diagram Definitions

The platform shall generate editable diagram definitions based on approved architecture records.

## BR-151 — Supported Views

Initial supported diagram concepts should include:

- System Context
- Container
- Component
- Integration
- Deployment
- Data Flow
- Sequence
- Azure Infrastructure

## BR-152 — Diagram Traceability

Diagram nodes and relationships should be traceable to requirements, patterns, and ADRs where practical.

---

# 29. Export and Repository Bootstrap

## BR-160 — Consulting Package Export

A consulting package may include:

1. Proposal
2. Statement of Work
3. Executive Summary
4. Architecture Vision
5. Architecture Assessment
6. Project Plan
7. RAID Log
8. Requirements Matrix
9. ADR Starter Set
10. SCRUB Implementation Prompts
11. README
12. Diagram Definitions

## BR-161 — Repository Bootstrap Structure

Lake Shore Drive shall be able to produce a repository-oriented output such as:

```text
README.md
/docs
  /architecture
  /adr
  /requirements
  /assessments
  /raid
  /prompts
  /diagrams
  /project
```

## BR-162 — Generated Bootstrap Integrity

Generated implementation guidance shall use the approved requirements and ADR versions effective at generation time.

---

# 30. Non-Functional Requirements

## NFR-001 — Responsiveness

Normal CRUD and navigation interactions should feel immediate under expected consulting workloads.

## NFR-002 — Long-Running Feedback

Long-running AI, ingestion, and export operations shall expose explicit progress/state rather than blocking the browser indefinitely.

## NFR-003 — Reliability

AI provider failure shall degrade AI features without making structured engagement data unavailable.

## NFR-004 — Recoverability

Draft document work and structured engagement edits shall be recoverable from expected browser/network interruptions.

## NFR-005 — Accessibility

The application shall target WCAG 2.2 AA.

## NFR-006 — Maintainability

Product modules, design-system components, AI orchestration, and provider infrastructure shall be independently testable.

## NFR-007 — Testability

Critical business rules shall not depend on a live AI provider in automated unit tests.

## NFR-008 — AI Determinism Where Needed

Structured extraction and classification workflows shall favor constrained schemas and validation so downstream application behavior does not rely on arbitrary prose parsing.

---

# 31. Testing Requirements

## TEST-001 — Unit Tests

Unit tests shall cover domain rules, validation, document composition logic, permission policies, and prompt/context assembly.

## TEST-002 — Contract Tests

Provider boundaries for OpenAI, retrieval, storage, and export shall have contract/integration tests.

## TEST-003 — AI Evaluation Tests

Important prompt templates shall have reusable evaluation cases covering representative inputs and expected properties.

## TEST-004 — Citation Tests

RAG tests shall verify that generated citations resolve to authorized source material.

## TEST-005 — Angular Component Tests

Design-system components and business-critical Angular workbench flows shall have component-level tests.

## TEST-006 — Visual Regression

Critical design-system components and layouts shall have visual regression coverage.

## TEST-007 — Accessibility Tests

Automated accessibility testing shall be part of the web CI pipeline, supplemented by manual keyboard and screen-reader review for critical flows.

---

# 32. Proposed Repository Shape

The following is a recommended target organization, not a requirement that every folder exist on day one.

```text
/
├── README.md
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── requirements/
│   ├── prompts/
│   └── diagrams/
│
├── src/
│   ├── web/
│   │   ├── design-system/
│   │   │   ├── tokens/
│   │   │   ├── foundations/
│   │   │   ├── primitives/
│   │   │   ├── components/
│   │   │   ├── patterns/
│   │   │   ├── recipes/
│   │   │   ├── layouts/
│   │   │   └── documentation/
│   │   └── src/app/
│   │       ├── core/
│   │       ├── shell/
│   │       ├── engagements/
│   │       ├── discovery/
│   │       ├── requirements/
│   │       ├── architecture/
│   │       ├── decisions/
│   │       ├── raid/
│   │       ├── estimates/
│   │       ├── documents/
│   │       ├── knowledge/
│   │       └── admin/
│   │
│   ├── api/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── ai/
│   │   ├── orchestration/
│   │   ├── plugins/
│   │   ├── prompts/
│   │   ├── retrieval/
│   │   ├── citations/
│   │   └── providers/
│   └── workers/
│
└── tests/
    ├── unit/
    ├── integration/
    ├── architecture/
    ├── ai-evals/
    └── web/
```

---

# 33. MVP Scope

The MVP shall prove the entire consulting acceleration loop without attempting every future capability.

## MVP-001 — Engagement Management

Create, view, edit, phase, archive, and search engagements.

## MVP-002 — Design System Foundation

Deliver the production design-system foundation before feature pages proliferate.

MVP design-system coverage shall include:

- Tokens
- Typography
- Buttons
- Form controls
- Cards/surfaces
- Status badges
- Dialog/drawer
- Tabs
- Data table
- Empty/loading/error states
- Navigation shell
- Engagement header
- Citation UI
- AI Draft / review UI

## MVP-003 — Guided Discovery

Create and answer structured discovery questionnaires.

## MVP-004 — Requirements Matrix

Create, edit, classify, approve, and link requirements.

## MVP-005 — Architecture Patterns

Browse/select patterns and retain rationale.

## MVP-006 — ADRs

Create and AI-assist ADR drafting with architect approval.

## MVP-007 — RAID

Maintain RAID and generate suggestions.

## MVP-008 — AI Document Composer

Generate section-based:

- Executive Summary
- Proposal
- SOW
- Architecture Vision
- Requirements Matrix narrative
- RAID summary
- ADR starter set
- Project Plan
- SCRUB prompts
- README

## MVP-009 — Semantic Kernel + OpenAI

Implement the production AI boundary using Semantic Kernel orchestration, OpenAI generation, versioned SCRUB prompt templates, structured outputs, plugin/function boundaries, audit records, and failure handling.

## MVP-010 — RAG With Citations

Ingest approved prior artifacts, search them semantically, use filtered retrieval as document context, and surface resolvable citations.

## MVP-011 — Export

Export approved content to Markdown first, with Word/PDF follow-on if necessary for the initial release boundary.

## MVP-012 — Auditability

Record who created, generated, modified, approved, and published major architecture artifacts.

---

# 34. Post-MVP Capabilities

Future releases may add:

- Automated architecture diagram rendering
- Azure cost estimation
- Azure Well-Architected assessment scoring
- Architecture maturity scoring
- Client collaboration portal
- CRM integration
- PSA integration
- Time tracking
- Resource planning
- GitHub repository creation
- Automated implementation bootstrap commits
- Code-to-ADR conformance checking
- Documentation drift detection
- Architecture policy checks against repositories
- Engagement retrospectives
- Automated lessons-learned extraction
- Multi-agent review workflows where they provide measurable value

---

# 35. Success Measures

## KPI-001 — Engagement Setup

A new engagement shall be able to reach a usable discovery-ready state in less than 10 minutes using an approved template.

## KPI-002 — First Consulting Package

Once discovery is sufficiently complete, the architect should be able to produce a coherent first consulting-package draft within one working session.

## KPI-003 — Reuse Rate

The majority of recurring consulting artifact structure should originate from approved reusable content rather than manual copy/paste.

## KPI-004 — Traceability

For generated implementation guidance, the architect should be able to navigate backward through:

`SCRUB Prompt → ADR → Requirement → Discovery Evidence`

## KPI-005 — Citation Coverage

Historical knowledge used to support architecture claims shall be attributable to identifiable source artifacts.

## KPI-006 — AI Acceptance

The system should measure the percentage of AI suggestions accepted, edited, or rejected so prompt and retrieval quality can improve over time.

## KPI-007 — Design-System Adoption

Production feature pages shall use the local design system for recurring UI patterns. Duplicate style recipes in feature code should be treated as design-system defects.

---

# 36. Architecture Guardrails

The following are product-level guardrails for implementation.

1. **Angular never calls OpenAI directly.**
2. **Semantic Kernel is the AI orchestration boundary.**
3. **OpenAI SDK/provider types do not leak into domain models.**
4. **Structured engagement facts are authoritative over generated prose.**
5. **AI-generated records require validation/review before approval.**
6. **RAG retrieval must honor engagement and confidentiality boundaries.**
7. **Historical AI claims require citations.**
8. **Prompts are versioned application assets and follow SCRUB.**
9. **Feature pages consume `/src/web/design-system/`; they do not create parallel visual systems.**
10. **Common Tailwind/CSS combinations are promoted into semantic design-system APIs.**
11. **Long-running generation and ingestion operations have persisted state and retry-safe behavior.**
12. **AI failures may degrade AI capability but must not endanger structured engagement data.**
13. **Approved artifact versions are immutable; new changes create new versions.**
14. **Every AI-assisted artifact retains enough provenance to explain how it was created.**

---

# 37. North-Star User Journey

1. Architect creates a new engagement.
2. Architect selects an engagement template.
3. Lake Shore Drive creates the baseline discovery plan and deliverable structure.
4. Architect conducts discovery in the Angular workbench.
5. AI proposes missing questions and candidate requirements.
6. Architect reviews and approves requirements.
7. AI recommends applicable architecture patterns with alternatives and tradeoffs.
8. Architect selects patterns and records decisions.
9. Lake Shore Drive drafts ADRs.
10. Architect approves ADRs.
11. AI proposes risks, assumptions, issues, and dependencies.
12. Architect builds or reviews estimates using reusable models and historical comparables.
13. Lake Shore Drive assembles the consulting package from approved structured data.
14. Semantic Kernel retrieves approved historical context and orchestrates OpenAI generation section by section.
15. Citations appear beside historical claims and can be inspected in the Angular UI.
16. Architect edits, regenerates, compares, and approves individual sections.
17. Lake Shore Drive exports client-facing deliverables.
18. Lake Shore Drive generates repository bootstrap documentation and microstep SCRUB implementation prompts.
19. Delivery begins with requirements, ADRs, architecture guidance, and prompts already aligned.
20. At engagement close, approved reusable knowledge is curated into the knowledge base.
21. The next engagement can discover and reuse those patterns, estimates, decisions, and lessons learned.

---

# 38. Product Definition

Project Lake Shore Drive is not primarily a proposal generator, a RAG chatbot, or an AI text editor.

It is an **AI-assisted architecture operating system for consulting delivery**.

Its differentiator is the combination of:

- Structured consulting workflow
- Architecture traceability
- Reusable architecture knowledge
- Governed RAG
- Citation-aware AI assistance
- Semantic Kernel orchestration
- OpenAI-powered generation
- SCRUB-based implementation prompting
- A production Angular 22 workbench
- A first-class local design system
- Human review and approval
- Repository-ready delivery artifacts

The intended end state is a system that captures **how an architect thinks, decides, communicates, estimates, and hands work to delivery teams**—then makes that knowledge reusable without pretending the AI is the architect.
