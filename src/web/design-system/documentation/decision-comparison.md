# Decision comparison recipe

## Purpose and variants

Use this recipe for `current-proposed` or `historical-new` comparisons. It supports the public split-view ratios and a caller-controlled compact pane; it does not calculate diffs.

Traceability: DS-003, UX-003.

`DecisionComparisonComponent` composes the public split view for current-versus-proposed decisions and historical-versus-new ADR content. A typed model supplies title, comparison kind, stable pane IDs, labels, optional status presentation, author, and time metadata. Content, summary, and caller-authorized actions use named slots.

```html
<lsd-decision-comparison id="adr-comparison" [comparison]="comparison" [(compactPane)]="pane">
  <article lsdDecisionComparisonLeft>...</article>
  <article lsdDecisionComparisonRight>...</article>
  <app-change-summary lsdDecisionComparisonSummary />
  <lsd-button lsdDecisionComparisonActions>Review proposal</lsd-button>
</lsd-decision-comparison>
```

## Responsive behavior

The `balanced`, `context-wide`, and `output-wide` ratios affect desktop allocation. Below `48rem`, the public split view stacks into one focused pane with an accessible pressed-button switcher and focus movement; both panes remain side-by-side on wider screens. Long content wraps.

The outer comparison and both panes are named regions with real headings. Stable IDs and status labels remain visible and do not rely on color. Callers should use `ai-draft` for unapproved generated proposals and `approved` only for architect-approved content.

Do supply display-safe metadata, preserve left/right meaning, and compose public controls. Don't retrieve versions, calculate diffs, approve proposals, persist selection, authorize actions, or implement workflow transitions here.

Visual regression covers light/dark, desktop/mobile, both comparison kinds, all ratios, both compact panes, long and empty content, draft/approved statuses, action presence, and keyboard focus.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { DecisionComparisonComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [DecisionComparisonComponent], templateUrl: './example.html' })
export class ComparisonExampleComponent {}
```
