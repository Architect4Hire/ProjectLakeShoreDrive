# Source preview pattern

`SourcePreviewComponent` presents resolvable source metadata, a selected passage, and optional surrounding context in the established Drawer primitive. It pairs with `CitationChipComponent`: the chip requests a reference and application code supplies an authorized, display-safe preview to this pattern. Neither component retrieves, resolves, authorizes, redacts, or persists source data.

## States and typed API

- Required `id` links the citation chip's `previewId` to the underlying drawer dialog.
- Required `source` is `SourcePreviewMetadata`: stable `sourceId`, `sourceTitle`, and optional `sourceSection`, `artifactType`, `version`, and `locator`.
- `state` is `loading`, `ready`, `unavailable`, or `failed`. Only `ready` projects the selected passage and context.
- `open`, `placement`, `size`, and `dismissible` map to caller-owned Drawer presentation.
- `closeRequested` forwards Drawer close reasons. The caller must set `open` to false.
- `retryRequested` and `openSourceRequested` emit the unchanged metadata reference. They do not retrieve or navigate.
- `openSourceDisabled` lets caller-owned policy or availability suppress source navigation.
- Project display-safe content through `lsdSourcePreviewPassage`, `lsdSourcePreviewContext`, and optional `lsdSourcePreviewActions`.

```html
<lsd-citation-chip
  [citation]="citation"
  previewId="source-preview"
  [previewOpen]="previewOpen()"
  (previewRequested)="selectAuthorizedPreview($event)" />

<lsd-source-preview
  id="source-preview"
  [source]="displaySafeSource()"
  [open]="previewOpen()"
  [state]="previewState()"
  (closeRequested)="previewOpen.set(false)"
  (retryRequested)="requestPreview($event)"
  (openSourceRequested)="openAuthorizedSource($event)">
  <p lsdSourcePreviewPassage><!-- selected passage --></p>
  <section lsdSourcePreviewContext><!-- surrounding context --></section>
</lsd-source-preview>
```

## Accessibility

The Drawer primitive supplies a labeled native modal dialog, deterministic initial focus, Escape/backdrop/close behavior, focus restoration, and focus containment. Metadata uses a description list. The selected passage is a named section and semantic quotation. Surrounding context uses native disclosure semantics. Loading is announced politely, recoverable failure uses an alert, and the visible “AI source evidence / not architect approval” disclosure prevents color-only or approval-like interpretation.

The citation trigger owns `aria-controls` and `aria-expanded`; use the same stable `id` on this preview. Application code must provide meaningful display-safe text and decide whether opening the preview or full source requires additional focus movement.

## Responsive and motion behavior

The wide drawer uses the available viewport on compact screens. Metadata collapses from two columns to stacked labels and values below 30rem, and actions stack. Drawer transitions use shared motion tokens and reduce to zero duration under `prefers-reduced-motion`.

## Do / don't

Do preserve the stable source identifier, show the exact caller-selected passage, keep context progressively disclosed, and apply authorization/redaction before binding inputs. Do not fetch from this component, pass raw provider payloads, infer permission from drawer visibility, hide missing-source states, or imply that cited evidence or viewing it grants architect approval.

## Visual coverage

`source-preview.visual.spec.ts` covers all preview states, light/dark appearance, desktop/mobile widths, start/end placement, sparse/full metadata, and expanded context.
