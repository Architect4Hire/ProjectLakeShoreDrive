# Engagement header recipe

Traceability: DS-003, UX-001, UX-002.

## Purpose

`EngagementHeaderComponent` gives Lake Shore Drive workbenches a consistent presentation for engagement identity, client context, lifecycle status, contextual actions, and phase or engagement switching. It is presentation-only and composes public surface, badge, and separator primitives.

## Usage

```ts
readonly engagement: EngagementHeaderViewModel = {
  id: 'northwind-modernization',
  name: 'Commerce modernization',
  clientName: 'Northwind Traders',
  engagementType: 'Application Modernization',
  status: 'discovery',
  clientMetadata: [
    { label: 'Industry', value: 'Retail' },
    { label: 'Region', value: 'North America' },
  ],
};
```

```html
<lsd-engagement-header [engagement]="engagement">
  <lsd-button lsdEngagementHeaderActions impact="light">Engagement settings</lsd-button>
  <app-engagement-phase-navigation lsdEngagementHeaderContextSwitcher />
</lsd-engagement-header>
```

Place the recipe in the workbench shell's `lsdWorkbenchEngagement` or `lsdWorkbenchContext` slot according to the available header density. Use only public design-system controls in its slots.

## Inputs and slots

- `engagement` is a required immutable `EngagementHeaderViewModel` containing a stable ID, name, client name, optional type and metadata, and one canonical lifecycle status.
- `headingLevel` is `1` by default and may be `2` when the surrounding workbench already owns the page heading.
- `actionsLabel` and `contextSwitcherLabel` name the projected control groups.
- `announceStatus` opts a genuinely changing lifecycle label into status announcements; leave it off for initial page rendering.
- `lsdEngagementHeaderActions` receives authorized caller-provided actions.
- `lsdEngagementHeaderContextSwitcher` receives an engagement switcher, the UX-002 phase navigation, or another public context navigation component.

The status union mirrors the canonical lifecycle for display consistency only. The recipe exposes no transition command and performs no validation, persistence, or authorization.

## States

Every canonical lifecycle value has a semantic badge treatment. Approved and archived are explicitly distinguishable; active working phases use informational styling, while review and package generation use caution styling. Metadata and actions are optional. Callers must omit data and controls that the current user is not authorized to see.

## Responsive behavior

On desktop, identity and actions share a row and metadata wraps below. Below `48rem`, actions move beneath identity and metadata becomes a two-column grid. Below `30rem`, metadata becomes one column. Context navigation may scroll horizontally when its public component cannot wrap without losing meaning.

## Accessibility

- The outer surface is a named region using the engagement name.
- The engagement name is a real `h1` or `h2`; choose the level to preserve the page hierarchy.
- Client metadata uses `dl`, `dt`, and `dd` semantics.
- Actions are a labeled group and context switching is a labeled navigation landmark.
- Lifecycle meaning is conveyed in badge text, not color alone. Enable announcements only for an in-place status change.
- Projected controls retain responsibility for keyboard operation, visible focus, current-page indication, and accessible names.

## Do / don't

Do pass already-authorized presentation data and compose public buttons, menus, tabs, or phase-navigation components. Keep labels concise and preserve the canonical phase order.

Don't fetch engagement data, calculate permissions, persist context, initiate lifecycle transitions, or use this recipe as a workflow state machine.

## Visual regression

Capture light and dark appearances at desktop, tablet, and mobile widths. Cover working, review, approved, delivery, and archived treatments; long and absent metadata; actions present and absent; long engagement/client names; and horizontal context overflow.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { EngagementHeaderComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [EngagementHeaderComponent], templateUrl: './example.html' })
export class EngagementHeaderExampleComponent {}
```
