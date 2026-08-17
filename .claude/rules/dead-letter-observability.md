# Dead-Letter Observability and Triage

## Intent

Provide operational abstractions for observing and triaging messages that have been moved to the Azure Service Bus dead-letter queue (DLQ), without auto-replay. Enables operators to diagnose failures and determine whether messages are eligible for manual replay.

**Requirement:** OPS-002 (Application Telemetry)

## Scope

- **What is tracked:** Every message that reaches the DLQ is recorded with full metadata, failure reason, correlation IDs, timestamps, and attempt count.
- **What is NOT tracked:** Business-logic state or side effects related to the message. Dead-letter records are purely operational.
- **What is NOT supported:** Automatic message replay. Triage results in "eligible for replay" or "ineligible"; operators decide whether to replay.

## Architecture

### DeadLetteredMessage Entity

Stores durable records of messages moved to the DLQ:

```
MessageId (PK)
CorrelationId
CausationId
EventType, EventVersion
Consumer (subscription that failed)
Producer (service that published)
OccurredAtUtc, ReceivedAtUtc, DeadLetteredAtUtc
AttemptCount
DeadLetterReason (e.g., "timeout", "deserialization", "max-delivery-exceeded")
DeadLetterDescription (failure details)
BusinessKey (optional; e.g., aggregate ID for domain-level impact analysis)
TriageStatus (Unreviewed → Diagnosis → EligibleForReplay | IneligibleForReplay → Resolved)
TriageNotes (operator's notes during review)
ReviewedBy, ReviewedAtUtc (audit trail)
```

### IDeadLetterRegistry Interface

Application abstraction for recording and querying dead-lettered messages:

```csharp
Task RecordDeadLetteredMessageAsync(...)  // Idempotent; safe to call multiple times
Task<DeadLetteredMessage?> GetByMessageIdAsync(messageId)
Task<IReadOnlyList<DeadLetteredMessage>> GetUnreviewedAsync()
Task<IReadOnlyList<DeadLetteredMessage>> GetByConsumerAsync(consumer)
Task<IReadOnlyList<DeadLetteredMessage>> GetByBusinessKeyAsync(businessKey)
Task UpdateTriageAsync(messageId, status, notes, reviewedBy)
Task<IReadOnlyList<DeadLetteredMessage>> GetEligibleForReplayAsync()
```

### DeadLetterRegistry Implementation

Default in-process implementation. Each bounded domain owns its own `DeadLetterRegistry` and dead-letter records (per the CLAUDE.md domain-ownership rule). Registries are injected as dependencies.

### DeadLetterTriageService

Stateless analysis service that examines a dead-lettered message and provides guidance about replay eligibility. Analyzes:

- **Attempt count:** Messages with 10+ attempts suggest systemic issues.
- **Failure reason:** Classifies as likely-transient (timeout, network) or likely-permanent (deserialization, schema, authorization, not found).
- **Time since DLQ:** Messages aged >24 hours warrant caution due to system state drift.

Returns `DeadLetterTriageGuidance` with `LikelyEligibleForReplay` bool and structured reasoning. **Guidance is NOT a decision.** Operators read the guidance and update triage state manually.

## Usage

### Recording a Dead-Lettered Message

When a message handler exhausts retries or explicitly fails permanently, record it:

```csharp
// In a message handler or consumer trigger that detects permanent failure:
var registry = serviceProvider.GetRequiredService<IDeadLetterRegistry>();

await registry.RecordDeadLetteredMessageAsync(
    messageId: message.MessageId,
    correlationId: message.CorrelationId ?? Guid.NewGuid(),
    causationId: /* if known */,
    eventType: message.Properties["EventType"] as string,
    eventVersion: int.Parse(message.Properties["EventVersion"] as string),
    consumer: "MySubscriptionName",
    producer: message.Properties["Producer"] as string,
    occurredAtUtc: /* when event occurred */,
    receivedAtUtc: message.LockedUntil, // or receiver timestamp
    attemptCount: /* delivery count */,
    deadLetterReason: message.DeadLetterReason,
    deadLetterDescription: message.DeadLetterErrorDescription,
    businessKey: /* aggregate ID if applicable */);
```

Recording is **idempotent:** calling it twice for the same `MessageId` is safe.

### Analyzing Triage Eligibility

Query unreviewed messages and analyze:

```csharp
var registry = serviceProvider.GetRequiredService<IDeadLetterRegistry>();
var triageService = new DeadLetterTriageService();

var unreviewed = await registry.GetUnreviewedAsync(maxResults: 10);

foreach (var message in unreviewed)
{
    var guidance = triageService.AnalyzeForReplayEligibility(message);
    
    Console.WriteLine($"Message {message.MessageId}:");
    Console.WriteLine($"  Likely eligible: {guidance.LikelyEligibleForReplay}");
    Console.WriteLine($"  Reasoning: {guidance.Reasoning}");
    
    // Operator makes explicit decision and records it:
    if (/* operator approves replay */)
    {
        await registry.UpdateTriageAsync(
            messageId: message.MessageId,
            triageStatus: DeadLetterTriageStatus.EligibleForReplay,
            triageNotes: "Service recovered; approved for replay.",
            reviewedBy: "ops-team");
    }
    else
    {
        await registry.UpdateTriageAsync(
            messageId: message.MessageId,
            triageStatus: DeadLetterTriageStatus.IneligibleForReplay,
            triageNotes: "Malformed payload; awaiting fix in upstream service.",
            reviewedBy: "ops-team");
    }
}
```

### Querying for Operations

```csharp
// Find all unreviewed messages
var unreviewed = await registry.GetUnreviewedAsync();

// Find messages eligible for replay (operators can inspect and decide)
var eligible = await registry.GetEligibleForReplayAsync();

// Find all messages from a specific subscription
var consumerMessages = await registry.GetByConsumerAsync("OrderProcessor");

// Find all messages affecting a specific aggregate
var orderMessages = await registry.GetByBusinessKeyAsync("order-12345");

// Find messages in a specific triage status
var inDiagnosis = await registry.GetByTriageStatusAsync(DeadLetterTriageStatus.Diagnosis);
```

## Dependency Injection

Register in the service's composition:

```csharp
services.AddScoped<IDeadLetterRegistry>(sp =>
    new DeadLetterRegistry(sp.GetRequiredService<MyServiceDbContext>()));
```

## Triage Status State Machine

```
Unreviewed ──> Diagnosis ──> EligibleForReplay ──> Resolved
                     ├────> IneligibleForReplay ──> Resolved
```

- **Unreviewed:** Message just recorded; not yet reviewed.
- **Diagnosis:** Operator is investigating.
- **EligibleForReplay:** Operator determined replay is safe (but did NOT auto-replay).
- **IneligibleForReplay:** Operator determined replay is unsafe (e.g., message is malformed, side effects already occurred).
- **Resolved:** Message was replayed, alternative action taken, or deemed not actionable.

## Constraints

1. **No auto-replay.** The registry does NOT replay messages automatically. Triage results in eligibility determination; operators make replay decisions.
2. **No cross-domain DLQ.** Each bounded domain owns and queries its own dead-letter records. No shared cross-domain DLQ table.
3. **Idempotent recording.** Recording the same message twice (same `MessageId`) is safe; duplicate insertion is silently ignored.
4. **Concurrency-safe triage.** Triage state updates use optimistic concurrency (`RowVersion`); concurrent edits are detected and reported.
5. **Metadata-first.** The record captures operational metadata, not business state or payloads.

## Observability Integration

Include dead-letter triage in operations dashboards:

- Count unreviewed messages by consumer.
- Age of oldest unreviewed message (SLO: max 2 hours).
- Replay eligibility rate (% of messages marked `EligibleForReplay`).
- Triage completion time (time from DLQ to `Resolved` status).

Log structured events when messages are recorded or triaged, including correlation ID and business key for domain-level tracing.

## Testing

### Configuration Tests

Test EF mapping, indexes, nullability, and concurrency tokens:

```csharp
[Fact]
public void DeadLetteredMessage_HasMessageIdAsPrimaryKey() { ... }

[Fact]
public void DeadLetteredMessage_RowVersion_IsConfiguredAsConcurrencyToken() { ... }

[Fact]
public void DeadLetteredMessage_HasIndexOnTriageStatusAndDeadLetteredAtUtc() { ... }
```

### Registry Contract Tests

Test recording, retrieval, idempotence, and triage updates:

```csharp
[Fact]
public async Task RecordDeadLetteredMessageAsync_IsIdempotent() { ... }

[Fact]
public async Task GetUnreviewedAsync_ReturnsUnreviewedMessagesInOrder() { ... }

[Fact]
public async Task UpdateTriageAsync_UpdatesStatusAndNotes() { ... }
```

### Triage Service Tests

Test heuristic analysis for various failure reasons:

```csharp
[Fact]
public void AnalyzeForReplayEligibility_TimeoutError_SuggestsEligible() { ... }

[Fact]
public void AnalyzeForReplayEligibility_DeserializationError_SuggestsIneligible() { ... }
```

## Example: Operations Page

An Angular operations page could display unreviewed messages:

```angular
@if (unreviewed$ | async as messages) {
  <table>
    @for (msg of messages; track msg.messageId) {
      <tr>
        <td>{{ msg.messageId }}</td>
        <td>{{ msg.consumer }}</td>
        <td>{{ msg.deadLetterReason }}</td>
        <td>{{ msg.attemptCount }} attempts</td>
        <td>
          @if (guidance$ | async as g) {
            {{ g.likelyEligibleForReplay ? 'Possibly eligible' : 'Likely ineligible' }}
          }
        </td>
        <td>
          <button (click)="markEligible(msg.messageId)">
            Mark Eligible
          </button>
          <button (click)="markIneligible(msg.messageId)">
            Mark Ineligible
          </button>
        </td>
      </tr>
    }
  </table>
}
```

## See Also

- CLAUDE.md: Domain ownership and bounded-domain rules
- `.claude/rules/messaging.md`: Outbox, inbox, and Service Bus patterns
- `.claude/rules/observability.md`: Correlation and telemetry rules
