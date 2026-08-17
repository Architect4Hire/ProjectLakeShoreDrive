using ProjectLakeShoreDrive.AI.Abstractions.Configuration;

namespace ProjectLakeShoreDrive.AI.Abstractions.Tests;

public class AiModelProfilesOptionsValidatorTests
{
    private static AiModelProfileOptions ValidProfile(
        string deploymentName = "gpt-profile",
        int? maxOutputTokens = 1024,
        double? temperature = 0.7,
        TimeSpan? timeout = null) => new()
    {
        DeploymentName = deploymentName,
        MaxOutputTokens = maxOutputTokens,
        Temperature = temperature,
        Timeout = timeout ?? TimeSpan.FromSeconds(30)
    };

    private static AiModelProfilesOptions ValidProfiles() => new()
    {
        Extraction = ValidProfile("extraction-deployment"),
        Reasoning = ValidProfile("reasoning-deployment"),
        Drafting = ValidProfile("drafting-deployment"),
        Summarization = ValidProfile("summarization-deployment"),
        Embeddings = ValidProfile("embeddings-deployment"),
        Evaluation = ValidProfile("evaluation-deployment")
    };

    private static AiModelProfilesOptions ProfilesWithExtraction(AiModelProfileOptions extraction)
    {
        var valid = ValidProfiles();

        return new AiModelProfilesOptions
        {
            Extraction = extraction,
            Reasoning = valid.Reasoning,
            Drafting = valid.Drafting,
            Summarization = valid.Summarization,
            Embeddings = valid.Embeddings,
            Evaluation = valid.Evaluation
        };
    }

    [Fact]
    public void Validate_Succeeds_ForFullyConfiguredProfiles()
    {
        var validator = new AiModelProfilesOptionsValidator();

        var result = validator.Validate(name: null, ValidProfiles());

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Validate_Fails_WhenDeploymentNameMissing()
    {
        var validator = new AiModelProfilesOptionsValidator();
        var options = ProfilesWithExtraction(ValidProfile(deploymentName: "  "));

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(
            result.Failures!,
            f => f.Contains(nameof(AiModelProfilesOptions.Extraction)) && f.Contains(nameof(AiModelProfileOptions.DeploymentName)));
    }

    [Theory]
    [InlineData(-0.1)]
    [InlineData(2.1)]
    public void Validate_Fails_WhenTemperatureOutOfRange(double temperature)
    {
        var validator = new AiModelProfilesOptionsValidator();
        var options = ProfilesWithExtraction(ValidProfile(temperature: temperature));

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Fact]
    public void Validate_Fails_WhenMaxOutputTokensNotPositive()
    {
        var validator = new AiModelProfilesOptionsValidator();
        var options = ProfilesWithExtraction(ValidProfile(maxOutputTokens: 0));

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Fact]
    public void ForTask_ReturnsMatchingProfile()
    {
        var options = ValidProfiles();

        Assert.Same(options.Extraction, options.ForTask(AiModelTask.Extraction));
        Assert.Same(options.Reasoning, options.ForTask(AiModelTask.Reasoning));
        Assert.Same(options.Drafting, options.ForTask(AiModelTask.Drafting));
        Assert.Same(options.Summarization, options.ForTask(AiModelTask.Summarization));
        Assert.Same(options.Embeddings, options.ForTask(AiModelTask.Embeddings));
        Assert.Same(options.Evaluation, options.ForTask(AiModelTask.Evaluation));
    }
}
