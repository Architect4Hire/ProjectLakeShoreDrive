using Microsoft.AspNetCore.Authorization;

namespace ProjectLakeShoreDrive.Engagement.Authorization;

// Marker requirement: the caller must be a recognized member of the engagement named by the
// "id" route value (or hold a blanket-authority role, per ADR-0011's matrix).
public sealed class EngagementScopeRequirement : IAuthorizationRequirement;
