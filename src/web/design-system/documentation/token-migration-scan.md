# Production color-token migration scan

Traceability: DS-004, DS-005, DS-006, DS-010.

Scope: production files under `src/web/design-system`, excluding the immutable
starter snapshot under `documentation/migration`. No Lake Shore Drive feature
code is included.

The transformed button now references `accent-primary`, `status-*`,
`surface-raised`, `text-primary`, `text-muted`, and the accessible `text-on-*`
semantic roles. The data table and workbench shell already referenced semantic
surface, text, and border roles. No production component retains starter
aliases such as `primary`, `destructive`, `muted`, or `*-foreground`.

## Justified raw-value exceptions

- `tokens/internal/primitive-colors.ts` and
  `tokens/internal/semantic-color-themes.ts` intentionally resolve private raw
  palettes beneath the semantic contract. Neither is publicly exported.
- `tokens/elevation.ts` contains neutral translucent RGB shadow values. Shadows
  are raw elevation-token definitions rather than encoded product/theme
  colors, and components consume only semantic elevation roles.
- Foundation fallbacks such as `Canvas`, `CanvasText`, `Highlight`, and `Mark`
  are operating-system colors for pre-theme and forced-colors accessibility.
  They are not product palette choices.
- `transparent` and opacity modifiers derive variants from semantic colors and
  do not introduce an independent product color.

