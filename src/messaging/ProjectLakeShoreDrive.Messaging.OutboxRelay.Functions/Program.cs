using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddOutboxRelayHost(builder.Configuration);

builder.Build().Run();
