---
name: add-semantic-kernel-plugin
description: Add a narrow Semantic Kernel plugin/function-call surface with explicit parameters, authorization, safe side effects, and tool-output validation.
---


# Add Semantic Kernel Plugin

1. Identify the exact capability the model needs.
2. Prefer a small tool over a broad service-object exposure.
3. Give plugin/function/parameters clear descriptions.
4. Use typed parameters and constrained values.
5. Validate authorization before side effects.
6. Validate identifiers against the owning service, not model assumptions.
7. Do not accept arbitrary SQL, shell, file path, URL, type name or method name.
8. Return the minimum data required by the model.
9. Make side-effecting functions idempotent where retries are plausible.
10. Emit tool-call telemetry keyed to generation/workflow ID.
11. Unit-test parameter validation, auth, duplicate calls and failure mapping.
12. Register plugin in composition/infrastructure, not domain code.
