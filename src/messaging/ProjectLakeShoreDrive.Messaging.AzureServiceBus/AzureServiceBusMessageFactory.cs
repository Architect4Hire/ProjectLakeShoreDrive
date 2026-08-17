using System.Diagnostics;
using Azure.Messaging.ServiceBus;
using ProjectLakeShoreDrive.Messaging.Abstractions;

namespace ProjectLakeShoreDrive.Messaging.AzureServiceBus;

// Pure translation from a prepared message to a ServiceBusMessage, kept separate from
// AzureServiceBusIntegrationEventPublisher so the resulting message metadata (IDs,
// application properties, trace context) can be unit-tested at this adapter boundary
// without a live ServiceBusClient/broker.
public static class AzureServiceBusMessageFactory
{
    public static ServiceBusMessage Create(PreparedIntegrationMessage message, Activity? activity = null)
    {
        ArgumentNullException.ThrowIfNull(message);

        var busMessage = new ServiceBusMessage(message.Body)
        {
            MessageId = message.MessageId.ToString(),
            CorrelationId = message.CorrelationId.ToString(),
            ContentType = message.ContentType,
        };

        busMessage.ApplicationProperties["EventType"] = message.EventType;
        busMessage.ApplicationProperties["EventVersion"] = message.EventVersion;

        if (message.CausationId is { } causationId)
        {
            busMessage.ApplicationProperties["CausationId"] = causationId.ToString();
        }

        if (message.BusinessKey is not null)
        {
            busMessage.ApplicationProperties["BusinessKey"] = message.BusinessKey;
        }

        if (activity is not null)
        {
            busMessage.ApplicationProperties["traceparent"] = activity.Id;

            if (!string.IsNullOrEmpty(activity.TraceStateString))
            {
                busMessage.ApplicationProperties["tracestate"] = activity.TraceStateString;
            }
        }

        return busMessage;
    }
}
