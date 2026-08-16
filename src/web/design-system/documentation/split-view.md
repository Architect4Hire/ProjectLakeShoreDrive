# Split-view pattern

`SplitViewComponent` places source or decision context beside caller-owned editable output without knowing either domain record. It uses a breakpoint-aware contract: both panes remain visible on desktop, while tablet and mobile provide focused context/output navigation. The pattern composes existing Surface and Button primitives.

## Variants and API

- Required inputs: stable `id` and `accessibleName`.
- Optional labels: `contextLabel` and `outputLabel`.
- `ratio` is typed as `context-wide`, `balanced`, or `output-wide`; it affects desktop only.
- `compactPane` is a two-way `context | output` model and defaults to `output`.
- Project source/reference material with `lsdSplitViewContext` and editable or proposed content with `lsdSplitViewOutput`.

```html
<lsd-split-view
  id="section-comparison"
  accessibleName="Source and generated section"
  contextLabel="Source"
  outputLabel="Draft"
  ratio="context-wide"
  [(compactPane)]="visiblePane">
  <article lsdSplitViewContext><!-- source composition --></article>
  <form lsdSplitViewOutput><!-- editor composition --></form>
</lsd-split-view>
```

Projected content owns its data, form state, actions, scrolling strategy, and application behavior. Changing `compactPane` never destroys either pane, so unsaved control state remains mounted.

## Accessibility and interaction

The outer split view and each pane have required accessible names. Context precedes output in DOM order. On narrow screens, a labeled group of composed Buttons exposes the selected pane through `aria-pressed`. Switching moves focus to the newly visible region, giving keyboard and screen-reader users a deterministic navigation result. Pane headings and controls inside projected content retain their native semantics.

## Responsive behavior

At widths above 48rem, both panes are visible using the selected 3:2, 1:1, or 2:3 ratio. Below 48rem, the selected `compactPane` fills the width and the switcher appears. Below 30rem, the switcher uses equal-width controls and panel padding tightens. Projected tables, editors, and previews remain responsible for their documented overflow behavior.

## Do / don't

Do use split view when simultaneous context materially improves editing, comparison, or review. Choose a ratio based on the information task and preserve explicit labels. Do not import feature models or services, use pane position as the only label, squeeze both panes onto mobile, or duplicate Surface/Button implementations. Use master/detail instead when navigation between a collection and a selected record is the primary interaction.

## Appearance and visual coverage

Surfaces, borders, buttons, text, and focus treatment use semantic design-system APIs in both appearances. `split-view.visual.spec.ts` defines all ratios, context/output focused states, and desktop/tablet/mobile coverage for the workspace visual runner.
