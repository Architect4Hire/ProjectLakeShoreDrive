namespace ProjectLakeShoreDrive.Shared.Persistence.Inbox;

public sealed record InboxProcessingResult(MessageProcessingOutcome Outcome, string? FailureReason = null);
