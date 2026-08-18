namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

public sealed record Stakeholder
{
    public string Name { get; }
    public string Role { get; }
    public string? Email { get; }

    public Stakeholder(string name, string role, string? email = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Stakeholder name is required.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(role))
        {
            throw new ArgumentException("Stakeholder role is required.", nameof(role));
        }

        Name = name.Trim();
        Role = role.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim();
    }
}
