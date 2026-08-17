using System.Xml.Linq;

namespace ProjectLakeShoreDrive.Architecture.Tests;

public sealed record ProjectFile(
    string Name,
    string FullPath,
    IReadOnlyList<string> ProjectReferences,
    IReadOnlyList<string> PackageReferences);

// Reads the project-reference/package-reference graph directly from the .csproj files under
// src/, rather than via reflection over compiled types. The domain Core projects currently
// contain no code (they are shells, per the atomic scaffolding steps that created them), so a
// type-level architecture test would have nothing to inspect yet; the reference graph is the
// only enforceable structure today and is exactly what USAGE asks this seam to prove.
public static class ProjectGraph
{
    // This test assembly runs from tests/architecture/.../bin/Debug/net10.0, a sibling
    // branch of src/, not a descendant of it — so walk up to the repository root (marked by
    // CLAUDE.md) and descend into src/, rather than searching ancestors for src/ directly.
    public static string FindSrcDirectory()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);

        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "CLAUDE.md")))
        {
            dir = dir.Parent;
        }

        if (dir is null)
        {
            throw new InvalidOperationException(
                $"Could not locate the repository root (CLAUDE.md not found) starting from {AppContext.BaseDirectory}.");
        }

        var srcDirectory = Path.Combine(dir.FullName, "src");

        if (!File.Exists(Path.Combine(srcDirectory, "ProjectLakeShoreDrive.slnx")))
        {
            throw new InvalidOperationException($"Expected to find ProjectLakeShoreDrive.slnx under {srcDirectory}.");
        }

        return srcDirectory;
    }

    public static IReadOnlyList<ProjectFile> LoadAll()
    {
        var srcDirectory = FindSrcDirectory();

        return Directory.EnumerateFiles(srcDirectory, "*.csproj", SearchOption.AllDirectories)
            .Select(Load)
            .ToList();
    }

    private static ProjectFile Load(string path)
    {
        var document = XDocument.Load(path);

        var projectReferences = document.Descendants("ProjectReference")
            .Select(e => e.Attribute("Include")?.Value)
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Select(v => Path.GetFileNameWithoutExtension(v!))
            .ToList();

        var packageReferences = document.Descendants("PackageReference")
            .Select(e => e.Attribute("Include")?.Value)
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Select(v => v!)
            .ToList();

        return new ProjectFile(Path.GetFileNameWithoutExtension(path), path, projectReferences, packageReferences);
    }
}
