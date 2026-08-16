# Source citations recipe

Traceability: DS-003, DS-013, UX-DOC-004. Supporting context: BR-106 through BR-108 and TR-RAG-004 through TR-RAG-005.

## Purpose

`SourceCitationsComponent` composes public citation chips and the source-preview pattern into one Lake Shore Drive source-evidence experience. It renders stable citations, caller-owned selection state, resolvable metadata, and a single preview drawer without implementing retrieval.

## Usage

```html
<lsd-source-citations
  id="section-sources"
  [citations]="citations"
  [selectedSourceId]="selectedSourceId"
  [previewOpen]="previewOpen"
  [previewState]="previewState"
  (selectionRequested)="selectSource($event)"
  (previewCloseRequested)="closePreview()"
  (previewRetryRequested)="retryPreview($event)"
  (openSourceRequested)="openAuthorizedSource($event)">
  <blockquote lsdSourceCitationPassage>{{ selectedPassage }}</blockquote>
  <div lsdSourceCitationContext>{{ surroundingContext }}</div>
</lsd-source-citations>
```

## Inputs and outputs

`citations` contains immutable `SourceCitationItem` values with stable ID, title, optional section, artifact type, version, locator, and disabled presentation state. `selectedSourceId`, `previewOpen`, and `previewState` are caller-owned. The recipe emits typed selection, retry, open-source, and close intents; it never changes selection itself.

`lsdSourceCitationsMetadata` adds collection-level display-safe metadata. Passage, context, and action slots populate the selected source preview.

## States

The collection supports none, one, or many citations. The selected preview supports `loading`, `ready`, `unavailable`, and `failed`. A selected ID that does not resolve renders no preview. Every chip and preview retains explicit AI-source/evidence-only language and cannot visually imply architect approval.

## Responsive behavior

Citation chips wrap on larger screens. Below `30rem` they stack so long source titles and stable identifiers remain readable. The public source-preview drawer occupies the available viewport and independently handles narrow metadata and action layouts.

## Accessibility

The collection is a named region with a labeled list and visible source count. Each chip is a keyboard-operable button whose `aria-controls` targets the shared preview and whose `aria-expanded` is true only for the selected open source. The preview uses modal drawer focus management, labeled metadata, passage semantics, status announcements, and focus restoration.

## Do / don't

Do pass only authorized, display-safe metadata and stable resolvable IDs; keep selection synchronized when handling intents; and provide real source passage/context. Don't fetch, retrieve, redact, authorize, invent evidence, or open external artifacts inside this recipe.

## Visual regression

Capture light/dark empty, single, and wrapping collections; long titles/sections/IDs; disabled chips; selected state; and ready, loading, unavailable, and failed previews at desktop and mobile widths. Include keyboard focus and reduced-motion runs.
