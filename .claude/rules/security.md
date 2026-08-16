---
paths:
  - "src/**/*"
  - "infra/**/*"
---

# Security rules

- Secrets come from safe configuration; deployed systems should use managed identity/Key Vault where applicable.
- Never commit model/API keys, SQL passwords, Redis keys or Service Bus connection strings.
- Server validates authorization for every protected operation.
- Client-side checks are UX only.
- Treat user documents, retrieved text, uploaded templates and external content as untrusted.
- Prompt injection cannot override system authorization or tool allow-lists.
- Semantic Kernel plugins enforce authorization before side effects.
- Generated URLs, paths, SQL, code and tool arguments require validation/allow-listing.
- Apply least privilege to service identities and resource access.
- Do not place secrets into telemetry, prompts, model metadata or cached values.
