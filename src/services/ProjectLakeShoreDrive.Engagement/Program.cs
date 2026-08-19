using System.Text.Json.Serialization;
using ProjectLakeShoreDrive.Engagement.Authentication;
using ProjectLakeShoreDrive.Engagement.Authorization;
using ProjectLakeShoreDrive.Engagement.Composition;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services
    .AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEngagementDomain(builder.Configuration);
builder.Services.AddEngagementAuthentication(builder.Environment);
builder.Services.AddEngagementAuthorization();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapDefaultEndpoints();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// Exposes the entry point to WebApplicationFactory<Program> for API integration tests.
public partial class Program;
