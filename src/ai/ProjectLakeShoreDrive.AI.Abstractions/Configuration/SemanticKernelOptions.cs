namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// Kernel-construction configuration (TR-AI-002), independent of any single task's model
// profile. Endpoint/credential values must come from safe configuration (user secrets, Key
// Vault, managed identity) at deployment time and are never hardcoded or logged.
public sealed class SemanticKernelOptions
{
    public const string SectionName = "Ai:SemanticKernel";

    public required Uri Endpoint { get; init; }

    public string? ApiKey { get; init; }

    public TimeSpan DefaultRequestTimeout { get; init; } = TimeSpan.FromSeconds(30);

    // Bounded per TR-OAI-006: retries must be bounded and appropriate to failure type.
    public int MaxRetryAttempts { get; init; } = 3;
}
