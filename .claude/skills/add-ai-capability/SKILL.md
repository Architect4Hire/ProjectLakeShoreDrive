---
name: add-ai-capability
description: Add a governed AI-assisted feature using project-owned abstractions, Semantic Kernel, versioned prompts, validated output, provenance, and the correct sync/async execution mode.
---


# Add AI Capability

## Design first

Identify:

- user goal;
- owning bounded domain;
- model input;
- trusted vs untrusted context;
- prompt/template ID and version;
- expected output schema;
- source knowledge;
- required tools/plugins;
- authorization;
- synchronous vs long-lived execution;
- provenance to persist.

## Procedure

1. Read `.claude/rules/ai.md`, security and observability rules.
2. Define a project-owned application interface for the capability.
3. Keep Semantic Kernel/provider SDK code behind the infrastructure adapter.
4. Add/version prompt assets.
5. Build explicit input envelope; delimit untrusted source content.
6. Configure provider/model through configuration.
7. Request structured output when practical.
8. Parse and schema/domain validate output.
9. Add provenance.
10. If multi-stage/slow/retryable, invoke `add-long-lived-workflow`.
11. If tools are needed, invoke `add-semantic-kernel-plugin`.
12. Add deterministic tests with fake AI adapter.
13. Add narrow integration/contract tests for Semantic Kernel/provider wiring.
14. Add safe telemetry.

## Safety review

Never auto-execute model-produced privileged instructions.
