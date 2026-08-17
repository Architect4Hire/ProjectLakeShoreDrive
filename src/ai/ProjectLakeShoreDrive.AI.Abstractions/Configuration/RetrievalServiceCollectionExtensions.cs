using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.AI.Abstractions.Configuration;

public static class RetrievalServiceCollectionExtensions
{
    // Binds and validates retrieval/search configuration. Registering concrete
    // IEmbeddingService/IKnowledgeRetriever implementations is a separate, later seam
    // (ADR-0013) — this method does not ingest, embed, or query any content.
    public static IServiceCollection AddKnowledgeRetrieval(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<RetrievalOptions>()
            .Bind(configuration.GetSection(RetrievalOptions.SectionName))
            .ValidateOnStart();

        services.AddSingleton<IValidateOptions<RetrievalOptions>, RetrievalOptionsValidator>();

        return services;
    }
}
