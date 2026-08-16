# Starter cleanup audit

Traceability: DS-001 through DS-005.

The production graph contains no starter routes, authentication pages, dashboard examples, business records, stock media, avatars, or starter icon assets. The unreachable starter-derived `WorkbenchShellComponent` and private `ClickOutsideDirective` were removed after search confirmed no production consumers. The supported responsive shell is `WorkbenchShellRecipeComponent`.

The private `documentation/migration/angular-tailwind/source` snapshot is intentionally retained as provenance evidence, not production code. It is excluded from the Angular build, public API, Tailwind sources, documentation navigation, dependency checks, and application imports. `docs/design/third-party-notices.md` retains the upstream MIT license. The project logo remains because the repository README references it.

Dependency evidence:

- Angular core/common/platform-browser are imported by production components and the fixture bootstrap.
- Angular build/CLI/compiler/compiler-cli and TypeScript provide compilation and dependency analysis.
- RxJS is a required Angular peer.
- Tailwind and its PostCSS plugin compile the production foundation stylesheet.
- Playwright and axe run visual, responsive, and accessibility suites.
- `zone.js` was optional, unreferenced, and removed; the Angular 22 fixture uses zoneless bootstrap.

Run `npm ci`, `npm run build`, `npm run lint`, and `npm test`. Approved screenshots are committed; generated reports, caches, and results remain ignored.
