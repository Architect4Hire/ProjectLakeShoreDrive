---
paths:
  - "src/**/*AI*.cs"
  - "src/**/*Ai*.cs"
  - "src/**/*SemanticKernel*.cs"
  - "src/**/Prompts/**/*"
  - "src/**/Templates/**/*"
---

# AI / Semantic Kernel rules

Semantic Kernel is the orchestration layer for OpenAI/Azure OpenAI access.

Architecture:

- define project-owned interfaces for AI use cases;
- isolate Semantic Kernel/provider composition in infrastructure/composition code;
- keep model/provider SDK types out of domain contracts;
- select model/deployment through configuration.

Prompts:

- store significant prompts/templates as versioned files/assets;
- give templates stable IDs/versions;
- clearly separate trusted instructions from untrusted user/retrieved content;
- never allow retrieved text to redefine system safety/authorization rules;
- validate required template variables before invocation.

Output:

- treat all model output as untrusted;
- schema-validate structured output;
- validate domain rules after parsing;
- do not execute generated SQL/shell/code/URLs automatically;
- use allow-listed tools and arguments;
- persist provenance with generated artifacts.

Semantic Kernel plugins:

- narrow functions;
- descriptive names/parameters;
- authorization inside the tool boundary;
- no "god plugin" exposing unrestricted infrastructure;
- no arbitrary filesystem/database/network tool.

Execution mode:

- bounded interactive generation may be HTTP;
- multi-step/slow/retryable/human-reviewed generation uses durable workflow + Service Bus.

Telemetry:

- model/deployment;
- prompt/template version;
- generation/workflow ID;
- latency;
- token usage when available;
- tool calls;
- validation result;
- retry/failure outcome.

Never log API keys or unnecessarily broad prompt/document bodies.

Do not silently replace Semantic Kernel with another orchestration framework.
