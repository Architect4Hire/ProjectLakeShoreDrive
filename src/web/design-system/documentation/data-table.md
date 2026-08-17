# Data table

## Purpose

Use the data table for typed, comparable rows with stable identities and optional caller-owned actions.

`DataTableComponent<T, TAction>` is a typed shell for scanning and acting on structured records. The prior starter-derived wrapper supplied only table projection and horizontal overflow; it was replaced because it lacked standalone APIs, states, actions, and responsive adaptation.

## API

- Required: `accessibleName`, typed `rows`, typed `columns`, stable `rowKey`, and contextual `rowLabel`.
- Columns define stable ID, heading, typed value accessor, and optional alignment. `kind` additively opts a column into `identity` (avatar-style initials + primary/secondary text, via an `identity` accessor) or `chips` (a pill-list, via a `chips` accessor) rendering instead of plain text; existing text columns are unaffected.
- Optional typed `actions` emit `rowAction` with action identity and the original row. Caller-provided `disabled` predicates own action eligibility. `actionsDisplay` is `inline` (default; every action is its own visible, individually accessible-labeled button) or `menu` (collapses actions behind one native-popover kebab trigger per row — lower visual density, still keyboard/focus/dismiss-accessible via the browser's built-in Popover API).
- States: `loading`, `loadingMessage`, `emptyMessage`, and `error`; precedence is error, loading, empty, then populated.
- `density`: `comfortable` or `compact`; `responsiveMode`: `scroll` or `cards`.
- `selectable` opts in a checkbox column (header select-all with indeterminate state, one checkbox per row); `selectedRows` is a two-way-bindable `model()` holding selected row keys (from `rowKey`), not row objects, so it survives row-array replacement.
- `paginated` opts in a footer with a page-size select, an "X-Y of Z" range, and prev/next paging. `page`/`pageSize` are two-way-bindable `model()`s; `pageSizeOptions` defaults to `[10, 20, 50]` and always includes the current `pageSize` even if the caller didn't list it. Omit `totalCount` for client-side slicing of the full `rows()` array; provide it when the caller already fetched only the current page (the component then renders `rows()` as-is and drives the footer from `totalCount`).
- A `[lsdDataTableToolbar]`-selected content-projection slot renders above the table, auto-collapsing when empty. The design system intentionally does not know about "status"/"search"/"sort" as concepts — callers project their own filter controls into this slot; the component only supplies the layout shell.

## Accessibility and keyboard behavior

The desktop table retains native table, caption, column-header, row, and cell semantics. Its named overflow region is keyboard-focusable so keyboard users can scroll wide content. Row actions are named native buttons whose accessible name includes the row label. Loading uses a polite atomic status, errors use an alert, and empty content uses status semantics. Rows themselves are not made clickable.

## Responsive behavior

`scroll` preserves the semantic table inside a focused horizontal overflow region. `cards` is the explicit escape hatch: below the compact breakpoint, it replaces the visual table with a list of labeled definition-list cards and repeats native row actions. Choose cards only where scanning relationships across columns is less important than narrow-screen usability.

## Usage guidance

Do keep column accessors presentational and side-effect free, use stable keys, and provide concise contextual row labels. Do enforce authorization and workflow rules outside the component. Do not put feature models into the design system, attach click handlers to whole rows, or use a table for non-tabular layout.

## Appearance, motion, and visual coverage

Surfaces, borders, text, status states, and actions use semantic tokens in both appearances. The loading indicator is decorative and becomes static under reduced motion; textual loading status remains authoritative. `data-table.visual.spec.ts` defines populated, loading, empty, error, disabled-action, and mobile-card cases across both appearances for the workspace visual runner.

Do use `cards` when fields remain meaningful as labeled pairs. Don't conceal columns or action authorization inside the component.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { DataTableComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [DataTableComponent], templateUrl: './example.html' })
export class TableExampleComponent {}
```

```html
<lsd-data-table
  accessibleName="People"
  [rows]="rows"
  [columns]="columns"
  [rowKey]="rowKey"
  [rowLabel]="rowLabel"
/>
```
