using ProjectLakeShoreDrive.Engagement.Core.Data;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Tests.Fakes;

public sealed class FakeEngagementUnitOfWork : IEngagementUnitOfWork
{
    public FakeEngagementRepository FakeEngagements { get; } = new();

    public IEngagementRepository Engagements => FakeEngagements;

    // Lets a test reproduce a ConcurrencyConflict outcome without a real SQL race.
    public EngagementSaveOutcome NextSaveOutcome { get; set; } = EngagementSaveOutcome.Saved;

    public int SaveChangesCallCount { get; private set; }

    public Task<EngagementSaveOutcome> SaveChangesAsync(CancellationToken cancellationToken)
    {
        SaveChangesCallCount++;
        return Task.FromResult(NextSaveOutcome);
    }
}
