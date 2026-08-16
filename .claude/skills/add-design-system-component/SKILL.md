---
name: add-design-system-component
description: Add a reusable Angular 22 Lake Shore Drive design-system primitive, recipe, or composed pattern without leaking feature-domain concerns.
---


# Add Design System Component

1. Read `.claude/rules/design-system.md` and `.claude/rules/angular.md`.
2. Search for an existing primitive/recipe that can be extended.
3. Confirm the new abstraction is reusable and domain-neutral.
4. Define semantic API and variants before implementation.
5. Reuse existing tokens; add tokens only at the correct token layer.
6. Implement as standalone Angular code.
7. Keep Tailwind bundles inside the design-system recipe/component.
8. Implement keyboard semantics, focus, accessible names and disabled/error states.
9. Add representative tests/examples.
10. Replace at least the initiating duplicate usage when appropriate.

Do not create feature-specific terminology inside generic design-system APIs.
