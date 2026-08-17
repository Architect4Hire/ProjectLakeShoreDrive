using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

public sealed class RetrievalOptionsValidator : IValidateOptions<RetrievalOptions>
{
    public ValidateOptionsResult Validate(string? name, RetrievalOptions options)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(options.IndexName))
        {
            failures.Add($"{nameof(RetrievalOptions.IndexName)} is required.");
        }

        if (string.IsNullOrWhiteSpace(options.IndexVersion))
        {
            failures.Add($"{nameof(RetrievalOptions.IndexVersion)} is required.");
        }

        if (options.MaxResults <= 0)
        {
            failures.Add($"{nameof(RetrievalOptions.MaxResults)} must be greater than zero.");
        }

        if (options.MinimumRelevanceScore is < 0 or > 1)
        {
            failures.Add($"{nameof(RetrievalOptions.MinimumRelevanceScore)} must be between 0 and 1 when specified.");
        }

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}
