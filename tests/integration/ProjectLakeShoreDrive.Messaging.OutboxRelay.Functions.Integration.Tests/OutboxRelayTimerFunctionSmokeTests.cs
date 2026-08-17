using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Shared.Persistence.Outbox;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions.Integration.Tests;

// Local smoke test: composes the real host DI (AddOutboxRelayHost) against real SQL
// Server (LocalDB), swaps only the publisher for a fake (no Docker/Service Bus emulator
// available in this environment), and runs OutboxRelayTimerFunction exactly as the Azure
// Functions runtime would invoke it, end to end.
public sealed class OutboxRelayTimerFunctionSmokeTests : IAsyncLifetime
{
    private readonly string _connectionString =
        $"Server=(localdb)\\MSSQLLocalDB;Database=lsd_relay_functions_smoke_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True";

    private ServiceProvider _provider = null!;

    public async Task InitializeAsync()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:OutboxDatabase"] = _connectionString,
                ["ConnectionStrings:ServiceBus"] = "Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=x;SharedAccessKey=y",
                ["OutboxRelay:LeaseOwner"] = "smoke-test-relay",
                ["OutboxRelay:DestinationName"] = "engagement-events",
                ["OutboxRelay:BatchSize"] = "10",
            })
            .Build();

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOutboxRelayHost(configuration);

        // Replace the real Azure Service Bus publisher registration; the fake shadows it
        // because the last registration wins on single-instance resolution.
        services.AddSingleton<IIntegrationEventPublisher, FakeIntegrationEventPublisher>();
        // Scoped, matching OutboxRelay/OutboxRepository's own lifetime — the Functions
        // isolated worker resolves a function class per invocation scope the same way.
        services.AddScoped<OutboxRelayTimerFunction>();

        _provider = services.BuildServiceProvider();

        await using var scope = _provider.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<OutboxDbContext>();
        await context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await using var scope = _provider.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<OutboxDbContext>();
        await context.Database.EnsureDeletedAsync();

        await _provider.DisposeAsync();
    }

    private static OutboxMessage NewMessage(DateTimeOffset createdAtUtc) => new()
    {
        Id = Guid.NewGuid(),
        EventType = "EngagementPhaseChanged",
        EventVersion = 1,
        PayloadJson = """{"engagementId":"engagement-42"}""",
        CorrelationId = Guid.NewGuid(),
        Producer = "Engagement",
        OccurredAtUtc = createdAtUtc,
        CreatedAtUtc = createdAtUtc,
    };

    [Fact]
    public async Task RunAsync_PublishesSeededOutboxRow_ThroughTheFullyComposedHost()
    {
        var message = NewMessage(DateTimeOffset.UtcNow);

        await using (var seedScope = _provider.CreateAsyncScope())
        {
            var context = seedScope.ServiceProvider.GetRequiredService<OutboxDbContext>();
            context.OutboxMessages.Add(message);
            await context.SaveChangesAsync();
        }

        await using var scope = _provider.CreateAsyncScope();
        var function = scope.ServiceProvider.GetRequiredService<OutboxRelayTimerFunction>();

        await function.RunAsync(timer: null!, CancellationToken.None);

        await using var verifyScope = _provider.CreateAsyncScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<OutboxDbContext>();
        var stored = await verifyContext.OutboxMessages.SingleAsync(m => m.Id == message.Id);

        Assert.Equal(OutboxMessageStatus.Dispatched, stored.Status);

        var publisher = (FakeIntegrationEventPublisher)scope.ServiceProvider.GetRequiredService<IIntegrationEventPublisher>();
        var call = Assert.Single(publisher.Calls);
        Assert.Equal(message.Id, call.Message.MessageId);
        Assert.Equal("engagement-events", call.Destination.Name);
    }

    [Fact]
    public async Task RunAsync_WithNoPendingMessages_CompletesWithoutError()
    {
        await using var scope = _provider.CreateAsyncScope();
        var function = scope.ServiceProvider.GetRequiredService<OutboxRelayTimerFunction>();

        await function.RunAsync(timer: null!, CancellationToken.None);
    }
}
