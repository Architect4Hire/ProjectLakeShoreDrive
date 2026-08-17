using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.Shared.Storage;

public static class ArtifactStorageServiceCollectionExtensions
{
    // Binds and validates artifact storage configuration. Registering a concrete
    // IArtifactStore implementation is a separate, later seam (ADR-0013) — this method
    // does not read, write, or otherwise touch artifact bytes.
    public static IServiceCollection AddArtifactStorage(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<ArtifactStorageOptions>()
            .Bind(configuration.GetSection(ArtifactStorageOptions.SectionName))
            .ValidateOnStart();

        services.AddSingleton<IValidateOptions<ArtifactStorageOptions>, ArtifactStorageOptionsValidator>();

        return services;
    }
}
