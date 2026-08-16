# Project Lake Shore Drive — Design System Transformation SCRUB Microprompts

> Codex-oriented, seam-by-seam prompts for transforming **https://github.com/lannodev/angular-tailwind** into the production Lake Shore Drive Design System.

## Purpose

This document builds the design system **outside the main Lake Shore Drive feature implementation sequence**. The public starter is a source of Angular/Tailwind implementation material; the canonical Lake Shore Drive requirements remain the authority.

The starter currently provides Angular 22, Tailwind 4, standalone components, Signals, multiple themes, sidebar/navbar/dashboard/auth examples, Playwright E2E capability, and an MIT license. The goal is not to preserve an admin template. The goal is to **curate, harden, normalize, document, and package a first-class architecture-workbench design system**.

## Required target

The final drop-in source lives at:

`src/web/design-system/`

with the required layers:

```text
src/web/design-system/
  tokens/
  foundations/
  primitives/
  components/
  patterns/
  recipes/
  layouts/
  icons/
  utilities/
  documentation/
```

## Non-negotiable operating rules

- **One prompt = one primary change.** Never combine cleanup, redesign, migration, and feature work in one step.
- Open `docs/requirements/requirements.md` before every implementation step that changes behavior.
- Requirements and approved ADRs win over the starter repository.
- Preserve applicable third-party license/attribution notices.
- Angular 22 standalone APIs and signals-first state are the default.
- Tailwind is an implementation mechanism **behind** the design system, not the feature-facing design API.
- Semantic tokens replace direct palette/color decisions in production components.
- WCAG 2.2 AA behavior is part of component correctness.
- Light/dark appearance must be token-driven.
- AI-generated/suggested content must remain visually distinguishable from architect-approved content.
- Do not pull product APIs, persistence, auth services, AI provider logic, or feature-domain models into the design system.
- Every production public component/recipe requires documentation and test evidence.
- Every prompt ends with verification and `STOP`.

## Codex handoff rule

Execute these prompts **in order**. Do not ask Codex to “build the design system” in one pass. Commit after coherent verified seams. If a step exposes a requirement conflict or missing architectural decision, stop that sequence, resolve the decision, then continue.

---

# Phase 0 — Source truth and transformation gates

## Prompt DS-000 — Inventory the starter repository without changing it

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..014; TR-WEB-001..010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Clone or inspect the lannodev/angular-tailwind starter and produce a read-only inventory of Angular version, Tailwind version, source layout, routes, components, themes, dependencies, tests, assets, and reusable shell patterns.

CONSTRAINT: Treat the starter as reference material to be transformed into a Lake Shore Drive-owned design system.

RESTRICTION: Do not edit files, install packages, delete demo code, or make naming decisions.

USAGE: Record exact source paths for candidate primitives, components, layouts, theme assets, and tests.

BEHAVIOR: Report reusable assets, obsolete/demo-only assets, dependency risks, and clean git status. STOP.
```

## Prompt DS-001 — Bind the Lake Shore Drive design-system requirements

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..014; UX-001..007; UX-DOC-001..005; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Build a requirement checklist covering every design-system, workbench UX, document-editor UX, and prompt-enforcement requirement that the transformed system must satisfy.

CONSTRAINT: Use requirement IDs exactly as written in docs/requirements/requirements.md.

RESTRICTION: Do not implement components or modify requirements.

USAGE: Group requirements by tokens, foundations, primitives, components, patterns, recipes, layouts, accessibility, responsive behavior, theming, AI UX, documentation, and test coverage.

BEHAVIOR: Output the checklist and identify any requirement that cannot yet be mapped to starter capability. STOP.
```

## Prompt DS-002 — Define the transformation boundary

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..005; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a concise transformation plan separating code to preserve, adapt, replace, remove, and add.

CONSTRAINT: The final artifact must be a local production design system under src/web/design-system, not a fork-shaped admin application embedded inside the product.

RESTRICTION: Do not change code yet and do not preserve starter concepts merely because they exist.

USAGE: Favor architecture-neutral UI capability over starter dashboard business assumptions.

BEHAVIOR: Return the plan with rationale and explicit non-goals. STOP.
```

## Prompt DS-003 — Verify license and attribution obligations

```text
REQUIREMENTS:
  TRACEABILITY: DS-001; repository governance
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Inspect the starter license and determine the attribution/license files that must accompany copied or adapted source.

CONSTRAINT: Preserve required notices while allowing Lake Shore Drive ownership of transformed code.

RESTRICTION: Do not alter third-party license text.

USAGE: Record source repository, license type, and files requiring retention.

BEHAVIOR: Create or update only the design-system third-party notice/attribution document if required. STOP.
```


# Phase 1 — Extract the production design-system boundary

## Prompt DS-004 — Create the design-system root structure

```text
REQUIREMENTS:
  TRACEABILITY: DS-002..003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create src/web/design-system with tokens, foundations, primitives, components, patterns, recipes, layouts, icons, utilities, documentation, and testing support folders.

CONSTRAINT: Keep the structure importable by the Angular workspace and aligned exactly to DS-003.

RESTRICTION: Do not move starter components into the folders yet.

USAGE: Add minimal barrel/public-api placeholders only where needed to establish boundaries.

BEHAVIOR: Verify the workspace still builds. STOP.
```

## Prompt DS-005 — Create the design-system public API boundary

```text
REQUIREMENTS:
  TRACEABILITY: DS-002..005; DS-007
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Define the public import surface for src/web/design-system so application features can consume supported APIs without importing private implementation paths.

CONSTRAINT: Public exports must be deliberate, strongly typed, and stable enough for feature composition.

RESTRICTION: Do not expose internal helpers, demo routes, or implementation-only Tailwind utilities.

USAGE: Use a single documented public entry point or a small documented set of layer entry points.

BEHAVIOR: Add an import-boundary test or lint rule if the workspace supports it; verify legal imports compile. STOP.
```

## Prompt DS-006 — Copy only required starter assets into the design-system work area

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Copy candidate reusable starter source into the Lake Shore Drive design-system work area while preserving source attribution and history notes.

CONSTRAINT: Copy only assets identified in the approved transformation plan.

RESTRICTION: Do not yet redesign components or delete the starter worktree/source snapshot if it is being used for comparison.

USAGE: Keep source and transformed code clearly distinguishable during migration.

BEHAVIOR: Verify copied files are accounted for in the transformation inventory. STOP.
```

## Prompt DS-007 — Remove application-specific starter business concepts from copied code

```text
REQUIREMENTS:
  TRACEABILITY: DS-003..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Remove dashboard/auth/demo business assumptions from the copied design-system code while retaining reusable visual and interaction capability.

CONSTRAINT: Design-system code must be business-neutral except for explicit Lake Shore Drive recipes.

RESTRICTION: Do not remove a reusable primitive merely because its starter example is dashboard-specific.

USAGE: Replace hard-coded starter labels/data with typed inputs, content projection, or documentation examples.

BEHAVIOR: Verify no design-system primitive depends on starter dashboard domain models. STOP.
```


# Phase 2 — Tokens, foundations, themes, and Tailwind boundary

## Prompt DS-008 — Inventory all hard-coded visual values

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..006; DS-010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Find hard-coded colors, spacing, radii, shadows, typography values, z-index values, breakpoints, and motion durations in the transformed design-system source.

CONSTRAINT: Produce a token migration inventory before changing the values.

RESTRICTION: Do not mass-replace values in this step.

USAGE: Group duplicate values and distinguish primitive/raw tokens from semantic intent.

BEHAVIOR: Report candidates for semantic token consolidation. STOP.
```

## Prompt DS-009 — Define primitive color tokens

```text
REQUIREMENTS:
  TRACEABILITY: DS-006; DS-010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create machine-readable primitive color scales used only as the raw palette beneath semantic tokens.

CONSTRAINT: Raw colors are implementation detail; feature code must never depend on them directly.

RESTRICTION: Do not wire component themes yet.

USAGE: Preserve sufficient contrast range for light/dark themes and WCAG 2.2 AA targets.

BEHAVIOR: Verify token compilation/type generation if applicable. STOP.
```

## Prompt DS-010 — Define semantic color tokens

```text
REQUIREMENTS:
  TRACEABILITY: DS-006; DS-010; DS-014
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create semantic tokens including surface-page, surface-panel, surface-raised, text-primary, text-muted, border-default, status-success, status-warning, status-danger, status-info, accent-primary, and AI draft/approved distinctions.

CONSTRAINT: Semantic names describe intent, not palette color names.

RESTRICTION: Do not style individual feature recipes yet.

USAGE: Map semantic tokens to light and dark appearances.

BEHAVIOR: Verify every required semantic token resolves in both appearances. STOP.
```

## Prompt DS-011 — Define typography tokens and foundation

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-006; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create typography family, size, line-height, weight, and letter-spacing tokens plus the global typography foundation.

CONSTRAINT: Typography must support dense architecture workbench screens and long-form document editing.

RESTRICTION: Do not create page-specific typography classes.

USAGE: Use semantic text roles and accessible rem-based sizing.

BEHAVIOR: Verify representative heading, body, label, metadata, code, and document prose roles. STOP.
```

## Prompt DS-012 — Define spacing and sizing tokens

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-006; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create spacing and sizing scales for control heights, content gutters, dense rows, panels, and responsive layout.

CONSTRAINT: Use a coherent scale rather than preserving arbitrary starter values.

RESTRICTION: Do not alter component markup yet.

USAGE: Include touch target considerations for narrow layouts.

BEHAVIOR: Verify the token set covers current starter components without unexplained one-off values. STOP.
```

## Prompt DS-013 — Define radius, border, elevation, and z-index tokens

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-006
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create token sets for radius, borders, shadows/elevation, and z-index layers.

CONSTRAINT: Overlay stacking must be deterministic and documented.

RESTRICTION: Do not introduce component-specific magic z-index values.

USAGE: Define semantic elevation and overlay layers.

BEHAVIOR: Verify dialogs, drawers, tooltips, popovers, and sticky workbench regions can be represented. STOP.
```

## Prompt DS-014 — Define motion and reduced-motion tokens

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create duration/easing tokens and reduced-motion behavior for interactive UI.

CONSTRAINT: Motion must never be required to understand state.

RESTRICTION: Do not add decorative animation beyond existing capability.

USAGE: Respect prefers-reduced-motion and Angular accessibility behavior.

BEHAVIOR: Verify all base transitions can be disabled or simplified. STOP.
```

## Prompt DS-015 — Define focus and accessibility foundations

```text
REQUIREMENTS:
  TRACEABILITY: DS-008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create consistent focus-visible, disabled, invalid, readonly, and screen-reader utility foundations.

CONSTRAINT: Native semantics and visible focus are mandatory.

RESTRICTION: Do not hide outlines without an accessible replacement.

USAGE: Use reusable utilities/foundations rather than per-component hacks.

BEHAVIOR: Verify keyboard focus is visible against both light and dark surfaces. STOP.
```

## Prompt DS-016 — Create light and dark appearance contracts

```text
REQUIREMENTS:
  TRACEABILITY: DS-010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Implement the appearance switching contract using semantic tokens.

CONSTRAINT: Feature and component APIs must not know raw theme palette values.

RESTRICTION: Do not add more theme variants in this step.

USAGE: Retain useful starter multi-theme machinery only if it reinforces semantic-token ownership.

BEHAVIOR: Verify a deterministic light/dark switch with persisted preference only if the design-system contract owns that behavior. STOP.
```

## Prompt DS-017 — Retire direct starter palette usage

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..006; DS-010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Replace transformed design-system hard-coded theme colors with semantic token references.

CONSTRAINT: No production design-system component should encode product colors directly when a semantic token exists.

RESTRICTION: Do not touch Lake Shore Drive feature code.

USAGE: Migrate one layer at a time and keep builds green.

BEHAVIOR: Run the visual/token scan and report remaining justified exceptions. STOP.
```

## Prompt DS-018 — Establish the Tailwind boundary

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..006
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Configure Tailwind so it implements design-system internals and semantic utilities without becoming the public feature API.

CONSTRAINT: Application features should compose Angular design-system APIs and documented semantic utilities only.

RESTRICTION: Do not export arbitrary starter utility bundles as recipes.

USAGE: Document which Tailwind usage is allowed inside design-system code versus feature code.

BEHAVIOR: Verify design-system classes are generated in production builds. STOP.
```

## Prompt DS-019 — Create a duplication detection rule

```text
REQUIREMENTS:
  TRACEABILITY: DS-004..005; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Add a lightweight static check or documented lint strategy that flags repeated long Tailwind class bundles in feature code and private-path imports from the design system.

CONSTRAINT: The rule should guide developers without blocking legitimate one-off layout utilities unnecessarily.

RESTRICTION: Do not rewrite feature pages in this step.

USAGE: Favor import-boundary enforcement plus targeted class-pattern detection.

BEHAVIOR: Verify the rule catches at least one synthetic violation. STOP.
```


# Phase 3 — Primitive controls

## Prompt DS-020 — Create the Button primitive

```text
REQUIREMENTS:
  TRACEABILITY: DS-003..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a strongly typed standalone Button primitive with semantic variants, sizes, loading/disabled states, icon composition, keyboard behavior, and accessible native button semantics.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-021 — Create the Icon primitive and registry

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create the design-system icon abstraction using the retained starter icon capability where appropriate, with typed names, accessible decorative/informative modes, and no direct feature dependency on icon implementation.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-022 — Create the Badge and status primitives

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-006..008; DS-014
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create badge/status primitives for neutral, info, success, warning, danger, AI-draft, suggested, approved, deprecated, and archived states.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-023 — Create the Surface and Separator primitives

```text
REQUIREMENTS:
  TRACEABILITY: DS-003..006
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create reusable surface/panel and separator primitives using semantic background, border, elevation, radius, and spacing contracts.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-024 — Create the Text Input primitive

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a typed input primitive supporting label, description, required, disabled, readonly, error, prefix/suffix, and accessible error association.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-025 — Create the Textarea primitive

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a textarea primitive suitable for discovery answers and long-form architecture notes with accessible labels, errors, resize behavior, and density options.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-026 — Create the Select primitive

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an accessible select primitive with typed option values and consistent label/help/error behavior.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-027 — Create Checkbox and Radio primitives

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create checkbox and radio primitives with native semantics, grouped labeling, keyboard behavior, indeterminate support where appropriate, and errors.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```

## Prompt DS-028 — Create the Tooltip primitive

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an accessible tooltip primitive for supplemental non-critical information, with keyboard/focus support and correct dismissal behavior.

CONSTRAINT: Use Angular 22 standalone APIs, signals-first component state, typed APIs, semantic tokens, and accessible native semantics.

RESTRICTION: Do not add feature-specific business rules or duplicate raw Tailwind bundles outside the primitive.

USAGE: Adapt useful starter implementations only when they satisfy the Lake Shore Drive contract; otherwise replace them cleanly.

BEHAVIOR: Add focused unit/component tests and documentation; verify keyboard and both appearances. STOP.
```


# Phase 4 — Composite components

## Prompt DS-029 — Create the Dialog component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..010
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an accessible modal dialog with focus management, escape/close behavior, labeled title/description, actions composition, and responsive sizing.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-030 — Create the Drawer component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..010; DS-013
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a responsive drawer/slideover appropriate for source preview and AI generation workflows, including focus management and overlay behavior.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-031 — Create Tabs component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create keyboard-accessible tabs with strongly typed tab identity, roving focus or equivalent compliant interaction, and responsive overflow behavior.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-032 — Create Stepper component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a generic stepper/progress navigation component usable by discovery and multi-stage workbench flows without embedding domain state rules.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-033 — Create Status Banner component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-006..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a status/alert banner supporting semantic severity, title/body/actions, dismissibility when appropriate, and screen-reader announcements.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-034 — Create Toast/notification component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create or adapt the starter notification mechanism behind a Lake Shore Drive design-system API with accessible live-region behavior and typed severity.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-035 — Create Data Table component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a composable data-table shell with typed columns/configuration or content projection, loading/empty/error states, row actions, keyboard-friendly interaction, and responsive escape hatch.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-036 — Create Filter Bar component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-009; UX-006..007
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a business-neutral filter/search/action bar that supports dense desktop filtering and collapses intelligently on narrow screens.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-037 — Create Command Palette component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-001; UX-006
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a command palette UI contract with search, grouped commands, keyboard invocation, focus management, and typed command selection.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-038 — Create File Picker component

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-007..009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a file-picker/dropzone component with keyboard-accessible browse action, drag/drop enhancement, file validation messaging, and progress/error presentation hooks.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```

## Prompt DS-039 — Create Structured Editor shell

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-DOC-001..003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a business-neutral structured editor shell for ordered sections with toolbar/action slots, dirty/saving states, and split-view composition hooks.

CONSTRAINT: Use standalone Angular 22, signals-first state, semantic tokens, WCAG 2.2 AA behavior, and public design-system APIs only.

RESTRICTION: Do not couple the component to Engagement, Requirement, ADR, or other feature data models.

USAGE: Preserve useful starter behavior where it is production-quality; replace demo-only assumptions.

BEHAVIOR: Add tests, docs, responsive verification, and visual-regression coverage for critical states. STOP.
```


# Phase 5 — Business-neutral UX patterns

## Prompt DS-040 — Create Empty/Loading/Error state patterns

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-011; UX-007
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create standardized empty, loading, skeleton, recoverable error, and terminal error patterns with action slots and accessible status announcements.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-041 — Create Master/Detail pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-003; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a responsive master/detail pattern that can present list + detail on desktop and focused navigation on narrow screens.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-042 — Create Split View pattern

```text
REQUIREMENTS:
  TRACEABILITY: UX-003; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a resizable or breakpoint-aware split-view pattern for source/context beside editable output, without assuming a specific domain record.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-043 — Create Review/Approval pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-004; GOV-002
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a generic review/approval pattern with proposed/current state presentation, accept/reject actions, provenance slot, and explicit approval affordance.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-044 — Create Activity Stream pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; GOV-001
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an activity/history stream pattern with actor, timestamp, action, source/AI attribution, and expandable details.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-045 — Create Form Section pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-007
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a form-section pattern for dense workbench editors with title, guidance, actions, errors, and progressive disclosure.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```

## Prompt DS-046 — Create Search Results pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-006..007
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a search-results pattern with query state, facets/filter slot, result metadata, empty/error states, and keyboard-friendly result navigation.

CONSTRAINT: Patterns compose existing design-system primitives/components; they do not reimplement them.

RESTRICTION: Do not import feature models or feature services.

USAGE: Use content projection and typed configuration only where it improves clarity.

BEHAVIOR: Document composition, responsive behavior, and accessibility; add tests for interaction states. STOP.
```


# Phase 6 — AI-specific UX patterns

## Prompt DS-047 — Create AI Draft badge and attribution treatment

```text
REQUIREMENTS:
  TRACEABILITY: DS-013..014; GOV-002
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a standardized visual treatment that clearly distinguishes AI-drafted/suggested/generated content from human-approved content.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-048 — Create Generating state pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; DS-008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an AI generating/progress pattern with cancellable/progress hooks, accessible announcements, and reduced-motion behavior.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-049 — Create AI Suggestion Review pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-013..014; UX-004
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create suggested-change presentation with before/after or proposed content, Accept, Reject, and provenance/context slots.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-050 — Create Citation Chip component

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; UX-DOC-004; TR-RAG-004..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a citation chip with stable source identifier, source title/section display, keyboard activation, and source-preview trigger contract.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-051 — Create Source Preview panel

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; UX-DOC-004; TR-RAG-005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a source-preview drawer/panel pattern showing resolvable source metadata and selected passage/context without embedding retrieval logic.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-052 — Create AI Confidence/Caution treatment

```text
REQUIREMENTS:
  TRACEABILITY: DS-013..014
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create semantic caution/confidence presentation that communicates uncertainty without presenting unsupported numeric certainty as fact.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-053 — Create Regenerate and Compare Versions pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; UX-DOC-002..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create UI composition for regenerate actions and version comparison while maintaining clear current/draft/approved distinctions.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-054 — Create Prompt/Context Inspector pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; UX-DOC-003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an authorized-user inspector pattern for prompt version, selected context, sources, model metadata, and generation metadata; UI only.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```

## Prompt DS-055 — Create AI Failure state pattern

```text
REQUIREMENTS:
  TRACEABILITY: DS-013; DS-008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an AI-specific recoverable/terminal failure presentation with retry, inspect details, and report/copy correlation hooks where authorized.

CONSTRAINT: AI UI must never visually masquerade as architect-approved content and must compose established primitives.

RESTRICTION: Do not implement model calls, retrieval, authorization policy, or backend AI logic.

USAGE: Expose typed presentation contracts only; all sensitive data decisions remain with consuming application code.

BEHAVIOR: Document states and add accessibility plus visual-regression tests. STOP.
```


# Phase 7 — Workbench layouts and Lake Shore Drive recipes

## Prompt DS-056 — Adapt the starter application shell into a Workbench Shell layout

```text
REQUIREMENTS:
  TRACEABILITY: UX-001; DS-003; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Transform reusable starter sidebar/navbar/footer capability into a Lake Shore Drive workbench shell layout with slots for primary navigation, engagement context, global search, command palette, notifications/tasks, user menu, and content.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-057 — Create Engagement Header recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-001..002
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create the Lake Shore Drive engagement-header recipe from design-system components, with slots/typed inputs for engagement identity, client metadata, status, actions, and context switching.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-058 — Create Engagement Phase Rail recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-002
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a phase-navigation recipe for Overview, Discovery, Requirements, Architecture, ADRs, RAID, Estimates, Documents, and AI with active/completed/attention states.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-059 — Create Requirement Matrix Row recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a dense requirement-row composition recipe with requirement ID, title, status, priority, traceability/evidence, actions, and narrow-screen adaptation.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-060 — Create ADR Card recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create an ADR summary recipe showing status, decision, rationale summary, linked requirements/patterns, provenance, and actions.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-061 — Create RAID Register recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a RAID register composition recipe with type, description, owner, severity/probability/impact, status, and responsive presentation.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-062 — Create Source Citation Panel recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-013; UX-DOC-004
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create the Lake Shore Drive source-citation composition using citation chips, source preview, metadata, and selection state.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-063 — Create AI Generation Drawer recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; DS-013..014; UX-DOC-002..003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create the AI generation drawer recipe with operation, context selection summary, generation state, sources, result preview, provenance, and review actions.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-064 — Create Document Section Editor recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-DOC-001..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create the document-section editor recipe composing structured editor, section actions, citations, provenance, saving state, approval state, and version history access.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-065 — Create Approval Bar recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-004; GOV-002
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a sticky/contained approval-action recipe with review status, provenance, validation warnings, approve/reject/request-change actions, and narrow-screen adaptation.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-066 — Create Architecture Decision Comparison recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; UX-003
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a side-by-side/stacked comparison recipe for current versus proposed decisions or historical versus new ADR content.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```

## Prompt DS-067 — Create Knowledge Result Card recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-003; TR-RAG-004..006
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a knowledge-search result recipe showing title, artifact type, engagement/client scope indicator, excerpt, tags, approval/confidentiality state, and citation/source actions.

CONSTRAINT: Recipes may be Lake Shore Drive-specific but must only compose public primitives/components/patterns and remain free of backend services.

RESTRICTION: Do not implement product data fetching, persistence, authorization, or workflow state machines.

USAGE: Use typed view models/interfaces owned by the design-system recipe only when necessary for presentation.

BEHAVIOR: Document use, states, responsive behavior, and accessibility; add visual-regression coverage. STOP.
```


# Phase 8 — Documentation, quality gates, and drop-in packaging

## Prompt DS-068 — Create the design-system documentation index

```text
REQUIREMENTS:
  TRACEABILITY: DS-011
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create documentation navigation that lists every production token family, foundation, primitive, component, pattern, recipe, and layout.

CONSTRAINT: Documentation is part of the design-system deliverable.

RESTRICTION: Do not document removed starter demo components as supported APIs.

USAGE: Link each item to purpose, variants, API, accessibility, examples, do/dont, and responsive guidance.

BEHAVIOR: Verify there are no undocumented public exports. STOP.
```

## Prompt DS-069 — Document every public production component and recipe

```text
REQUIREMENTS:
  TRACEABILITY: DS-011
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Fill the required documentation contract for each public component and recipe.

CONSTRAINT: Documentation must match actual typed APIs and current behavior.

RESTRICTION: Do not invent unsupported variants.

USAGE: Include copy-pastable Angular usage examples that import only public design-system APIs.

BEHAVIOR: Run a documentation completeness check and report gaps. STOP.
```

## Prompt DS-070 — Establish visual-regression test harness

```text
REQUIREMENTS:
  TRACEABILITY: DS-012
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Configure visual regression for production components and critical Lake Shore Drive recipes using the existing Playwright capability or the repository-approved equivalent.

CONSTRAINT: Tests must be deterministic across light/dark and representative responsive widths.

RESTRICTION: Do not snapshot transient animation frames or random content.

USAGE: Use stable test fixtures and explicit viewport/state matrices.

BEHAVIOR: Generate initial approved baselines and verify a deliberate visual change fails comparison. STOP.
```

## Prompt DS-071 — Add accessibility test harness

```text
REQUIREMENTS:
  TRACEABILITY: DS-008
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Add automated accessibility checks for representative component and recipe states.

CONSTRAINT: Automation supplements but does not replace keyboard/manual semantic verification.

RESTRICTION: Do not suppress violations without documented rationale.

USAGE: Cover focus, names, roles, contrast where tool-supported, errors, dialogs/drawers, live regions, and reduced motion.

BEHAVIOR: Run the suite and report zero unexplained critical/serious violations. STOP.
```

## Prompt DS-072 — Add responsive behavior matrix tests

```text
REQUIREMENTS:
  TRACEABILITY: DS-009
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create tests for desktop, tablet, and mobile behavior of shell, tables, split views, drawers, phase navigation, and dense recipes.

CONSTRAINT: Narrow layouts must remain functional rather than merely shrink desktop UI.

RESTRICTION: Do not require horizontal desktop tables where card/detail adaptation is specified.

USAGE: Use representative widths and keyboard paths.

BEHAVIOR: Verify each critical recipe has a documented narrow-screen behavior. STOP.
```

## Prompt DS-073 — Add design-system architecture conformance tests

```text
REQUIREMENTS:
  TRACEABILITY: DS-002..007; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Add automated checks for public import boundaries, forbidden feature imports, semantic token usage, and absence of application service dependencies inside design-system code.

CONSTRAINT: The design system may depend on Angular and approved UI libraries but not product feature modules.

RESTRICTION: Do not add brittle checks based solely on folder-name coincidence.

USAGE: Prefer TypeScript dependency analysis, lint boundaries, and focused static scans.

BEHAVIOR: Prove each rule catches a synthetic violation and passes current source. STOP.
```

## Prompt DS-074 — Run starter-to-design-system dead-code removal

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..005
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Remove remaining starter demo pages, auth/dashboard business examples, unused dependencies, obsolete assets, and unreachable styles that are not part of the production design system.

CONSTRAINT: Retain license notices and any assets intentionally documented as design-system examples.

RESTRICTION: Do not remove dependencies still required by public components or tests.

USAGE: Use build graph, search, and test coverage to justify removals.

BEHAVIOR: Verify clean install, build, test, lint, and E2E/visual suites. STOP.
```

## Prompt DS-075 — Create the drop-in integration manifest

```text
REQUIREMENTS:
  TRACEABILITY: DS-002..005; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a machine/human-readable integration manifest describing exactly what must be copied into Project Lake Shore Drive, required package dependencies, global style imports, Tailwind/PostCSS configuration, public API imports, assets, and test support.

CONSTRAINT: The target installation location is src/web/design-system.

RESTRICTION: Do not assume the target app can consume hidden files from the source starter repository.

USAGE: List files/directories and dependency/configuration deltas explicitly.

BEHAVIOR: Verify the manifest contains everything needed for a clean integration. STOP.
```

## Prompt DS-076 — Create the design-system acceptance checklist

```text
REQUIREMENTS:
  TRACEABILITY: DS-001..014; UX-001..007; UX-DOC-001..005; BR-144
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Create a final acceptance checklist mapped requirement-by-requirement to implementation, tests, and documentation.

CONSTRAINT: Every DS requirement must have evidence or an explicit gap.

RESTRICTION: Do not mark requirements complete based only on visual similarity.

USAGE: Include build, lint, tests, visual regression, accessibility, responsive, public API, license, and integration-manifest evidence.

BEHAVIOR: Report PASS/FAIL per requirement and STOP on any unexplained FAIL. STOP.
```

## Prompt DS-077 — Produce the Lake Shore Drive design-system drop folder

```text
REQUIREMENTS:
  TRACEABILITY: DS-002; DS-011..012
  REQUIREMENT LINKS: [Project Lake Shore Drive requirements](../requirements/requirements.md)
  SOURCE STARTER: https://github.com/lannodev/angular-tailwind
  SOURCE OF TRUTH: Read the canonical requirements before changing code. Requirements win over the starter repository. The starter is implementation material, not product authority.

SCOPE: Produce the final clean design-system folder and integration-support files exactly as defined by the approved integration manifest.

CONSTRAINT: Output must be ready to copy into Project Lake Shore Drive without node_modules, build artifacts, caches, or source-repo git metadata.

RESTRICTION: Do not include unrelated starter application code.

USAGE: Re-run clean build/test from the transformed source before packaging/copying.

BEHAVIOR: Report the exact folder tree, dependency deltas, verification commands, and checksum/commit reference for the source revision used. STOP.
```

---
# Completion definition

The transformation is complete only when:

1. `src/web/design-system/` matches DS-003 layering.
2. Public design-system imports are explicit and private imports are enforceably blocked.
3. Feature-facing visual APIs are semantic rather than copied Tailwind bundles.
4. Required primitives, components, patterns, recipes, layouts, and AI UX states exist.
5. Light/dark, responsive, keyboard, focus, error, reduced-motion, and screen-reader behaviors are verified.
6. Every production component/recipe is documented.
7. Visual-regression and accessibility suites pass.
8. Starter demo/business code and unused dependencies are removed.
9. License/attribution obligations are preserved.
10. The drop-in integration manifest is complete and the output is ready for `src/web/design-system/` in Project Lake Shore Drive.
