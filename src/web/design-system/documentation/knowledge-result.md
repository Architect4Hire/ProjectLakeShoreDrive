# Knowledge search result recipe

Traceability: DS-003, TR-RAG-004 through TR-RAG-006.

`KnowledgeResultComponent` presents one governed knowledge result with stable source ID, title/section, artifact type, engagement/client scope, excerpt, tags, approval state, confidentiality, citation preview, source access, and explicit context selection.

```html
<lsd-knowledge-result [result]="result" previewId="source-preview" [selected]="selected"
  (previewRequested)="preview($event)" (openSourceRequested)="openSource($event)"
  (selectionRequested)="selectContext($event)" />
```

The immutable model contains display-safe metadata. Approval is approved, unapproved, or deprecated; confidentiality is public, internal, confidential, or restricted. These labels are presentation only. Application code must filter and authorize results before rendering and authorize every emitted preview/open/select intent.

The card is a named region with a heading, visible stable ID, scope indicator, tag list, and source-specific action group. Citation controls resolve through the caller-provided preview ID. Selection uses pressed state and visible “Selected for context” text rather than color alone.

Header metadata stacks below `48rem`; actions become vertical below `30rem`. Long excerpts/tags wrap. Do preserve stable citations and honest approval/confidentiality labels. Don't retrieve, filter, redact, authorize, open artifacts, or mutate generation context inside the recipe.

Visual regression covers light/dark desktop/mobile, long/short excerpts, many/no tags, selected/unselected, every approval/confidentiality treatment, disabled actions, scope variants, and keyboard focus.
