var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql")
    .WithDataVolume();

// Each bounded domain owns its own database; no domain reads another domain's database (ADR-0008).
var engagementDb = sql.AddDatabase("engagement-db");
var knowledgeDb = sql.AddDatabase("knowledge-db");
var documentGenerationDb = sql.AddDatabase("document-generation-db");

// Shared cache infrastructure. Redis is non-authoritative: each domain owns its own key
// namespace and business correctness must survive its absence, so services do not wait
// on it at startup (unlike the SQL system of record).
var redis = builder.AddRedis("redis")
    .WithDataVolume();

// Namespace only. No topics/queues are declared here: no ADR yet approves a concrete
// Service Bus entity topology (see docs/design/ongoing-architecture-plan.md, item 8), and
// no producer/consumer exists to justify one (ADR-0012 explicitly implements no messaging
// infrastructure). Entities and service bindings are added once that topology is approved.
builder.AddAzureServiceBus("service-bus")
    .RunAsEmulator();

builder.AddProject<Projects.ProjectLakeShoreDrive_Engagement>("engagement")
    .WithReference(engagementDb)
    .WaitFor(engagementDb)
    .WithReference(redis);

builder.AddProject<Projects.ProjectLakeShoreDrive_Knowledge>("knowledge")
    .WithReference(knowledgeDb)
    .WaitFor(knowledgeDb)
    .WithReference(redis);

builder.AddProject<Projects.ProjectLakeShoreDrive_DocumentGeneration>("document-generation")
    .WithReference(documentGenerationDb)
    .WaitFor(documentGenerationDb)
    .WithReference(redis);

builder.Build().Run();
