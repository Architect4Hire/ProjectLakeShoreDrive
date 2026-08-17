using ProjectLakeShoreDrive.Shared.Storage;

namespace ProjectLakeShoreDrive.Shared.Tests;

public class ArtifactStorageOptionsValidatorTests
{
    [Fact]
    public void Validate_Succeeds_ForRootedLocalFileSystemPath()
    {
        var validator = new ArtifactStorageOptionsValidator();
        var options = new ArtifactStorageOptions
        {
            Provider = ArtifactStorageProvider.LocalFileSystem,
            RootPath = OperatingSystem.IsWindows() ? @"C:\lsd-artifacts" : "/var/lib/lsd-artifacts"
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Validate_Fails_WhenRootPathMissing()
    {
        var validator = new ArtifactStorageOptionsValidator();
        var options = new ArtifactStorageOptions
        {
            Provider = ArtifactStorageProvider.LocalFileSystem,
            RootPath = "   "
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(ArtifactStorageOptions.RootPath)));
    }

    [Fact]
    public void Validate_Fails_WhenRootPathIsRelative()
    {
        var validator = new ArtifactStorageOptionsValidator();
        var options = new ArtifactStorageOptions
        {
            Provider = ArtifactStorageProvider.LocalFileSystem,
            RootPath = "relative/artifacts"
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains("absolute"));
    }
}
