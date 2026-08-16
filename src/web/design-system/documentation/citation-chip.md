# Citation chip

## Purpose

Use a citation chip to identify one stable source and request its caller-owned preview.

`CitationChipComponent` presents a stable source reference inline and requests a caller-rendered source preview. It composes Badge and Button primitives. It does not retrieve, resolve, authorize, redact, navigate to, or render source content.

## Typed API and states

- Required `citation` is a display-safe `CitationReference` containing `sourceId`, `sourceTitle`, and optional `sourceSection`.
- `sourceId` is rendered by default and always retained in `data-source-id`, the accessible name, and the emitted reference. Set `showSourceId="false"` only when the visible identifier would overwhelm a constrained inline context.
- Required `previewId` identifies the caller-rendered preview region, dialog, or drawer and is exposed through `aria-controls`.
- `previewOpen` is caller-owned and maps to `aria-expanded`; the chip never opens or closes preview UI itself.
- `disabled` uses the Button primitive's native disabled state.
- `previewRequested` emits the unchanged `CitationReference`. The consuming application resolves the identifier, applies authorization and redaction policy, and manages preview state.

```html
<lsd-citation-chip
  [citation]="{
    sourceId: 'artifact:adr-0004#decision',
    sourceTitle: 'ADR 0004 — Governed RAG',
    sourceSection: 'Decision'
  }"
  previewId="source-preview"
  [previewOpen]="previewOpen()"
  (previewRequested)="requestSourcePreview($event)" />

<aside id="source-preview" aria-label="Source preview">
  <!-- Caller-authorized, display-safe source preview -->
</aside>
```

## Accessibility

The chip is a native `type="button"` through the Button primitive, so Enter and Space activation, focus visibility, and disabled semantics are preserved. Its accessible name includes AI-source attribution, source title, optional section, and stable identifier. `aria-controls` and `aria-expanded` expose the preview relationship and caller-owned state. Visible text and the AI Draft badge ensure meaning does not rely on color.

The caller must place the preview target in a logical DOM location, give it an accessible name, and move focus only when appropriate for the chosen region, dialog, or drawer pattern.

## Responsive behavior

The chip remains inline and truncates long titles on wider layouts. Below 30rem its title, section, and identifier stack within a constrained width while retaining the complete accessible name.

## Do / don't

Do use durable source identifiers, supply display-safe titles and section labels, preserve identifiers across regeneration, and resolve previews in application code. Do not use array position or transient UI keys as source IDs, place source excerpts in the chip, assume visibility implies authorization, or perform retrieval and policy checks inside this component.

## Visual coverage

`citation-chip.visual.spec.ts` covers light/dark appearance, desktop/mobile width, open and disabled states, optional metadata, stable identifier visibility, and long-title truncation.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { CitationChipComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [CitationChipComponent], templateUrl: './example.html' })
export class CitationExampleComponent {}
```
