namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

// The task categories a model profile can be configured for (TR-OAI-003). Application code
// selects a profile by task rather than naming a model/deployment directly.
public enum AiModelTask
{
    Extraction,
    Reasoning,
    Drafting,
    Summarization,
    Embeddings,
    Evaluation
}
