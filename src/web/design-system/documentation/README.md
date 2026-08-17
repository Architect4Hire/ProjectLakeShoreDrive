# Lake Shore Drive design system

Traceability: DS-011.

This is the navigation entry point for every supported production token family, foundation, primitive, component, pattern, recipe, and layout. Each linked guide is the authoritative place for its purpose, variants or states, public API, accessibility behavior, usage examples, do/don't guidance, and responsive behavior. If a facet does not vary for an API, the guide states that explicitly.

Import supported TypeScript APIs only through `src/web/design-system/public-api.ts`. The files under `documentation/migration/` are provenance snapshots and transformation evidence; they are deliberately absent below and are not supported starter APIs.

## Tokens

- [Borders, radius, elevation, and layers](elevation-and-layers.md)
- [Motion](motion.md)
- [Semantic colors](semantic-colors.md)
- [Spacing and sizing](spacing-and-sizing.md)
- [Typography](typography.md)

## Foundations

- [Appearance](appearance.md)
- [Interaction states](interaction-states.md)
- [Motion and reduced motion](motion.md)
- [Tailwind boundary and production style entry](tailwind-boundary.md)
- [Typography](typography.md)

## Primitives

- [Badge](badges-and-status.md)
- [Button](button.md)
- [Checkbox and radio group](checkboxes-and-radios.md)
- [Dialog and initial-focus directive](dialog.md)
- [Drawer and initial-focus directive](drawer.md)
- [Input](input.md)
- [Select](select.md)
- [Surface and separator](surfaces-and-separators.md)
- [Tabs and tab panel](tabs.md)
- [Textarea](textarea.md)
- [Tooltip and trigger](tooltip.md)

## Components

- [Alert banner](alert-banner.md)
- [Citation chip](citation-chip.md)
- [Data table](data-table.md)
- [File picker](file-picker.md)
- [Icon and icon-name contract](icons.md)
- [Notification service and viewport](notifications.md)
- [Stepper](stepper.md)

## Patterns

- [Activity stream and details](activity-stream.md)
- [AI confidence](ai-confidence.md)
- [AI content](ai-content.md)
- [AI failure](ai-failure.md)
- [AI generation progress](ai-generation-progress.md)
- [Command palette](command-palette.md)
- [Filter action bar](filter-action-bar.md)
- [Form section](form-section.md)
- [Master detail and trigger](master-detail.md)
- [Nav menu](nav-menu.md)
- [Profile menu](profile-menu.md)
- [Review approval](review-approval.md)
- [Search results and result details](search-results.md)
- [Source preview](source-preview.md)
- [Split view](split-view.md)
- [State feedback and details](state-feedback.md)
- [Suggested change](suggested-change.md)
- [Version comparison](version-comparison.md)

## Recipes

- [ADR summary](adr-summary.md)
- [AI generation drawer](ai-generation-drawer.md)
- [App navbar recipe](app-navbar.md)
- [Approval actions](approval-actions.md)
- [Decision comparison](decision-comparison.md)
- [Document section editor](document-section-editor.md)
- [Engagement header](engagement-header.md)
- [Knowledge search result](knowledge-result.md)
- [Phase navigation](phase-navigation.md)
- [RAID register](raid-register.md)
- [Requirement row](requirement-row.md)
- [Source citations](source-citations.md)
- [Workbench shell recipe](workbench-shell.md)

## Layouts

- [Structured editor and section directive](structured-editor.md)

## Supporting policy

- [Public imports](public-imports.md)
- [Integration manifest](integration.md)
- [Final acceptance checklist](final-acceptance-checklist.md)
- [Business-neutral APIs](business-neutrality.md)
- [Starter cleanup audit](cleanup-audit.md)
- [Feature boundary check](feature-boundary-check.md)
- [Production token migration scan](token-migration-scan.md)

## Coverage verification

`catalog.json` maps every leaf module reachable from the root public API to one guide. Run:

```sh
node src/web/design-system/documentation/check-documentation-coverage.mjs
```

The command fails for an undocumented public export, a stale or duplicate catalog mapping, or a missing guide. Foundation CSS entries are cataloged even though they are included through the production stylesheet rather than exported as TypeScript.
