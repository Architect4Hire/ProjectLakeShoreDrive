using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Data;

public sealed class EngagementUnitOfWork : IEngagementUnitOfWork
{
    private readonly EngagementDbContext _dbContext;

    public EngagementUnitOfWork(EngagementDbContext dbContext)
    {
        _dbContext = dbContext;
        Engagements = new EngagementRepository(dbContext);
    }

    public IEngagementRepository Engagements { get; }

    public async Task<EngagementSaveOutcome> SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
            return EngagementSaveOutcome.Saved;
        }
        catch (DbUpdateConcurrencyException)
        {
            return EngagementSaveOutcome.ConcurrencyConflict;
        }
    }
}
