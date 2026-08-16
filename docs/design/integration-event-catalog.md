# Project Lake Shore Drive — Initial Integration Event Catalog

**Status:** Candidate catalog. Events become contracts only when a consuming need exists.

## Envelope

All integration events should use a common envelope containing:

```text
eventId
eventType
eventVersion
occurredUtc
producer
correlationId
causationId
businessKey
payload
```

## Engagement events

### EngagementPhaseChanged.v1

Published when an engagement's approved phase changes and another bounded context requires that fact.

Payload:

```text
engagementId
previousPhase
newPhase
changedBy
changedUtc
```

### RequirementApproved.v1

Used when downstream document generation, impact analysis or knowledge workflows need to react to approval.

### RequirementChanged.v1

Signals that an already-approved requirement changed and dependent artifacts may require review.

### AdrAccepted.v1

Signals acceptance of an architectural decision.

### EngagementClosed.v1

Allows knowledge-governance workflows to identify material eligible for curation.

## Knowledge events

### SourceArtifactRegistered.v1

Signals a newly registered source artifact that may need extraction/ingestion.

### KnowledgeIngestionRequested.v1

Starts durable extraction, chunking, embedding and indexing.

### KnowledgeRecordApproved.v1

Signals that reusable knowledge became eligible for broader retrieval.

### KnowledgeRecordDeprecated.v1

Signals that content must stop being automatically recommended.

## Document and generation events

### PackageGenerationRequested.v1

Starts a long-lived consulting-package workflow.

### DocumentSectionGenerationRequested.v1

Starts section generation when execution is intentionally asynchronous.

### GenerationCompleted.v1

Represents successful completion of a generation operation.

### GenerationFailed.v1

Represents terminal failure after bounded retries.

### DocumentApproved.v1

Signals client/repository export eligibility.

### ExportRequested.v1

Starts a durable export operation.

## Events that should usually NOT exist

Do not create integration events for ordinary queries such as:

- GetEngagement
- SearchPatterns
- GetRequirement
- GetDocumentSection
- ValidateTemplate

These are synchronous capabilities and should remain HTTP/query operations unless a specific asynchronous projection need is established.
