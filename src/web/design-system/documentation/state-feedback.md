# State feedback patterns

`StateFeedbackComponent` standardizes empty, loading, skeleton, recoverable-error, and terminal-error presentation. It composes the existing Surface and Alert Banner APIs; features retain ownership of copy, retry/navigation behavior, and data state.

## Variants and API

- Required inputs: stable `id`, typed `kind`, and `title`.
- Optional inputs: `description` and a clamped `skeletonLines` count (1–10).
- Project actions with `lsdStateActions`. Compose `ButtonComponent` or another public interactive API rather than raw pattern-owned controls.
- Project ordinary supporting content into the default slot.
- For secondary diagnostics, provenance, or metadata, project `StateFeedbackDetailsComponent` with `lsdStateDetails`; its native disclosure starts collapsed.

```html
<lsd-state-feedback
  id="requirements-error"
  kind="recoverable-error"
  title="Requirements could not be loaded"
  description="Your saved requirements are unchanged.">
  <lsd-button lsdStateActions (activated)="retry()">Retry</lsd-button>
  <lsd-state-details lsdStateDetails label="Technical details">
    Request identifier: {{ requestId() }}
  </lsd-state-details>
</lsd-state-feedback>
```

## Accessibility and interaction

Loading and skeleton states expose `role="status"` and `aria-busy="true"`; skeleton bars are decorative. Empty states announce politely. Recoverable errors use an alert role with a polite live region so retry remains calm and actionable. Terminal errors announce assertively. Titles and descriptions are programmatically associated. Native `<details>`/`<summary>` supplies keyboard interaction and progressive disclosure without hiding decision-critical recovery actions.

Motion never communicates state by itself. The loading spinner has accompanying text and stops under `prefers-reduced-motion` through the shared motion foundation.

## Responsive behavior

Wide layouts center concise state copy and wrap action groups. Below the compact breakpoint, copy aligns to the reading direction and actions stack to preserve touch targets. Details occupy the available width. No horizontal scrolling is required.

## Do / don't

Do explain what happened, whether data is safe, and the next useful action. Use recoverable error when retry or navigation can resolve the condition; reserve terminal error for a state the current flow cannot recover from. Keep deeper diagnostics and provenance in the details slot. Do not place essential recovery instructions only inside collapsed details, invent feature-specific spinners/skeletons, or bind this pattern to feature services or models.

## Visual coverage

`state-feedback.visual.spec.ts` defines all five states across light/dark appearances, desktop/mobile layouts, action wrapping, and expanded diagnostics for the workspace visual runner.
