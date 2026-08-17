using ProjectLakeShoreDrive.AI.Abstractions.Configuration;

namespace ProjectLakeShoreDrive.AI.Abstractions.Tests;

public class SemanticKernelOptionsValidatorTests
{
    private static SemanticKernelOptions ValidOptions() => new()
    {
        Endpoint = new Uri("https://example-resource.openai.azure.com/"),
        DefaultRequestTimeout = TimeSpan.FromSeconds(30),
        MaxRetryAttempts = 3
    };

    [Fact]
    public void Validate_Succeeds_ForValidOptions()
    {
        var validator = new SemanticKernelOptionsValidator();

        var result = validator.Validate(name: null, ValidOptions());

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Validate_Fails_WhenEndpointIsNull()
    {
        var validator = new SemanticKernelOptionsValidator();
        var options = ValidOptions();
        // Endpoint is a required init property in production code; simulate a missing
        // value the way configuration binding would surface it (no bound value at all
        // is caught by the binder itself, so here we check the validator's own guard).
        options = new SemanticKernelOptions
        {
            Endpoint = new Uri("relative", UriKind.RelativeOrAbsolute),
            DefaultRequestTimeout = options.DefaultRequestTimeout,
            MaxRetryAttempts = options.MaxRetryAttempts
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(SemanticKernelOptions.Endpoint)));
    }

    [Fact]
    public void Validate_Fails_WhenDefaultRequestTimeoutNotPositive()
    {
        var validator = new SemanticKernelOptionsValidator();
        var options = ValidOptions();
        options = new SemanticKernelOptions
        {
            Endpoint = options.Endpoint,
            DefaultRequestTimeout = TimeSpan.Zero,
            MaxRetryAttempts = options.MaxRetryAttempts
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Fact]
    public void Validate_Fails_WhenMaxRetryAttemptsNegative()
    {
        var validator = new SemanticKernelOptionsValidator();
        var options = ValidOptions();
        options = new SemanticKernelOptions
        {
            Endpoint = options.Endpoint,
            DefaultRequestTimeout = options.DefaultRequestTimeout,
            MaxRetryAttempts = -1
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }
}
