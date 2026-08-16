# Public imports

Application features consume the Lake Shore Drive design system through one
public entry point:

```ts
import * as DesignSystem from 'src/web/design-system/public-api';
```

Features may import only symbols that are deliberately exported by
`public-api.ts`; no public components or types exist yet. The Angular
workspace may replace the source path with a configured package alias without
changing the public entry-point boundary.

## Public layers

The public entry point may expose approved APIs from:

- `tokens`
- `foundations`
- `primitives`
- `components`
- `patterns`
- `recipes`
- `layouts`
- `icons`

Each layer's `index.ts` is its review boundary. A symbol is supported for
application use only when the layer barrel exports it and the root
`public-api.ts` makes that layer public. Public component inputs, outputs,
variants, and models must be strongly typed.

## Private paths

Application features must not import:

- Files below a public layer barrel
- `utilities/`
- `testing/`
- `documentation/`
- Tailwind class maps, class-composition helpers, or other styling internals
- Demo routes, demo models, fixtures, or starter-specific implementation code

Testing support may be exposed later through a separate test-only entry point.
It must not be exported from the application-facing entry point.

## Enforcement

Run `node src/web/design-system/testing/check-feature-boundaries.mjs` in CI.
It permits the public entry point and rejects deep imports under
`src/web/design-system/`. It also detects exact repeated Tailwind bundles with
eight or more utilities while allowing legitimate one-off layout composition.
See `documentation/feature-boundary-check.md` for integration and migration.
