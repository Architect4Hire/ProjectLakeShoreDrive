---
paths:
  - "src/**/*.cs"
  - "src/**/Migrations/**/*"
---

# Database rules

- Baseline relational database is Microsoft SQL Server / Azure SQL.
- Each bounded domain owns its schema/database.
- No cross-service joins or shared DbContext.
- Migrations live with the owning service.
- Use local DB transaction for aggregate changes + outbox, and for inbox + durable message effects.
- Prefer database uniqueness constraints for business uniqueness and durable idempotency.
- Do not treat EF InMemory as proof of SQL behavior.
- Do not introduce Npgsql/PostgreSQL-specific types or migrations without an ADR.
- Workflow, inbox and outbox state are durable relational data unless an explicit ADR selects another durable store.
