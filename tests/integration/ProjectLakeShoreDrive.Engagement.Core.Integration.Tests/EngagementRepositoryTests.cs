using Microsoft.EntityFrameworkCore;
using ProjectLakeShoreDrive.Engagement.Core.Domain;
using ProjectLakeShoreDrive.Engagement.Core.Persistence;
using ProjectLakeShoreDrive.Engagement.Core.Repositories;

namespace ProjectLakeShoreDrive.Engagement.Core.Integration.Tests;

// Runs against a real SQL Server (LocalDB) instance (database.md: "Do not treat EF InMemory
// as proof of SQL behavior"), proving the repository's projection, archive-exclusion,
// ordering, pagination, and search behavior against the actual mapped schema.
public sealed class EngagementRepositoryTests : IAsyncLifetime
{
    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_engagement_repo_tests_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

    private EngagementDbContext _context = null!;

    public async Task InitializeAsync()
    {
        _context = CreateContext();
        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.DisposeAsync();
    }

    private EngagementDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<EngagementDbContext>()
            .UseSqlServer(_connectionString)
            .Options;

        return new EngagementDbContext(options);
    }

    private static Domain.Engagement NewEngagement(
        string name,
        string clientName,
        EngagementStatus status = EngagementStatus.Draft,
        DateTimeOffset? createdAtUtc = null,
        string businessProblem = "Legacy platform cannot scale.")
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), clientName),
            name,
            EngagementType.CloudMigration,
            businessProblem,
            EngagementConfidentiality.ClientConfidential,
            createdAtUtc: createdAtUtc);

        if (status != EngagementStatus.Draft)
        {
            engagement.TransitionTo(EngagementStatus.Discovery, "pm@architect4hire.com");
            if (status == EngagementStatus.Archived)
            {
                engagement.Archive("pm@architect4hire.com");
            }
        }

        return engagement;
    }

    [Fact]
    public async Task ListAsync_ExcludesArchived_ByDefault()
    {
        var active = NewEngagement("Active Engagement", "Contoso");
        var archived = NewEngagement("Archived Engagement", "Contoso", EngagementStatus.Archived);
        _context.Engagements.AddRange(active, archived);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var page = await repository.ListAsync(
            new EngagementListCriteria(Status: null, ClientId: null, IncludeArchived: false, Page: 1, PageSize: 25),
            CancellationToken.None);

        Assert.Equal(1, page.TotalCount);
        Assert.Equal("Active Engagement", Assert.Single(page.Items).Name);
    }

    [Fact]
    public async Task ListAsync_IncludesArchived_WhenRequested()
    {
        var active = NewEngagement("Active Engagement", "Contoso");
        var archived = NewEngagement("Archived Engagement", "Contoso", EngagementStatus.Archived);
        _context.Engagements.AddRange(active, archived);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var page = await repository.ListAsync(
            new EngagementListCriteria(Status: null, ClientId: null, IncludeArchived: true, Page: 1, PageSize: 25),
            CancellationToken.None);

        Assert.Equal(2, page.TotalCount);
    }

    [Fact]
    public async Task ListAsync_FiltersByStatusAndClientId()
    {
        var contoso = NewEngagement("Contoso Discovery", "Contoso", EngagementStatus.Discovery);
        var fabrikam = NewEngagement("Fabrikam Draft", "Fabrikam");
        _context.Engagements.AddRange(contoso, fabrikam);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);

        var byStatus = await repository.ListAsync(
            new EngagementListCriteria(EngagementStatus.Discovery, null, false, 1, 25), CancellationToken.None);
        Assert.Equal("Contoso Discovery", Assert.Single(byStatus.Items).Name);

        var byClient = await repository.ListAsync(
            new EngagementListCriteria(null, fabrikam.Client.ClientId, false, 1, 25), CancellationToken.None);
        Assert.Equal("Fabrikam Draft", Assert.Single(byClient.Items).Name);
    }

    [Fact]
    public async Task ListAsync_OrdersDeterministically_AndPagesDisjointly()
    {
        var createdAt = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);
        var engagements = Enumerable.Range(0, 30)
            .Select(i => NewEngagement($"Engagement {i:D2}", "Contoso", createdAtUtc: createdAt))
            .ToList();
        _context.Engagements.AddRange(engagements);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);

        var page1 = await repository.ListAsync(new EngagementListCriteria(null, null, false, 1, 10), CancellationToken.None);
        var page2 = await repository.ListAsync(new EngagementListCriteria(null, null, false, 2, 10), CancellationToken.None);
        var page3 = await repository.ListAsync(new EngagementListCriteria(null, null, false, 3, 10), CancellationToken.None);

        Assert.Equal(30, page1.TotalCount);
        Assert.Equal(10, page1.Items.Count);
        Assert.Equal(10, page2.Items.Count);
        Assert.Equal(10, page3.Items.Count);

        var allIds = page1.Items.Concat(page2.Items).Concat(page3.Items).Select(i => i.Id).ToList();
        Assert.Equal(30, allIds.Distinct().Count());
    }

    [Fact]
    public async Task ListAsync_ClampsOversizedPageSize_To100()
    {
        var engagement = NewEngagement("Solo Engagement", "Contoso");
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var page = await repository.ListAsync(
            new EngagementListCriteria(null, null, false, 1, 500), CancellationToken.None);

        Assert.Equal(100, page.PageSize);
    }

    [Fact]
    public async Task ListAsync_ClampsInvalidPage_To1()
    {
        var engagement = NewEngagement("Solo Engagement", "Contoso");
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var page = await repository.ListAsync(
            new EngagementListCriteria(null, null, false, 0, 25), CancellationToken.None);

        Assert.Equal(1, page.Page);
    }

    [Fact]
    public async Task SearchAsync_MatchesName_ClientName_AndBusinessProblem()
    {
        var byName = NewEngagement("Northwind Migration", "Contoso");
        var byClient = NewEngagement("Cloud Assessment", "Northwind Traders");
        var byProblem = NewEngagement("Assessment", "Fabrikam", businessProblem: "Legacy Northwind billing platform cannot scale.");
        var noMatch = NewEngagement("Unrelated", "Adventure Works", businessProblem: "Needs a modern data platform.");
        _context.Engagements.AddRange(byName, byClient, byProblem, noMatch);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var results = await repository.SearchAsync(
            new EngagementSearchCriteria("Northwind", null, null, false, 1, 25), CancellationToken.None);

        Assert.Equal(3, results.TotalCount);
        Assert.DoesNotContain(results.Items, i => i.Name == "Unrelated");
    }

    [Fact]
    public async Task SearchAsync_TreatsLikeWildcards_AsLiteralText()
    {
        var withPercent = NewEngagement("50% Migration", "Contoso");
        var withoutPercent = NewEngagement("Full Migration", "Contoso");
        _context.Engagements.AddRange(withPercent, withoutPercent);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var results = await repository.SearchAsync(
            new EngagementSearchCriteria("50%", null, null, false, 1, 25), CancellationToken.None);

        Assert.Equal("50% Migration", Assert.Single(results.Items).Name);
    }

    [Fact]
    public async Task SearchAsync_ExcludesArchived_ByDefault()
    {
        var archived = NewEngagement("Northwind Archived", "Contoso", EngagementStatus.Archived);
        _context.Engagements.Add(archived);
        await _context.SaveChangesAsync();

        var repository = new EngagementRepository(_context);
        var results = await repository.SearchAsync(
            new EngagementSearchCriteria("Northwind", null, null, false, 1, 25), CancellationToken.None);

        Assert.Equal(0, results.TotalCount);
    }

    [Fact]
    public async Task GetAsync_ReturnsTrackedEngagement_WithStakeholdersAndHistory()
    {
        var engagement = Domain.Engagement.Create(
            new ClientReference(Guid.NewGuid(), "Contoso"),
            "Contoso Migration",
            EngagementType.CloudMigration,
            "Legacy platform cannot scale.",
            EngagementConfidentiality.ClientConfidential,
            stakeholders: [new Stakeholder("Jane Doe", "VP Engineering")]);
        engagement.TransitionTo(EngagementStatus.Discovery, "pm@architect4hire.com");
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        var repository = new EngagementRepository(verifyContext);
        var loaded = await repository.GetAsync(engagement.Id, CancellationToken.None);

        Assert.NotNull(loaded);
        Assert.Single(loaded!.Stakeholders);
        Assert.Single(loaded.LifecycleHistory);
        Assert.Equal(EntityState.Unchanged, verifyContext.Entry(loaded).State);
    }

    [Fact]
    public async Task GetForReadAsync_ReturnsDetachedEngagement()
    {
        var engagement = NewEngagement("Contoso Migration", "Contoso");
        _context.Engagements.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        var repository = new EngagementRepository(verifyContext);
        var loaded = await repository.GetForReadAsync(engagement.Id, CancellationToken.None);

        Assert.NotNull(loaded);
        Assert.Equal(EntityState.Detached, verifyContext.Entry(loaded!).State);
    }

    [Fact]
    public async Task GetAsync_ReturnsNull_WhenEngagementDoesNotExist()
    {
        var repository = new EngagementRepository(_context);
        var loaded = await repository.GetAsync(EngagementId.New(), CancellationToken.None);

        Assert.Null(loaded);
    }

    [Fact]
    public async Task Add_PersistsEngagement_OnSaveChanges()
    {
        var engagement = NewEngagement("New Engagement", "Contoso");
        var repository = new EngagementRepository(_context);

        repository.Add(engagement);
        await _context.SaveChangesAsync();

        await using var verifyContext = CreateContext();
        Assert.NotNull(await verifyContext.Engagements.SingleOrDefaultAsync(e => e.Id == engagement.Id));
    }
}
