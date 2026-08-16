# Integration manifest

Traceability: DS-002 through DS-005, BR-144.

`integration-manifest.json` is the machine-readable installation contract. Install production source at exactly `src/web/design-system`; do not rename the internal layers or expose implementation paths.

## Copy payload

Copy `public-api.ts`, the manifest and its schema, and the complete `tokens`, `foundations`, `primitives`, `components`, `patterns`, `recipes`, `layouts`, `icons`, `utilities`, and `documentation` directories. Exclude the private migration snapshot and source-level unit/visual matrix specifications for a production-only installation. Copy the validator and two boundary scripts from `testing` even though testing is not an application-facing layer.

For repository test support, copy `visual-regression/`, `playwright.config.ts`, and the approved baselines, excluding the manifest-listed Playwright results and report directories. Preserve `docs/design/third-party-notices.md`. No runtime image, font, branding, avatar, or external icon asset is required.

## Dependencies

Merge the exact dependency groups from the manifest into the target package configuration. Angular core/common and RxJS are runtime peers. Angular build/compiler/CLI, TypeScript, Tailwind, and the Tailwind PostCSS plugin are build dependencies. Angular platform-browser, Playwright, and axe are required only when installing the supplied test harness. `zone.js` is not required by the zoneless Angular 22 integration.

Do not delete a target dependency merely because it is absent from this manifest; the target application may require it independently.

## Global CSS and configuration

Prepend `src/web/design-system/foundations/tailwind.css` to the target Angular project's global `styles` array, before application CSS. This single entry imports appearance, interaction states, motion, and typography, and limits Tailwind source discovery to design-system production layers.

Create the visible file `postcss.config.mjs` from the exact `configuration.createFiles` content in the manifest. Do not copy or depend on this repository's hidden `.postcssrc.json`, and do not assume any hidden file exists in the upstream starter. Merge the stated `angular.json` and strict TypeScript/Angular compiler deltas into the target configuration rather than replacing unrelated target settings.

## Public imports

Application code imports from:

```ts
import { ButtonComponent } from 'src/web/design-system/public-api';
```

The target may map that same entry to `@lsd/design-system`. Deep imports are unsupported. Run the boundary scripts to enforce the rule.

## Test integration and verification

Copy approved screenshots rather than regenerating them during installation. Merge the manifest's named scripts into the target package scripts and adjust only the target Angular project name/serve command where necessary. Then run the verification commands in order. The manifest validator checks payload existence, exclusions, dependency versions, foundation imports, Tailwind sources, public layers, configuration deltas, assets, baselines, and scripts.
