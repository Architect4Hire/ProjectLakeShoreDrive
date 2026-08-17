using Microsoft.Extensions.Options;

namespace ProjectLakeShoreDrive.Shared.Storage;

public sealed class ArtifactStorageOptionsValidator : IValidateOptions<ArtifactStorageOptions>
{
    public ValidateOptionsResult Validate(string? name, ArtifactStorageOptions options)
    {
        var failures = new List<string>();

        switch (options.Provider)
        {
            case ArtifactStorageProvider.LocalFileSystem:
                if (string.IsNullOrWhiteSpace(options.RootPath))
                {
                    failures.Add($"{nameof(ArtifactStorageOptions.RootPath)} is required when Provider is {ArtifactStorageProvider.LocalFileSystem}.");
                }
                else if (!Path.IsPathRooted(options.RootPath))
                {
                    failures.Add($"{nameof(ArtifactStorageOptions.RootPath)} must be an absolute path.");
                }

                break;
            default:
                failures.Add($"Unsupported {nameof(ArtifactStorageOptions.Provider)}: {options.Provider}.");
                break;
        }

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}
