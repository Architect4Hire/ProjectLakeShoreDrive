# Document section editor recipe

Traceability: DS-003, UX-DOC-001 through UX-DOC-005.

## Purpose and usage

`DocumentSectionEditorComponent` composes the structured editor into a single Lake Shore Drive document-section workspace with section actions, content, citations, provenance, saving/approval state, context inspection, and version-history access.

```html
<lsd-document-section-editor id="executive" [section]="section" [saveState]="saveState"
  [contextAvailable]="canInspectContext" (historyRequested)="openHistory($event)">
  <app-section-actions lsdDocumentSectionActions />
  <app-approval-actions lsdDocumentSectionApprovalActions />
  <app-section-canvas lsdDocumentSectionContent />
  <lsd-source-citations lsdDocumentSectionCitations ... />
  <app-generation-context lsdDocumentSectionContext />
</lsd-document-section-editor>
```

## Contract and states

The immutable section model contains stable ID, title, optional description/version label, GOV-002 provenance, and approval presentation (`draft`, `in-review`, `approved`, or `locked`). Save state is `saved`, `dirty`, `saving`, or `error`. These are independent presentation inputs; the recipe performs no transitions or persistence. `historyRequested` emits the section ID. Split-view state is two-way caller-owned.

AI-generated provenance explicitly says “Not approved”; approval styling is independent and must only be supplied after real human approval. Project public section, approval, citation, and context components into their named slots.

## Responsive behavior and accessibility

The structured editor preserves ordered-section semantics, sticky tools, labeled action groups, polite save announcements/assertive errors, and a keyboard-controlled context pane with focus transfer. At narrow widths its public layout focuses context or canvas, while section actions stack below `30rem`. Citations remain inline through public citation components.

## Do / don't

Do expose authorized section actions, preserve stable version/provenance data, and use source citations that resolve to evidence. Don't save content, approve or lock sections, retrieve context, authorize actions, generate text, or maintain version history in this recipe.

## Visual regression

Capture light/dark desktop and mobile editors for every save and approval state, all provenance variants, context open/closed, long content, citations, disabled actions, save errors, and keyboard focus.
