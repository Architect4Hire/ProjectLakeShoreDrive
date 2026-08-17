using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

public sealed class SemanticKernelOptionsValidator : IValidateOptions<SemanticKernelOptions>
{
    public ValidateOptionsResult Validate(string? name, SemanticKernelOptions options)
    {
        var failures = new List<string>();

        if (options.Endpoint is null || !options.Endpoint.IsAbsoluteUri)
        {
            failures.Add($"{nameof(SemanticKernelOptions.Endpoint)} must be an absolute URI.");
        }

        if (options.DefaultRequestTimeout <= TimeSpan.Zero)
        {
            failures.Add($"{nameof(SemanticKernelOptions.DefaultRequestTimeout)} must be greater than zero.");
        }

        if (options.MaxRetryAttempts < 0)
        {
            failures.Add($"{nameof(SemanticKernelOptions.MaxRetryAttempts)} must not be negative.");
        }

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}
