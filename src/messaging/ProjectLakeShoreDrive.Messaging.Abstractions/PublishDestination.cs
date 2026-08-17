namespace ProjectLakeShoreDrive.Messaging.Abstractions;

// Opaque destination name (queue or topic). No ADR yet approves a concrete Service Bus
// entity topology (docs/design/ongoing-architecture-plan.md, item 8), so this type carries
// only what a publisher needs to send somewhere; it does not classify or resolve queue vs.
// topic, and the caller (not the publisher) decides the value.
public sealed record PublishDestination(string Name);
