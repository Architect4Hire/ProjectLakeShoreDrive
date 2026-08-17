using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.AI.Abstractions.Configuration;
using ProjectLakeShoreDrive.AI.Abstractions.Retrieval;

namespace ProjectLakeShoreDrive.AI.Abstractions.Tests;

public class RetrievalServiceCollectionExtensionsTests
{
    private static IConfiguration BuildConfiguration(IDictionary<string, string?> settings) =>
        new ConfigurationBuilder().AddInMemoryCollection(settings).Build();

    [Fact]
    public void AddKnowledgeRetrieval_BindsIndexNameAndVersionFromConfiguration()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["Ai:Retrieval:IndexName"] = "knowledge-chunks",
            ["Ai:Retrieval:IndexVersion"] = "v1"
        });

        var services = new ServiceCollection();
        services.AddKnowledgeRetrieval(configuration);

        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<IOptions<RetrievalOptions>>().Value;

        Assert.Equal("knowledge-chunks", options.IndexName);
        Assert.Equal("v1", options.IndexVersion);
        Assert.Equal(RetrievalProvider.SqlKeywordMetadataFilter, options.Provider);
    }

    [Fact]
    public void AddKnowledgeRetrieval_FailsValidation_WhenIndexVersionMissing()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["Ai:Retrieval:IndexName"] = "knowledge-chunks"
        });

        var services = new ServiceCollection();
        services.AddKnowledgeRetrieval(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.Throws<OptionsValidationException>(() =>
            provider.GetRequiredService<IOptions<RetrievalOptions>>().Value);
    }

    [Fact]
    public void AddKnowledgeRetrieval_DoesNotRegisterRetrievalImplementations()
    {
        // This seam only wires configuration; concrete IEmbeddingService/IKnowledgeRetriever
        // implementations are a later, separate step (ADR-0013), so no ingest/embed/query
        // capability exists yet.
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["Ai:Retrieval:IndexName"] = "knowledge-chunks",
            ["Ai:Retrieval:IndexVersion"] = "v1"
        });

        var services = new ServiceCollection();
        services.AddKnowledgeRetrieval(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.Null(provider.GetService<IEmbeddingService>());
        Assert.Null(provider.GetService<IKnowledgeRetriever>());
    }
}
