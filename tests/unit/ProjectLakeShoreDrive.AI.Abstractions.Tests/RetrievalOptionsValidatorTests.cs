using ProjectLakeShoreDrive.AI.Abstractions.Configuration;

namespace ProjectLakeShoreDrive.AI.Abstractions.Tests;

public class RetrievalOptionsValidatorTests
{
    private static RetrievalOptions ValidOptions() => new()
    {
        IndexName = "knowledge-chunks",
        IndexVersion = "v1",
        MaxResults = 20,
        MinimumRelevanceScore = 0.5
    };

    [Fact]
    public void Validate_Succeeds_ForValidOptions()
    {
        var validator = new RetrievalOptionsValidator();

        var result = validator.Validate(name: null, ValidOptions());

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void Validate_Fails_WhenIndexNameMissing()
    {
        var validator = new RetrievalOptionsValidator();
        var options = new RetrievalOptions
        {
            IndexName = " ",
            IndexVersion = "v1"
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(RetrievalOptions.IndexName)));
    }

    [Fact]
    public void Validate_Fails_WhenIndexVersionMissing()
    {
        var validator = new RetrievalOptionsValidator();
        var options = new RetrievalOptions
        {
            IndexName = "knowledge-chunks",
            IndexVersion = " "
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
        Assert.Contains(result.Failures!, f => f.Contains(nameof(RetrievalOptions.IndexVersion)));
    }

    [Fact]
    public void Validate_Fails_WhenMaxResultsNotPositive()
    {
        var validator = new RetrievalOptionsValidator();
        var options = new RetrievalOptions
        {
            IndexName = "knowledge-chunks",
            IndexVersion = "v1",
            MaxResults = 0
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }

    [Theory]
    [InlineData(-0.1)]
    [InlineData(1.1)]
    public void Validate_Fails_WhenMinimumRelevanceScoreOutOfRange(double score)
    {
        var validator = new RetrievalOptionsValidator();
        var options = new RetrievalOptions
        {
            IndexName = "knowledge-chunks",
            IndexVersion = "v1",
            MinimumRelevanceScore = score
        };

        var result = validator.Validate(name: null, options);

        Assert.True(result.Failed);
    }
}
