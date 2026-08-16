# Project Lake Shore Drive — AI Orchestration Design

## Boundary

Microsoft Semantic Kernel is the application-level AI orchestration boundary.

Angular never calls OpenAI directly.

Domain code does not depend on provider SDK types.

## Layering

```text
Application Use Case
  → IAiCompletionService / IDocumentGenerationService
    → Semantic Kernel Orchestrator
      → Approved Plugins / Retrieval
      → Provider Adapter
        → OpenAI or Azure OpenAI
```

## Kernel construction

Kernels are created through application-managed factories that apply:

- model profile;
- credentials/configuration;
- telemetry;
- plugin registration;
- authorization context;
- prompt policy;
- structured-output policy;
- retry/timeout policy.

## Candidate plugins

- EngagementPlugin
- DiscoveryPlugin
- RequirementsPlugin
- ArchitecturePatternPlugin
- AdrPlugin
- RaidPlugin
- EstimationPlugin
- KnowledgeSearchPlugin
- CitationPlugin
- DocumentComposerPlugin
- TemplatePlugin

A plugin exposes narrow application functions. It does not expose unrestricted repositories, DbContexts, file systems or arbitrary HTTP.

## SCRUB prompt assets

Each production prompt is versioned and defines:

- PromptId;
- purpose;
- Scope;
- Constraints;
- Restrictions;
- Usage/context inputs;
- Behavior/output contract;
- expected structured schema where applicable;
- allowed plugin set;
- model profile;
- evaluation cases;
- status/version.

## Structured output

Use schema-constrained results for data-producing tasks:

- extracted requirements;
- RAID suggestions;
- architecture recommendations;
- ADR metadata;
- classification;
- section plans;
- impact-analysis candidates.

Free-form prose is appropriate for client-facing drafting, but generated text still retains provenance and review state.

## Authorization

AI functions execute with the requesting user's authorization and engagement boundary.

The model cannot:

- read arbitrary engagements;
- promote knowledge;
- approve requirements/ADRs/documents;
- execute administrative functions;
- bypass retrieval confidentiality filters.

## Audit record

Each meaningful execution records:

- actor;
- engagement;
- operation;
- prompt ID/version;
- model/provider profile;
- source context IDs;
- retrieved citation IDs;
- plugin/function calls;
- output artifact;
- latency/tokens/cost where available;
- validation result;
- review disposition.

## Failure handling

Explicitly classify:

- timeout;
- rate limit;
- invalid structured output;
- provider refusal;
- retrieval failure;
- tool/plugin failure;
- provider outage.

A failed AI execution cannot corrupt approved structured data.
