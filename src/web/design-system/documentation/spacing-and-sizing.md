# Spacing and sizing

Traceability: DS-003, DS-006, DS-009.

`spacingScale` is a coherent 4px-based raw scale, with half steps only where
compact controls need them. Application code should prefer the intent-based
`spacingTokens`, `controlSizes`, `rowSizes`, `contentGutters`, and `panelSizes`.
All fixed dimensions are expressed in `rem`; full-viewport and fluid sizing
remain CSS layout concerns.

## Responsive use

- Narrow layouts use the `narrow` gutter and controls that meet the `touch`
  minimum of 2.75rem (44px at the default root size).
- Tablet and desktop layouts increase gutters without changing content order.
- Dense rows are 2.25rem for pointer/keyboard workbench use. At narrow widths,
  use the `default` 2.75rem row or adapt dense matrices to cards/detail views.
- `content-reading` constrains long-form prose; `content-workbench` supports
  dense architecture tools. Neither value requires a page-specific class.

## Starter coverage audit

Repeated starter spacing values from 0 through 4rem resolve directly to the
raw scale, including its 0.125rem half steps. Existing transformed components
use only those standard utilities; their markup is intentionally unchanged.

Starter arbitrary values have these migration decisions:

| Starter value | Occurrence/intent | Design-system destination |
| --- | --- | --- |
| 36px | navigation item and dense row | `rowSizes.dense` (2.25rem) |
| 50px, 60px | table utility columns | content-sized cells; `controlSizes.touch` where interactive |
| 70px | collapsed sidebar | `panelSizes.navigation-collapsed` (4.5rem) |
| 150px, 180px, 200px | table columns and menus | `panelSizes.inline-compact/default`; table columns remain content-driven |
| 210px | default sidebar | `panelSizes.navigation-default` (13rem) |
| 280px | expanded sidebar | `panelSizes.navigation-wide` (17.5rem) |
| 300px | member table column | content-driven column; no fixed design-system token |
| 500px | mobile menu maximum height | available viewport/block-size calculation, not a fixed token |

The last two are deliberately replaced by responsive layout behavior rather
than promoted as unexplained one-off tokens. Full, screen, and dynamic viewport
sizes likewise remain intrinsic CSS values.

