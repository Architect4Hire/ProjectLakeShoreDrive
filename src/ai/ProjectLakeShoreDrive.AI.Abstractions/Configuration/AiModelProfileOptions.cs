namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// Configuration-driven, provider-neutral description of one task's model selection
// (TR-OAI-003). Contains no provider SDK types and no credentials.
public sealed class AiModelProfileOptions
{
    public required string DeploymentName { get; init; }

    public string? ModelName { get; init; }

    public int? MaxOutputTokens { get; init; }

    public double? Temperature { get; init; }

    public TimeSpan? Timeout { get; init; }
}
