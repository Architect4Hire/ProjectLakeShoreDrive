using System.Diagnostics;
using ProjectLakeShoreDrive.Messaging.Abstractions;
using ProjectLakeShoreDrive.Messaging.AzureServiceBus;

namespace ProjectLakeShoreDrive.Messaging.AzureServiceBus.Tests;

public class AzureServiceBusMessageFactoryTests
{
    private static PreparedIntegrationMessage BuildMessage(Guid? causationId = null, string? businessKey = "engagement-42") => new(
        MessageId: Guid.Parse("11111111-1111-1111-1111-111111111111"),
        Body: """{"eventType":"EngagementPhaseChanged"}""",
        ContentType: "application/json",
        EventType: "EngagementPhaseChanged",
        EventVersion: 1,
        CorrelationId: Guid.Parse("22222222-2222-2222-2222-222222222222"),
        CausationId: causationId,
        BusinessKey: businessKey);

    [Fact]
    public void Create_PropagatesMessageIdAsBrokerMessageId()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage());

        Assert.Equal("11111111-1111-1111-1111-111111111111", busMessage.MessageId);
    }

    [Fact]
    public void Create_PropagatesCorrelationId()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage());

        Assert.Equal("22222222-2222-2222-2222-222222222222", busMessage.CorrelationId);
    }

    [Fact]
    public void Create_SetsContentTypeAndBody()
    {
        var prepared = BuildMessage();

        var busMessage = AzureServiceBusMessageFactory.Create(prepared);

        Assert.Equal(prepared.ContentType, busMessage.ContentType);
        Assert.Equal(prepared.Body, busMessage.Body.ToString());
    }

    [Fact]
    public void Create_SetsEventTypeAndEventVersionApplicationProperties()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage());

        Assert.Equal("EngagementPhaseChanged", busMessage.ApplicationProperties["EventType"]);
        Assert.Equal(1, busMessage.ApplicationProperties["EventVersion"]);
    }

    [Fact]
    public void Create_SetsCausationIdApplicationProperty_WhenPresent()
    {
        var causationId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(causationId: causationId));

        Assert.Equal(causationId.ToString(), busMessage.ApplicationProperties["CausationId"]);
    }

    [Fact]
    public void Create_OmitsCausationIdApplicationProperty_WhenAbsent()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(causationId: null));

        Assert.False(busMessage.ApplicationProperties.ContainsKey("CausationId"));
    }

    [Fact]
    public void Create_SetsBusinessKeyApplicationProperty_WhenPresent()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(businessKey: "engagement-42"));

        Assert.Equal("engagement-42", busMessage.ApplicationProperties["BusinessKey"]);
    }

    [Fact]
    public void Create_OmitsBusinessKeyApplicationProperty_WhenAbsent()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(businessKey: null));

        Assert.False(busMessage.ApplicationProperties.ContainsKey("BusinessKey"));
    }

    [Fact]
    public void Create_PropagatesTraceContext_WhenActivityIsProvided()
    {
        using var activitySource = new ActivitySource(nameof(Create_PropagatesTraceContext_WhenActivityIsProvided));
        using var listener = new ActivityListener
        {
            ShouldListenTo = _ => true,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
        };
        ActivitySource.AddActivityListener(listener);

        using var activity = activitySource.StartActivity("publish");
        Assert.NotNull(activity);

        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(), activity);

        Assert.Equal(activity!.Id, busMessage.ApplicationProperties["traceparent"]);
    }

    [Fact]
    public void Create_OmitsTraceContext_WhenNoActivityIsProvided()
    {
        var busMessage = AzureServiceBusMessageFactory.Create(BuildMessage(), activity: null);

        Assert.False(busMessage.ApplicationProperties.ContainsKey("traceparent"));
    }
}
