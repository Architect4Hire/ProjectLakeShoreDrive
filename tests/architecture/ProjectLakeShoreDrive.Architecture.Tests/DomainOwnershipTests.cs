namespace ProjectLakeShoreDrive.Architecture.Tests;

// Enforces the bounded-domain ownership and provider-boundary rules in CLAUDE.md /
// .claude/rules/backend.md / .claude/rules/ai.md against the actual project graph
// (PR-007, TR-AI-010, TR-DATA-001, NFR-006..007).
public class DomainOwnershipTests
{
    // Package name prefixes that would leak a generative-AI provider SDK into
    // domain/application code (TR-AI-010, ADR-0003: domain/application depends on
    // project-owned interfaces such as IAiCompletionService/IEmbeddingService, never a
    // provider SDK type directly).
    private static readonly string[] ProviderSdkPackagePrefixes =
    [
        "OpenAI",
        "Azure.AI.OpenAI",
        "Microsoft.SemanticKernel"
    ];

    private static bool IsServiceProject(ProjectFile project) =>
        project.FullPath.Contains($"{Path.DirectorySeparatorChar}services{Path.DirectorySeparatorChar}", StringComparison.Ordinal);

    private static bool IsCoreProject(ProjectFile project) =>
        project.Name.EndsWith(".Core", StringComparison.Ordinal);

    // "ProjectLakeShoreDrive.Engagement.Core" -> "Engagement"; "ProjectLakeShoreDrive.Engagement" -> "Engagement".
    private static string DomainOf(string projectName)
    {
        var name = projectName.Replace("ProjectLakeShoreDrive.", string.Empty, StringComparison.Ordinal);

        if (name.EndsWith(".Core", StringComparison.Ordinal))
        {
            name = name[..^".Core".Length];
        }
        else if (name.EndsWith(".Functions", StringComparison.Ordinal))
        {
            name = name[..^".Functions".Length];
        }

        return name;
    }

    [Fact]
    public void ServiceProjects_DoNotReferenceAnotherDomainsProject()
    {
        var projects = ProjectGraph.LoadAll();
        var serviceProjects = projects.Where(IsServiceProject).ToList();
        var serviceProjectNames = serviceProjects.Select(p => p.Name).ToHashSet(StringComparer.Ordinal);

        var violations = new List<string>();

        foreach (var project in serviceProjects)
        {
            var domain = DomainOf(project.Name);

            foreach (var referenceName in project.ProjectReferences)
            {
                // Not another domain's service project (e.g. Shared, AI.Abstractions,
                // ServiceDefaults) — those are cross-cutting/shared by design.
                if (!serviceProjectNames.Contains(referenceName))
                {
                    continue;
                }

                var referenceDomain = DomainOf(referenceName);

                if (!string.Equals(referenceDomain, domain, StringComparison.Ordinal))
                {
                    violations.Add($"{project.Name} -> {referenceName} crosses domain ownership ({domain} -> {referenceDomain})");
                }
            }
        }

        Assert.True(violations.Count == 0, "Cross-domain project references found (ADR-0008/ADR-0009):\n" + string.Join('\n', violations));
    }

    [Fact]
    public void CoreProjects_DoNotReferenceTheirOwnHostProject()
    {
        var projects = ProjectGraph.LoadAll();
        var violations = new List<string>();

        foreach (var project in projects.Where(IsCoreProject))
        {
            var hostName = project.Name[..^".Core".Length];

            if (project.ProjectReferences.Contains(hostName, StringComparer.Ordinal))
            {
                violations.Add($"{project.Name} references its own host project {hostName}, inverting Controller -> Facade -> Business -> Data direction");
            }
        }

        Assert.True(violations.Count == 0, string.Join('\n', violations));
    }

    [Fact]
    public void CoreProjects_DoNotReferenceProviderSdkPackages()
    {
        var projects = ProjectGraph.LoadAll();
        var violations = new List<string>();

        foreach (var project in projects.Where(IsCoreProject))
        {
            foreach (var package in project.PackageReferences)
            {
                if (ProviderSdkPackagePrefixes.Any(prefix => package.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)))
                {
                    violations.Add($"{project.Name} references provider SDK package '{package}'");
                }
            }
        }

        Assert.True(violations.Count == 0, "Provider SDK leakage into domain/application code found (TR-AI-010, ADR-0003):\n" + string.Join('\n', violations));
    }
}
