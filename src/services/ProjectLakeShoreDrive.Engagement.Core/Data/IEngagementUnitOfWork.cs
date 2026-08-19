using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Data;

public enum EngagementSaveOutcome
{
    Saved,
    ConcurrencyConflict
}

// Transaction boundary and repository composition for the Engagement domain (TR-DATA-001).
// The only layer where an EF exception is visible; it is converted here into a typed outcome
// so Business/Facade/Controller never see DbUpdateConcurrencyException directly.
public interface IEngagementUnitOfWork
{
    IEngagementRepository Engagements { get; }

    Task<EngagementSaveOutcome> SaveChangesAsync(CancellationToken cancellationToken);
}
