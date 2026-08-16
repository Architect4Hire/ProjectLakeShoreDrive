# Transformation inventory

Status: source snapshot captured; initial business-neutral capabilities extracted.

| Candidate | Upstream path | Snapshot files | Intended disposition |
| --- | --- | ---: | --- |
| Theme/style foundation | `src/styles.css` | 1 | Pending extraction into tokens and foundations |
| Theme model and service | `src/app/core/models/theme.model.ts`, `src/app/core/services/theme.service.ts` | 2 | Pending extraction into a typed appearance boundary |
| Button | `src/app/shared/components/button/` | 3 | Extracted to `primitives/button/`; starter API and hard-coded colors replaced |
| Click-outside behavior | `src/app/shared/directives/click-outside.directive.ts` | 1 | Evaluated, then removed because no production component required it |
| Layout mechanics | `src/app/modules/layout/` | 43 | Superseded by the responsive `recipes/workbench-shell/`; obsolete projected layout, route, menu, profile, and branding assumptions removed |
| Table composition | `src/app/modules/uikit/pages/table/` | 19 | Neutral projected table extracted to `components/data-table/`; user model, remote API, filters, and row assumptions discarded |
| E2E references | `tests-e2e/navbar.e2e.spec.ts`, `tests-e2e/sidebar.e2e.spec.ts`, `tests-e2e/table.e2e.spec.ts` | 3 | Adapt as testing references |
| **Total** |  | **72** |  |

Snapshot destinations are deterministic:

```text
source/<upstream-relative-path>
```

Every non-empty file under the approved paths is represented. Empty CSS
placeholders and `.gitkeep` files are intentionally excluded. There are no
snapshot files outside the approved paths.

When a candidate is transformed, add its Lake Shore Drive destination and
status here. Copying into this snapshot does not approve the candidate's API,
styling, dependencies, accessibility, or product assumptions.
