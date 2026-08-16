# Tailwind boundary

Traceability: DS-004, DS-005, DS-006.

`foundations/tailwind.css` is the single production CSS entry for the design
system. It uses Tailwind CSS v4's CSS-first configuration and disables automatic
source discovery. Only production design-system implementation folders are
scanned; documentation, the starter snapshot, and application feature folders
are excluded.

## Design-system code

Code under `src/web/design-system` may use Tailwind layout, responsive,
spacing, typography, and state utilities as implementation detail. Product
colors must use the semantic utilities backed by `--lsd-color-*`. Do not use
arbitrary color values, starter aliases, plugin utilities, or dynamic class
names that Tailwind cannot discover as complete string literals.

## Feature code

Features should compose exported Angular components, layouts, patterns, and
recipes. The only Tailwind classes supported directly in feature code are the
explicitly safelisted semantic utilities:

- `bg-surface-page`, `bg-surface-panel`, `bg-surface-raised`
- `text-text-primary`, `text-text-muted`, `text-accent-primary`
- `text-status-success`, `text-status-warning`, `text-status-danger`,
  `text-status-info`
- `border-border-default`

These utilities are an escape hatch for semantic composition, not permission
to build page-specific utility bundles. Adding a supported utility requires a
documented design-system decision and an explicit `@source inline(...)` entry.
Recipes must export Angular composition, never copied starter class bundles.

## Build integration

Install Tailwind CSS v4 through the Angular build toolchain and list
`src/web/design-system/foundations/tailwind.css` in the workspace's global
styles. A production build must contain every class used by design-system
templates plus the documented feature-safe safelist. CI should fail if the CSS
entry cannot be compiled or a required selector is absent from its output.

