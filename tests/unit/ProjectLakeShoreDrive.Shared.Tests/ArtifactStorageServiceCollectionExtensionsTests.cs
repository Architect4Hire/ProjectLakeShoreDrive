using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ProjectLakeShoreDrive.Shared.Storage;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class ArtifactStorageServiceCollectionExtensionsTests
{
    private static IConfiguration BuildConfiguration(IDictionary<string, string?> settings) =>
        new ConfigurationBuilder().AddInMemoryCollection(settings).Build();

    [Fact]
    public void AddArtifactStorage_BindsRootPathFromConfiguration()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["ArtifactStorage:Provider"] = "LocalFileSystem",
            ["ArtifactStorage:RootPath"] = OperatingSystem.IsWindows() ? @"C:\lsd-artifacts" : "/var/lib/lsd-artifacts"
        });

        var services = new ServiceCollection();
        services.AddArtifactStorage(configuration);

        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<IOptions<ArtifactStorageOptions>>().Value;

        Assert.Equal(ArtifactStorageProvider.LocalFileSystem, options.Provider);
    }

    [Fact]
    public void AddArtifactStorage_FailsValidation_WhenRootPathMissing()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["ArtifactStorage:Provider"] = "LocalFileSystem"
        });

        var services = new ServiceCollection();
        services.AddArtifactStorage(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.Throws<OptionsValidationException>(() =>
            provider.GetRequiredService<IOptions<ArtifactStorageOptions>>().Value);
    }

    [Fact]
    public void AddArtifactStorage_DoesNotRegisterAnIArtifactStoreImplementation()
    {
        // This seam only wires configuration; a concrete IArtifactStore implementation is
        // a later, separate step (ADR-0013) so no upload/persist capability exists yet.
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["ArtifactStorage:RootPath"] = OperatingSystem.IsWindows() ? @"C:\lsd-artifacts" : "/var/lib/lsd-artifacts"
        });

        var services = new ServiceCollection();
        services.AddArtifactStorage(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.Null(provider.GetService<IArtifactStore>());
    }
}
