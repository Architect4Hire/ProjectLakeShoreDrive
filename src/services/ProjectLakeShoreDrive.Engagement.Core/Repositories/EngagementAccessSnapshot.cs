using ProjectLakeShoreDrive.Engagement.Core.Domain;

namespace ProjectLakeShoreDrive.Engagement.Core.Repositories;

// Minimal projection an authorization check needs: does the engagement exist, what phase is
// it in, and who is a recognized member. MemberIdentifiers is derived from stakeholder emails
// and lifecycle-history actors (ADR-0011 defers real owner/member modeling for the Engagement
// aggregate; this is the best available proxy until that domain change lands).
public sealed record EngagementAccessSnapshot(
    Guid Id,
    EngagementStatus Status,
    IReadOnlyList<string> MemberIdentifiers);
