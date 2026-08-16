# Alert banner

## Purpose

Use an alert banner for persistent contextual feedback with an explicit severity and announcement mode.

`AlertBannerComponent` communicates page- or section-level status with a semantic severity, title, projected body, optional actions, and optional dismissal. It contains no feature workflow assumptions.

## API and usage

- Required: stable `id` and `title`.
- `severity`: `neutral`, `info`, `success`, `warning`, or `danger`.
- `announcement`: `polite` (default), `assertive`, or `off`.
- `dismissible`, accessible `closeLabel`, two-way `visible`, and `dismissed` output.
- Project body content normally and place action controls in an element marked `lsdAlertActions`.

```html
<lsd-alert-banner id="generation-ready" title="Draft ready" severity="success">
  The generated draft is ready for review.
  <div lsdAlertActions><lsd-button>Review draft</lsd-button></div>
</lsd-alert-banner>
```

## Accessibility

Polite announcements use `role="status"`; urgent assertive announcements use `role="alert"`; `off` renders a labeled group. Title and body are programmatically associated. Severity always includes visible text and a decorative symbol, so meaning does not depend on color. Dismissal uses a named native button and removes the banner from the accessibility tree.

Choose announcement urgency from the event, not its color: use `assertive` only when users must be interrupted immediately. Do not repeatedly re-create a live banner with unchanged content, because that can cause duplicate announcements.

## Responsive behavior and appearance

Body copy has a readable line length, actions wrap, and mobile actions stack while the dismiss control retains a 44px target. All severity treatments use semantic surface, border, status, and text tokens in light and dark appearances.

## Do / don't

Do provide recovery actions near actionable errors and make dismissal optional only when the message can safely be ignored. Do not use a dismissible banner for required consent, rely on severity alone to determine live-region urgency, or embed feature data models in the component.

## Visual coverage

`alert-banner.visual.spec.ts` defines all severities across light/dark and desktop/mobile critical states, including actions and dismissibility, for the workspace visual runner. Component tests cover live-region behavior, associations, composition, semantic styling, and dismissal.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { AlertBannerComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [AlertBannerComponent], templateUrl: './example.html' })
export class AlertExampleComponent {}
```
