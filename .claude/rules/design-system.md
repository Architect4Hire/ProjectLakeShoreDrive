---
paths:
  - "src/web/design-system/**/*"
  - "src/web/app/**/*"
---

# Lake Shore Drive Design System rules

The source of truth is `src/web/design-system/`.

The design system owns domain-neutral:

- primitive/semantic tokens;
- typography;
- spacing;
- radii/elevation;
- Tailwind recipes;
- layout primitives;
- controls and form-field patterns;
- navigation and shells;
- surfaces/cards;
- dialogs/drawers/notifications;
- loading/empty/error states;
- progress/workflow/generation status patterns.

Rules:

- Reuse an existing primitive before creating a new one.
- Extend a recipe before copying long Tailwind bundles.
- Feature components may own feature-specific layout, not new global visual primitives.
- Keep design-system APIs domain-neutral.
- Use semantic token names rather than literal visual meaning when possible.
- Accessibility is part of the component contract.
- Support keyboard navigation, focus visibility, labels, reduced motion and contrast.
- Do not duplicate design tokens in feature folders.
- Do not add a second component framework without an ADR.
- Prefer composition over configuration-heavy mega-components.
- Keep variants explicit and typed.
- A design-system change needs focused visual/behavior tests where appropriate.
