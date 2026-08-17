# Dead-Letter Observability Implementation

**Requirement:** OPS-002 Application Telemetry  
**Status:** ✅ Complete  
**Implementation Date:** 2026-08-17

## Overview

This document describes the dead-letter queue (DLQ) observability implementation for Project Lake Shore Drive. The implementation provides operational abstractions for observing, analyzing, and triaging messages that have been moved to the Azure Service Bus dead-letter queue without supporting auto-replay.

## Design Principle

**Observation without auto-replay:** Messages are recorded with complete metadata when they fail permanently. Operators review them, get triage guidance, and make explicit decisions about replay eligibility. The system enables informed decisions but does not automatically take action.

## Components

### 1. Core Entity: `DeadLetteredMessage`

**Location:** `src/ProjectLakeShoreDrive.Shared/Persistence/DeadLetter/DeadLetteredMessage.cs`

A durable SQL record capturing:
- Message dedup identity and correlation
- Event type/version and routing information (consumer, producer)
- Timestamps (occurred, received, dead-lettered, reviewed)
- Failure metadata (attempt count, reason, description)
- Domain context (business key for impact analysis)
- Triage state (status, notes, reviewer)

**Table Schema:** `DeadLetteredMessages`

**Indexes:**
- `(TriageStatus, DeadLetteredAtUtc)` — triage queue lookup
- `(CorrelationId)` — trace correlation
- `(Consumer, DeadLetteredAtUtc)` — consumer grouping
- `(BusinessKey)` — domain-level impact analysis

### 2. Registry Interface: `IDeadLetterRegistry`

**Location:** `src/ProjectLakeShoreDrive.Shared/Persistence/DeadLetter/IDeadLetterRegistry.cs`

Application abstraction with operations:
- `RecordDeadLetteredMessageAsync()` — idempotent insertion
- `GetByMessageIdAsync()` — single-message lookup
- `GetUnreviewedAsync()` — triage queue (oldest first)
- `GetByTriageStatusAsync()` — filter by state
- `GetByConsumerAsync()` — subscriber grouping
- `GetByBusinessKeyAsync()` — domain impact tracing
- `UpdateTriageAsync()` — concurrency-safe triage state update
- `GetEligibleForReplayAsync()` — manual replay candidates

### 3. Registry Implementation: `DeadLetterRegistry`

**Location:** `src/ProjectLakeShoreDrive.Shared/Persistence/DeadLetter/DeadLetterRegistry.cs`

Default in-process implementation using EF Core. Records are persisted in the caller's DbContext, ensuring each bounded domain owns its dead-letter records (no cross-domain sharing per CLAUDE.md rules).

**Key behaviors:**
- Recording is idempotent (duplicate message IDs are silently ignored)
- Queries return read-only lists sorted for operational efficiency
- Triage updates use optimistic concurrency to detect conflicts

### 4. Triage Service: `DeadLetterTriageService`

**Location:** `src/ProjectLakeShoreDrive.Shared/Persistence/DeadLetter/DeadLetterTriageService.cs`

Stateless analysis service providing guidance about replay eligibility. Examines:

| Factor | Interpretation |
|--------|-----------------|
| Attempt count ≥ 10 | Likely systemic issue, ineligible |
| Deserialization/schema error | Payload malformed, ineligible |
| Authorization/permission error | Credentials/roles needed, ineligible |
| Not found error | Resource missing, ineligible |
| Timeout/network error | Likely transient, possibly eligible |
| Age >24 hours | Warn about system state drift |

Returns `DeadLetterTriageGuidance` with `LikelyEligibleForReplay` bool and structured reasoning. **Guidance is not a decision** — operators review it and update triage state manually.

### 5. Triage Status Enum: `DeadLetterTriageStatus`

**Location:** `src/ProjectLakeShoreDrive.Shared/Persistence/DeadLetter/DeadLetterTriageStatus.cs`

State machine for message triage:
```
Unreviewed → Diagnosis → EligibleForReplay → Resolved
                    ├──> IneligibleForReplay → Resolved
```

## Integration Points

### In a Message Consumer

When a message handler exhausts retries or throws a permanent exception:

```csharp
// Catch permanent failure
var registry = /* injected */;
await registry.RecordDeadLetteredMessageAsync(
    messageId: message.MessageId,
    correlationId: message.CorrelationId,
    eventType: message.Properties["EventType"],
    eventVersion: int.Parse(message.Properties["EventVersion"]),
    consumer: "SubscriptionName",
    producer: message.Properties["Producer"],
    occurredAtUtc: message.Properties["OccurredAt"],
    receivedAtUtc: message.ReceivedAt,
    attemptCount: message.DeliveryCount,
    deadLetterReason: message.DeadLetterReason,
    deadLetterDescription: message.DeadLetterErrorDescription,
    businessKey: /* aggregate ID if applicable */);
```

### In an Operations Service

Expose triage capabilities to operators:

```csharp
var registry = /* injected */;
var triageService = new DeadLetterTriageService();

// Get unreviewed messages
var unreviewed = await registry.GetUnreviewedAsync();

foreach (var msg in unreviewed)
{
    var guidance = triageService.AnalyzeForReplayEligibility(msg);
    
    // Operator makes decision based on guidance
    await registry.UpdateTriageAsync(
        messageId: msg.MessageId,
        triageStatus: guidance.LikelyEligibleForReplay 
            ? DeadLetterTriageStatus.EligibleForReplay 
            : DeadLetterTriageStatus.IneligibleForReplay,
        triageNotes: /* operator's reasoning */,
        reviewedBy: /* current user */);
}
```

### EF Core Configuration

Register the entity in the service's DbContext:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfiguration(new DeadLetteredMessageConfiguration());
}
```

### Dependency Injection

```csharp
services.AddScoped<IDeadLetterRegistry>(sp =>
    new DeadLetterRegistry(sp.GetRequiredService<YourServiceDbContext>()));
```

## Test Coverage

### Configuration Tests
- **File:** `tests/unit/ProjectLakeShoreDrive.Shared.Tests/DeadLetteredMessageConfigurationTests.cs`
- **Coverage:** Table mapping, primary key, required/optional fields, nullability, concurrency token, indexes
- **Count:** 12 tests

### Registry Contract Tests
- **File:** `tests/unit/ProjectLakeShoreDrive.Shared.Tests/DeadLetterRegistryTests.cs`
- **Coverage:** Recording (creation, idempotence), retrieval (unreviewed, by status, by consumer, by business key), triage updates, eligibility queries
- **Count:** 11 tests

### Triage Service Tests
- **File:** `tests/unit/ProjectLakeShoreDrive.Shared.Tests/DeadLetterTriageServiceTests.cs`
- **Coverage:** Guidance analysis for various failure types (timeout, network, deserialization, authorization, not found), attempt count heuristics, time-based warnings
- **Count:** 10 tests

**Total:** 33 contract tests validating behavior and data model.

## Observability Hooks

Integrate into operations dashboards and alerts:

- **Unreviewed message count:** Alert if ≥ 10 in any consumer
- **Triage SLO:** Mark as failed if oldest unreviewed exceeds 2 hours
- **Replay rate:** % of messages marked `EligibleForReplay` (trend metric)
- **Triage turnaround:** Time from dead-lettered to `Resolved` status

Include correlation ID and business key in structured logs for domain-level tracing.

## Constraints and Guarantees

1. **No auto-replay.** The system records messages and analyzes replay eligibility but never automatically replays.
2. **Domain ownership.** Each bounded domain owns its own dead-letter records; no cross-domain sharing.
3. **Idempotent recording.** Recording the same message ID twice is safe (ignored on duplicate).
4. **Concurrency-safe triage.** Concurrent triage updates are detected via `RowVersion` and reported as conflicts.
5. **Operational metadata only.** Records capture failure reason and routing, not business payloads or sensitive details.

## Future Enhancements

Out of scope for this seam but noted for planning:

- Manual replay capability (once triage marks a message eligible, an operator can trigger replay)
- Automated alerting for messages stuck in `Diagnosis` status
- Batch operations (mark multiple messages in one operation)
- Dead-letter reason classification (schema version, timeout type, downstream service)
- Analytics queries (failure rate by consumer, most common reasons, replay success rate)

## References

- **CLAUDE.md:** Domain ownership, bounded-domain rules, dependency direction
- **`.claude/rules/messaging.md`:** Outbox, inbox, Service Bus integration patterns
- **`.claude/rules/dead-letter-observability.md`:** Implementation guide and usage examples
- **OPS-002:** Application Telemetry requirement (requirements.md)
