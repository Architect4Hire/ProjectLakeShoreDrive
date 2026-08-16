---
name: add-document-generation-template
description: Add a versioned AI-assisted document template/prompt for proposals, SOWs, architecture deliverables, ADRs, estimates, summaries, or other consulting artifacts.
---


# Add Document Generation Template

1. Identify artifact type and owner.
2. Assign stable template ID and explicit version.
3. Separate:
   - trusted system instructions;
   - reusable approved building blocks;
   - engagement input;
   - retrieved source material;
   - output schema/structure.
4. Define required variables and validation.
5. Define section order and required/optional sections.
6. Define citation/source-reference expectations where applicable.
7. Define assumptions the model may make and those it must not.
8. Define forbidden content/claims.
9. Define review status: generated content starts as draft.
10. Persist provenance: template version, prompt version, model/deployment, sources, timestamp.
11. Add fixture-based prompt/template tests.
12. If generation is multi-step, route through a durable workflow.
13. Do not overwrite an approved template in place; create a new version.
