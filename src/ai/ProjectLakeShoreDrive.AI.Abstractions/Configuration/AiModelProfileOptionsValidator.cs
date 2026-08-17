using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

public static class AiModelProfileOptionsValidator
{
    public static IEnumerable<string> Validate(string profileName, AiModelProfileOptions? options)
    {
        if (options is null)
        {
            yield return $"{profileName} is required.";
            yield break;
        }

        if (string.IsNullOrWhiteSpace(options.DeploymentName))
        {
            yield return $"{profileName}.{nameof(AiModelProfileOptions.DeploymentName)} is required.";
        }

        if (options.MaxOutputTokens is <= 0)
        {
            yield return $"{profileName}.{nameof(AiModelProfileOptions.MaxOutputTokens)} must be greater than zero when specified.";
        }

        if (options.Temperature is < 0 or > 2)
        {
            yield return $"{profileName}.{nameof(AiModelProfileOptions.Temperature)} must be between 0 and 2 when specified.";
        }

        if (options.Timeout is { } timeout && timeout <= TimeSpan.Zero)
        {
            yield return $"{profileName}.{nameof(AiModelProfileOptions.Timeout)} must be greater than zero when specified.";
        }
    }
}

public sealed class AiModelProfilesOptionsValidator : IValidateOptions<AiModelProfilesOptions>
{
    public ValidateOptionsResult Validate(string? name, AiModelProfilesOptions options)
    {
        var failures = new List<string>();

        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Extraction), options.Extraction));
        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Reasoning), options.Reasoning));
        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Drafting), options.Drafting));
        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Summarization), options.Summarization));
        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Embeddings), options.Embeddings));
        failures.AddRange(AiModelProfileOptionsValidator.Validate(nameof(AiModelProfilesOptions.Evaluation), options.Evaluation));

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}
