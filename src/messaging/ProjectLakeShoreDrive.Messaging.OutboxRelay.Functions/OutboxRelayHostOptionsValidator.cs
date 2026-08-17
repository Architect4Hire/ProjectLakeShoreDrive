using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

public sealed class OutboxRelayHostOptionsValidator : IValidateOptions<OutboxRelayHostOptions>
{
    public ValidateOptionsResult Validate(string? name, OutboxRelayHostOptions options)
    {
        if (options is null)
        {
            return ValidateOptionsResult.Fail($"{OutboxRelayHostOptions.SectionName} configuration section is required.");
        }

        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(options.LeaseOwner))
        {
            failures.Add($"{nameof(OutboxRelayHostOptions.LeaseOwner)} is required.");
        }

        if (string.IsNullOrWhiteSpace(options.DestinationName))
        {
            failures.Add($"{nameof(OutboxRelayHostOptions.DestinationName)} is required.");
        }

        if (options.BatchSize <= 0)
        {
            failures.Add($"{nameof(OutboxRelayHostOptions.BatchSize)} must be positive.");
        }

        if (options.LeaseDuration <= TimeSpan.Zero)
        {
            failures.Add($"{nameof(OutboxRelayHostOptions.LeaseDuration)} must be positive.");
        }

        if (options.MaxAttempts <= 0)
        {
            failures.Add($"{nameof(OutboxRelayHostOptions.MaxAttempts)} must be positive.");
        }

        return failures.Count == 0 ? ValidateOptionsResult.Success : ValidateOptionsResult.Fail(failures);
    }
}
