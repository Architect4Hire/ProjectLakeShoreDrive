# The `.claude/` folder — Project Lake Shore Drive

This folder is the reusable Claude Code engineering toolkit for Project Lake Shore Drive.

It follows the same separation used by Project Chicago:

- `CLAUDE.md` = enduring project constitution;
- `rules/` = path/domain-specific constraints;
- `skills/` = repeatable implementation procedures;
- `agents/` = read-only review/checking work;
- `hooks/` = deterministic safeguards.

## What loads when

| Path | Purpose |
|---|---|
| `rules/angular.md` | Angular 22 engineering conventions. |
| `rules/design-system.md` | Local design-system ownership and Tailwind composition. |
| `rules/backend.md` | .NET service layering and bounded-domain rules. |
| `rules/http-integration.md` | Synchronous service-to-service HTTP rules. |
| `rules/messaging.md` | Service Bus, outbox, inbox, idempotency, correlation. |
| `rules/workflows.md` | Durable long-lived workflow conventions. |
| `rules/redis.md` | Cache ownership, invalidation, TTL, anti-patterns. |
| `rules/ai.md` | Semantic Kernel/OpenAI architecture and safety. |
| `rules/database.md` | SQL ownership and transactional persistence. |
| `rules/aspire.md` | Local resource composition. |
| `rules/observability.md` | Trace/correlation requirements. |
| `rules/security.md` | Secrets, auth, data, prompt/tool safety. |
| `skills/add-angular-feature/` | Add an Angular 22 vertical feature using the design system. |
| `skills/add-design-system-component/` | Add reusable UI primitives/recipes. |
| `skills/add-endpoint/` | Add an HTTP use case through the service layers. |
| `skills/add-http-integration/` | Add typed synchronous service integration. |
| `skills/add-integration-event/` | Add publish/consume event flow with durability. |
| `skills/add-long-lived-workflow/` | Add a durable asynchronous workflow. |
| `skills/add-redis-cache/` | Add cache-aside behavior safely. |
| `skills/add-ai-capability/` | Add a governed AI-assisted capability. |
| `skills/add-semantic-kernel-plugin/` | Add a narrow Semantic Kernel plugin/tool. |
| `skills/add-document-generation-template/` | Add a versioned AI document-generation template. |
| `skills/add-aspire-resource/` | Wire a new local resource/dependency. |
| `skills/trace-a-request/` | Trace HTTP/message/AI work end-to-end. |
| `skills/run-quality-gate/` | Run relevant architecture/test checks. |
| `agents/code-reviewer.md` | General read-only implementation review. |
| `agents/architecture-boundary-checker.md` | Service/database/layer boundary review. |
| `agents/angular-reviewer.md` | Angular 22/design-system review. |
| `agents/ai-safety-reviewer.md` | Prompt/tool/output/provenance review. |
| `agents/integration-pattern-reviewer.md` | HTTP vs Service Bus / inbox/outbox review. |
| `agents/test-gap-analyzer.md` | Test coverage gap review. |
| `hooks/format.sh` | Post-edit formatting helper. |
| `hooks/secret-guard.sh` | Credential-shaped-string guard. |

## Rule of thumb

- A **rule** is something Claude must know and obey.
- A **skill** is a repeatable procedure Claude should follow.
- An **agent** is read-only analysis used to challenge an implementation.
- A **hook** is deterministic behavior that should happen regardless of model judgment.

## Integration mantra

> HTTP when the caller needs the answer now.  
> Service Bus when time, retries, fan-out, or independence matter.  
> Outbox when local state + message publication must be atomic.  
> Inbox/idempotency when duplicate delivery can change durable state.

## AI mantra

> AI drafts; domain rules decide.  
> Prompts are versioned.  
> Outputs are validated.  
> Tools are narrow.  
> Provenance is retained.  
> Long-running AI work is a durable workflow.

## After adding to a repository

```bash
chmod +x .claude/hooks/*.sh
```

Then start Claude Code from the repository root and confirm the root `CLAUDE.md` and local skills are discovered.

## Local-only files

Do not commit:

- `.claude/settings.local.json`
- secret-bearing `appsettings.*.json`
- `local.settings.json` containing Function secrets
- `.env.local`
- local OpenAI/Azure OpenAI keys
- local Redis/Service Bus credentials

## Fast-moving APIs

Before generating version-sensitive code, verify official documentation for:

- Angular 22;
- Angular zoneless/signals/testing APIs;
- .NET Aspire integrations;
- Azure Service Bus client/trigger APIs;
- Semantic Kernel;
- OpenAI/Azure OpenAI SDKs;
- Claude Code hook/settings/skill frontmatter syntax.

Architectural intent in this toolkit is stronger than exact package-version examples.
