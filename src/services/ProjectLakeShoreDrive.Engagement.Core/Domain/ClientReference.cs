namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

// Identifies the client an engagement is for. The Engagement domain does not own client
// master data; it holds a stable reference (id + display name) captured at engagement creation.
public sealed record ClientReference
{
    public Guid ClientId { get; }
    public string Name { get; }

    public ClientReference(Guid clientId, string name)
    {
        if (clientId == Guid.Empty)
        {
            throw new ArgumentException("Client id is required.", nameof(clientId));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Client name is required.", nameof(name));
        }

        ClientId = clientId;
        Name = name.Trim();
    }
}
