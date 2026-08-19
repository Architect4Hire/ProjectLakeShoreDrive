using System.Text.Json;
using System.Text.Json.Serialization;

namespace ProjectLakeShoreDrive.Engagement.Api.Integration.Tests;

// The host serializes enums as strings (Program.cs: JsonStringEnumConverter), so response
// deserialization in tests must use matching options; System.Net.Http.Json's parameterless
// overloads otherwise assume numeric enums and throw on read.
internal static class TestJson
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };
}
