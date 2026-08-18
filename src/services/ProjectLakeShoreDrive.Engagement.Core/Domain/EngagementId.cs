namespace ProjectLakeShoreDrive.Engagement.Core.Domain;

public readonly record struct EngagementId(Guid Value)
{
    public static EngagementId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}
