---
paths:
  - "src/**/*.cs"
---

# Messaging, outbox and inbox rules

Azure Service Bus is for temporal decoupling, cross-domain state propagation, fan-out and durable asynchronous processing.

Do not use request/reply messaging for ordinary queries.

## Transactional outbox

A service that mutates durable state and publishes a resulting integration event SHALL:

1. persist business state;
2. persist the outbox envelope;
3. commit both in one local DB transaction;
4. publish later through the outbox relay.

Never publish that transactional event directly from Controller, Facade, Business or Repository.

The relay:

- selects pending items safely;
- publishes with stable message ID;
- records attempts/failure metadata;
- marks dispatched only after broker acknowledgement;
- tolerates duplicate publication.

## Consumers

Every consumer is idempotent.

Use a transactional inbox when message processing changes durable state and duplicate effects could be harmful.

Inbox processing should:

1. identify stable message ID;
2. begin local transaction;
3. detect/record processing state;
4. execute durable business work;
5. record completion;
6. commit atomically.

Do not use Redis alone for durable duplicate detection.

## Envelope

Carry:

- message ID;
- correlation ID;
- causation ID if known;
- event name;
- version;
- occurred-at UTC;
- producer;
- relevant business key.

Events describe facts in past tense.

Failures must surface to broker retry/dead-letter behavior; do not catch/log/return success when work failed.
