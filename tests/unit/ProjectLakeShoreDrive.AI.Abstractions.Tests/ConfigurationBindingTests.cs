using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.AI.Abstractions.Configuration;

namespace ProjectLakeShoreDrive.AI.Abstractions.Tests;

public class ConfigurationBindingTests
{
    private static readonly Dictionary<string, string?> ValidSettings = new()
    {
        ["Ai:ModelProfiles:Extraction:DeploymentName"] = "extraction-deployment",
        ["Ai:ModelProfiles:Reasoning:DeploymentName"] = "reasoning-deployment",
        ["Ai:ModelProfiles:Drafting:DeploymentName"] = "drafting-deployment",
        ["Ai:ModelProfiles:Summarization:DeploymentName"] = "summarization-deployment",
        ["Ai:ModelProfiles:Embeddings:DeploymentName"] = "embeddings-deployment",
        ["Ai:ModelProfiles:Evaluation:DeploymentName"] = "evaluation-deployment",
        ["Ai:SemanticKernel:Endpoint"] = "https://example-resource.openai.azure.com/",
    };

    [Fact]
    public void ModelProfiles_BindFromConfiguration_ByTaskName()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(ValidSettings)
            .Build();

        var services = new ServiceCollection();
        services.AddOptions<AiModelProfilesOptions>()
            .Bind(configuration.GetSection(AiModelProfilesOptions.SectionName));
        services.AddSingleton<IValidateOptions<AiModelProfilesOptions>, AiModelProfilesOptionsValidator>();

        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<IOptions<AiModelProfilesOptions>>().Value;

        Assert.Equal("extraction-deployment", options.Extraction.DeploymentName);
        Assert.Equal("reasoning-deployment", options.Reasoning.DeploymentName);
        Assert.Equal("drafting-deployment", options.Drafting.DeploymentName);
        Assert.Equal("summarization-deployment", options.Summarization.DeploymentName);
        Assert.Equal("embeddings-deployment", options.Embeddings.DeploymentName);
        Assert.Equal("evaluation-deployment", options.Evaluation.DeploymentName);
    }

    [Fact]
    public void ModelProfiles_FailsValidation_WhenBoundFromIncompleteConfiguration()
    {
        var incompleteSettings = new Dictionary<string, string?>
        {
            ["Ai:ModelProfiles:Extraction:DeploymentName"] = "extraction-deployment"
            // Remaining task profiles intentionally omitted.
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(incompleteSettings)
            .Build();

        var services = new ServiceCollection();
        services.AddOptions<AiModelProfilesOptions>()
            .Bind(configuration.GetSection(AiModelProfilesOptions.SectionName));
        services.AddSingleton<IValidateOptions<AiModelProfilesOptions>, AiModelProfilesOptionsValidator>();

        using var provider = services.BuildServiceProvider();

        Assert.Throws<OptionsValidationException>(() =>
            provider.GetRequiredService<IOptions<AiModelProfilesOptions>>().Value);
    }

    [Fact]
    public void SemanticKernelOptions_BindsEndpointFromConfiguration()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(ValidSettings)
            .Build();

        var services = new ServiceCollection();
        services.AddOptions<SemanticKernelOptions>()
            .Bind(configuration.GetSection(SemanticKernelOptions.SectionName));
        services.AddSingleton<IValidateOptions<SemanticKernelOptions>, SemanticKernelOptionsValidator>();

        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<IOptions<SemanticKernelOptions>>().Value;

        Assert.Equal(new Uri("https://example-resource.openai.azure.com/"), options.Endpoint);
    }
}
