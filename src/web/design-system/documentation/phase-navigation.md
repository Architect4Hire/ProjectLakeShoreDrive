# Engagement phase navigation recipe

Traceability: DS-003, UX-002.

## Purpose

`PhaseNavigationComponent` presents the nine Lake Shore Drive engagement destinations in their canonical order: Overview, Discovery, Requirements, Architecture, ADRs, RAID, Estimates, Documents, and AI. It is a presentation recipe, not a router or lifecycle controller.

## Usage

```ts
readonly phaseStates: EngagementPhaseStates = {
  overview: 'completed',
  discovery: 'active',
  requirements: 'attention',
};

navigateToPhase(phase: EngagementPhase): void {
  // The consuming application performs its authorized routing.
}
```

```html
<lsd-phase-navigation
  label="Northwind engagement phases"
  [states]="phaseStates"
  (phaseRequested)="navigateToPhase($event)" />
```

Use it in `lsdEngagementHeaderContextSwitcher`, the workbench shell context slot, or a dedicated engagement rail.

## Inputs and output

- `label` provides the navigation landmark's accessible name.
- `orientation` is `horizontal` by default and may be `vertical` for a rail.
- `states` is a partial, immutable map keyed by the typed `EngagementPhase` union. Omitted entries render as `available`.
- `phaseRequested` emits the selected `EngagementPhase`. It does not mutate state or navigate.

The recipe owns the phase identities, labels, and canonical order. The application owns the state map, routes, authorization, and response to selection.

## States

- `available`: the destination is available with no supplemental status.
- `active`: adds “Current” and `aria-current="page"`.
- `completed`: adds a visible “Completed” success badge.
- `attention`: adds a visible “Needs attention” caution badge.

Supply at most one `active` phase. The component intentionally does not infer completion or validate workflow rules, because doing so would make it a state machine.

## Responsive behavior

Horizontal navigation remains a single scrollable row so canonical order and labels are preserved. At mobile widths it uses scroll snapping. Vertical orientation stacks full-width controls and is suitable for a desktop or tablet rail. The recipe never truncates a destination into an ambiguous abbreviation.

## Accessibility

- A labeled `nav` landmark contains an ordered list reflecting the canonical sequence.
- Every destination is a native button through the public button primitive and remains in the normal Tab order.
- Current state uses `aria-current="page"`; completed and attention states are expressed in visible badge text and accessible control names, not color alone.
- Controls meet the design system's minimum target size and inherit visible-focus behavior.
- This is navigation, not an in-page tab interface, so it does not use tablist roles or arrow-key-only navigation.

## Do / don't

Do derive `states` from already-authorized application data and handle `phaseRequested` in the route-owning feature. Preserve one active phase and concise translated labels if localization is added.

Don't infer phase progress, automatically activate the next phase, fetch counts, persist selection, hide destinations based on policy, or place router dependencies in the recipe.

## Visual regression

Capture light and dark appearances, horizontal desktop/mobile and vertical rail layouts, every state treatment, first and last phases active, mixed completed/attention states, keyboard focus, and horizontal overflow at narrow widths.
