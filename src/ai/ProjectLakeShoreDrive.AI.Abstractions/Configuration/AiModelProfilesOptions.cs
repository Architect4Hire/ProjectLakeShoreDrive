namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// Root configuration section binding one model profile per task (TR-OAI-003). Bind from
// configuration section "Ai:ModelProfiles"; model/deployment selection never comes from
// domain logic.
public sealed class AiModelProfilesOptions
{
    public const string SectionName = "Ai:ModelProfiles";

    public required AiModelProfileOptions Extraction { get; init; }

    public required AiModelProfileOptions Reasoning { get; init; }

    public required AiModelProfileOptions Drafting { get; init; }

    public required AiModelProfileOptions Summarization { get; init; }

    public required AiModelProfileOptions Embeddings { get; init; }

    public required AiModelProfileOptions Evaluation { get; init; }

    public AiModelProfileOptions ForTask(AiModelTask task) => task switch
    {
        AiModelTask.Extraction => Extraction,
        AiModelTask.Reasoning => Reasoning,
        AiModelTask.Drafting => Drafting,
        AiModelTask.Summarization => Summarization,
        AiModelTask.Embeddings => Embeddings,
        AiModelTask.Evaluation => Evaluation,
        _ => throw new ArgumentOutOfRangeException(nameof(task), task, message: null)
    };
}
