using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace ProjectLakeShoreDrive.ServiceDefaults.Tests;

public class ServiceDefaultsTests
{
    [Fact]
    public void AddServiceDefaults_RegistersHealthChecks()
    {
        var builder = Host.CreateApplicationBuilder();

        builder.AddServiceDefaults();

        using var host = builder.Build();

        Assert.NotNull(host.Services.GetService<HealthCheckService>());
    }

    [Fact]
    public void AddServiceDefaults_RegistersOpenTelemetryTracingAndMetrics()
    {
        var builder = Host.CreateApplicationBuilder();

        builder.AddServiceDefaults();

        using var host = builder.Build();

        Assert.NotNull(host.Services.GetService<TracerProvider>());
        Assert.NotNull(host.Services.GetService<MeterProvider>());
    }

    [Fact]
    public void AddServiceDefaults_RegistersCorrelationProblemDetails()
    {
        var builder = Host.CreateApplicationBuilder();

        builder.AddServiceDefaults();

        using var host = builder.Build();

        Assert.NotNull(host.Services.GetService<IProblemDetailsService>());
    }

    [Fact]
    public void AddServiceDefaults_DoesNotThrow_WhenNoTelemetryExporterConfigured()
    {
        var builder = Host.CreateApplicationBuilder();

        var exception = Record.Exception(() =>
        {
            builder.AddServiceDefaults();
            using var host = builder.Build();
        });

        Assert.Null(exception);
    }

    [Fact]
    public void AddServiceDefaults_DoesNotThrow_WhenOtlpExporterConfigured()
    {
        var builder = Host.CreateApplicationBuilder();
        builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"] = "http://localhost:4317";

        var exception = Record.Exception(() =>
        {
            builder.AddServiceDefaults();
            using var host = builder.Build();
        });

        Assert.Null(exception);
    }

    [Fact]
    public void AddServiceDefaults_DoesNotThrow_WhenApplicationInsightsConnectionStringConfigured()
    {
        // The connection string below is a syntactically valid but non-secret placeholder;
        // Azure Monitor wiring must not require a live endpoint to register successfully.
        var builder = Host.CreateApplicationBuilder();
        builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"] =
            "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://example.invalid/";

        var exception = Record.Exception(() =>
        {
            builder.AddServiceDefaults();
            using var host = builder.Build();
        });

        Assert.Null(exception);
    }

    [Fact]
    public void MapDefaultEndpoints_MapsHealthAndAliveEndpoints_InDevelopment()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Environment.EnvironmentName = Environments.Development;
        builder.AddServiceDefaults();

        var app = builder.Build();
        app.MapDefaultEndpoints();

        var paths = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(d => d.Endpoints)
            .OfType<Microsoft.AspNetCore.Routing.RouteEndpoint>()
            .Select(e => e.RoutePattern.RawText)
            .ToList();

        Assert.Contains("/health", paths);
        Assert.Contains("/alive", paths);
    }

    [Fact]
    public void MapDefaultEndpoints_DoesNotMapHealthEndpoints_OutsideDevelopment()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Environment.EnvironmentName = Environments.Production;
        builder.AddServiceDefaults();

        var app = builder.Build();
        app.MapDefaultEndpoints();

        var paths = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(d => d.Endpoints)
            .OfType<Microsoft.AspNetCore.Routing.RouteEndpoint>()
            .Select(e => e.RoutePattern.RawText)
            .ToList();

        Assert.DoesNotContain("/health", paths);
        Assert.DoesNotContain("/alive", paths);
    }
}
