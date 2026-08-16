# Filter, search, and action bar

`FilterActionBarComponent` organizes high-frequency search, secondary filters, and caller-owned actions without knowing what records are being filtered. It supports dense desktop workbenches and progressive disclosure on narrow screens.

## API and composition

- Required: stable `id` and `accessibleName`.
- Optional: `filtersLabel`, `actionsLabel`, non-negative `activeFilterCount`, and two-way `filtersExpanded`.
- Project search content with `lsdFilterBarSearch`, secondary controls with `lsdFilterBarFilters`, and actions with `lsdFilterBarActions`.
- Projected controls retain their own typed design-system APIs, labels, values, validation, and events.

```html
<lsd-filter-action-bar id="library-tools" accessibleName="Library tools" [activeFilterCount]="activeCount()">
  <lsd-input lsdFilterBarSearch id="search" label="Search" />
  <div lsdFilterBarFilters><!-- select/checkbox filters --></div>
  <div lsdFilterBarActions><!-- primary or command-palette actions --></div>
</lsd-filter-action-bar>
```

## Accessibility and keyboard efficiency

Search is first in DOM and keyboard order. Filter and action groups are labeled. On narrow screens a native button exposes filter state with `aria-expanded` and `aria-controls`; the visible count also has screen-reader text. Collapsing while focus is within the filter group returns focus to the disclosure. Keyboard shortcuts and command-palette registration remain application concerns, so projected search/actions can participate without this pattern owning global key bindings.

## Responsive behavior

Desktop layouts keep search, filters, and actions dense and visible. Below the tablet breakpoint, search receives a full row, actions stay immediately available, and secondary filters collapse. Below the compact breakpoint, actions wrap across the available width. Expanding filters creates a single-column control stack.

## Do / don't

Do keep frequently used search and primary actions visible, place advanced criteria in the filter slot, and expose active-filter count. Do not hide the only recovery or creation action, duplicate feature query logic in this pattern, or use placeholder text instead of control labels.

## Appearance and visual coverage

Surface, border, text, count, hover, and focus behavior use semantic design-system foundations in both appearances. `filter-action-bar.visual.spec.ts` defines dense desktop, active filters, collapsed tablet, expanded mobile, and wrapped-action states for the workspace visual runner.
