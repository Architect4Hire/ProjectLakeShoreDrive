# Data table

`DataTableComponent<T, TAction>` is a typed shell for scanning and acting on structured records. The prior starter-derived wrapper supplied only table projection and horizontal overflow; it was replaced because it lacked standalone APIs, states, actions, and responsive adaptation.

## API

- Required: `accessibleName`, typed `rows`, typed `columns`, stable `rowKey`, and contextual `rowLabel`.
- Columns define stable ID, heading, typed value accessor, and optional alignment.
- Optional typed `actions` emit `rowAction` with action identity and the original row. Caller-provided `disabled` predicates own action eligibility.
- States: `loading`, `loadingMessage`, `emptyMessage`, and `error`; precedence is error, loading, empty, then populated.
- `density`: `comfortable` or `compact`; `responsiveMode`: `scroll` or `cards`.

## Accessibility and keyboard behavior

The desktop table retains native table, caption, column-header, row, and cell semantics. Its named overflow region is keyboard-focusable so keyboard users can scroll wide content. Row actions are named native buttons whose accessible name includes the row label. Loading uses a polite atomic status, errors use an alert, and empty content uses status semantics. Rows themselves are not made clickable.

## Responsive behavior

`scroll` preserves the semantic table inside a focused horizontal overflow region. `cards` is the explicit escape hatch: below the compact breakpoint, it replaces the visual table with a list of labeled definition-list cards and repeats native row actions. Choose cards only where scanning relationships across columns is less important than narrow-screen usability.

## Usage guidance

Do keep column accessors presentational and side-effect free, use stable keys, and provide concise contextual row labels. Do enforce authorization and workflow rules outside the component. Do not put feature models into the design system, attach click handlers to whole rows, or use a table for non-tabular layout.

## Appearance, motion, and visual coverage

Surfaces, borders, text, status states, and actions use semantic tokens in both appearances. The loading indicator is decorative and becomes static under reduced motion; textual loading status remains authoritative. `data-table.visual.spec.ts` defines populated, loading, empty, error, disabled-action, and mobile-card cases across both appearances for the workspace visual runner.
