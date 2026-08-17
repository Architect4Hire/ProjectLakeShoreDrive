using ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions;

namespace ProjectLakeShoreDrive.Messaging.OutboxRelay.Functions.Tests;

public class OutboxRelayHostOptionsValidatorTests
{
    private static OutboxRelayHostOptions ValidOptions() => new()
    {
        LeaseOwner = "relay-1",
        DestinationName = "engagement-events",
        BatchSize = 20,
        LeaseDuration = TimeSpan.FromMinutes(5),
        MaxAttempts = 5,
    };

    [Fact]
    public void Validate_Succeeds_ForValidOptions()
    {
        var validator = new OutboxRelayHostOptionsValidator();

        var result = validator.Validate(name: null, ValidOptions());

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Validate_Fails_WhenLeaseOwnerMissing()
    {
        var validator = new OutboxRelayHostOptionsValidator();
        var options = new OutboxRelayHostOptions { LeaseOwner = " ", DestinationName = "engagement-events" };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(OutboxRelayHostOptions.LeaseOwner)));
    }

    [Fact]
    public void Validate_Fails_WhenDestinationNameMissing()
    {
        var validator = new OutboxRelayHostOptionsValidator();
        var options = new OutboxRelayHostOptions { LeaseOwner = "relay-1", DestinationName = " " };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(OutboxRelayHostOptions.DestinationName)));
    }

    [Fact]
    public void Validate_Fails_WhenBatchSizeNotPositive()
    {
        var validator = new OutboxRelayHostOptionsValidator();
        var options = new OutboxRelayHostOptions { LeaseOwner = "relay-1", DestinationName = "engagement-events", BatchSize = 0 };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Fact]
    public void Validate_Fails_WhenLeaseDurationNotPositive()
    {
        var validator = new OutboxRelayHostOptionsValidator();
        var options = new OutboxRelayHostOptions { LeaseOwner = "relay-1", DestinationName = "engagement-events", LeaseDuration = TimeSpan.Zero };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Fact]
    public void Validate_Fails_WhenMaxAttemptsNotPositive()
    {
        var validator = new OutboxRelayHostOptionsValidator();
        var options = new OutboxRelayHostOptions { LeaseOwner = "relay-1", DestinationName = "engagement-events", MaxAttempts = 0 };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }
}
