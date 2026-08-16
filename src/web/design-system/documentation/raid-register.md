# RAID register recipe

Traceability: DS-003, DS-009. Supporting product context: BR-090 through BR-092.

## Purpose

`RaidRegisterComponent` composes the public compact data table into a Lake Shore Drive RAID register. It consistently presents item ID, risk/assumption/issue/dependency type, description, owner, severity, probability, impact, status, and caller-provided actions.

## Usage

```html
<lsd-raid-register
  accessibleName="Northwind RAID register"
  [items]="raidItems"
  [actions]="actions"
  [loading]="loading"
  [error]="errorMessage"
  (itemAction)="handleAction($event)" />
```

`RaidRegisterItem` uses stable string IDs, the canonical four `RaidItemType` values, and categorical `RaidAssessment` values: `not-applicable`, `low`, `medium`, `high`, and `critical`. Status remains caller-provided text because the canonical requirements do not define a RAID lifecycle. Generic typed actions are forwarded as `DataTableActionEvent` values without mutation.

## States

The recipe passes `loading`, `loadingMessage`, `emptyMessage`, and `error` to the public data-table state treatments. The consuming application owns all data, authorization, filtering, status vocabulary, and action handling. Assessment labels are visible text and never rely on color.

## Responsive behavior

Desktop and tablet use the compact eight-column table inside a keyboard-focusable horizontal scroll region when necessary. Below `30rem`, the public data table switches to labeled cards, preserving every field and placing actions below the record rather than squeezing or hiding columns.

## Accessibility

The register is a named region containing a native table with caption and column headers. The horizontal scroll area is keyboard focusable. Mobile cards use `dl`, `dt`, and `dd` relationships. Row actions receive accessible names combining action label, stable item ID, and description. Loading and empty states are polite statuses; errors are alerts.

## Do / don't

Do supply already-authorized display data, stable IDs, concise descriptions, explicit `not-applicable` values, and typed public table actions. Don't fetch RAID data, calculate risk scores, infer status, persist edits, authorize actions, or implement workflow transitions in this recipe.

## Visual regression

Capture light/dark desktop tables, horizontal overflow, populated and dense registers, every RAID type and assessment level, tablet loading/error states, and mobile populated/empty cards with actions and long descriptions.
