# Requirement row recipe

Traceability: DS-003, DS-009. Supporting product context: BR-040 through BR-044.

## Purpose

`RequirementRowComponent` presents a dense Lake Shore Drive requirements-matrix record with its stable ID, title, status, priority, traceability, evidence, and actions. The desktop grid adapts into a labeled card composition instead of forcing a wide table onto narrow screens.

## Usage

```ts
readonly requirement: RequirementRowViewModel = {
  id: 'REQ-042',
  title: 'All generated claims must retain source evidence',
  status: { label: 'In review', variant: 'warning' },
  priority: 'high',
  traceability: [{ id: 'DISC-018', label: 'Discovery answer' }],
  evidence: [{ id: 'SRC-203', label: 'Architecture brief' }],
};
```

```html
<lsd-requirement-row [requirement]="requirement">
  <lsd-button lsdRequirementTraceability impact="minimal">Related ADRs</lsd-button>
  <lsd-citation-chip lsdRequirementEvidence [citation]="citation" previewId="source-preview" />
  <lsd-button lsdRequirementActions impact="light">Review</lsd-button>
</lsd-requirement-row>
```

Render repeated recipes inside a semantic list when presenting a matrix collection. The recipe is not a native table row because its narrow-screen card structure would not be valid table markup.

## Inputs and slots

- `requirement` is a required immutable `RequirementRowViewModel`.
- `status` is typed presentation data with a visible label and public badge variant. The consuming domain owns its status vocabulary and transitions.
- `priority` is `critical`, `high`, `medium`, or `low` and receives consistent text and semantic treatment.
- `traceability` and `evidence` contain display-safe stable IDs and labels.
- `headingLevel` accepts `2`, `3`, or `4` to fit the surrounding page hierarchy.
- `actionsLabel` customizes the requirement-specific action-group name.
- `lsdRequirementTraceability`, `lsdRequirementEvidence`, and `lsdRequirementActions` accept richer public controls such as links, citation chips, and buttons.

## States

Status is intentionally presentation-driven because the canonical requirements do not define a requirement lifecycle. Use `ai-draft` or `suggested` badge variants for unapproved AI content and `approved` only for human-approved content. Empty reference collections remain valid; callers may project an explicit empty-state explanation when it is useful.

## Responsive behavior

- Desktop (`64rem` and wider): identity, status/priority, traceability, evidence, and actions form a dense aligned grid.
- Tablet: identity and status occupy the main column, actions remain adjacent, and traceability/evidence become labeled full-width rows.
- Mobile (below `30rem`): the composition becomes a single-column card, stable IDs remain visible, and actions move below a separator.

Long titles wrap without clipping. Reference lists wrap rather than expanding the viewport.

## Accessibility

- Each recipe is a named region using the requirement ID and title, with a configurable real heading.
- Status and priority use visible text, never color alone.
- Traceability and evidence are named sections; stable reference IDs remain visible and are included in badge accessible names.
- Actions are a labeled group scoped to the requirement ID. Projected controls retain native keyboard and focus behavior.
- Collection owners should provide a list label or heading and preserve logical DOM order.

## Do / don't

Do pass only display-safe, already-authorized references and compose public citation, button, badge, or disclosure APIs. Use stable IDs as rendering keys and visible traceability anchors.

Don't fetch evidence, resolve citations, calculate authorization, persist edits, transition status, or embed workflow behavior in this recipe. Don't place this component directly inside `table`, `tbody`, or `tr` elements.

## Visual regression

Capture light and dark appearances at desktop, tablet, and mobile widths. Cover all priorities; human-approved and AI-draft statuses; long IDs/titles; many, one, and no references; projected citation controls; actions present/absent; and keyboard focus.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { RequirementRowComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [RequirementRowComponent], templateUrl: './example.html' })
export class RequirementRowExampleComponent {}
```
