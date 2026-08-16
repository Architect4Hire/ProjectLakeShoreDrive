# AI content pattern

`AiContentComponent` gives drafted, suggested, and generated material a persistent attribution treatment that cannot be confused with architect-approved content. It composes Surface, Badge, Button, and Alert Banner primitives; it never calls a model, retrieves sources, decides authorization, changes provenance, or persists a review decision.

## States and typed API

- Required `id`, `title`, and GOV-002 `provenance`: `human-authored`, `ai-suggested`, `ai-generated`, `human-modified-from-ai`, or `human-approved`.
- `state`: `draft`, `generating`, `suggested`, `ready`, or `failed`.
- `confidence`: `none`, `low`, `medium`, or `high`. Confidence is always paired with “verify before approval”; it is not an approval signal.
- `citations` accepts display-safe `AiSourceCitation` values. The caller handles `citationSelected` and chooses whether to supply a preview.
- `contextInspectorVisible` is presentation only. Set it only after application-owned authorization and data-redaction checks. Project inspected content through `lsdAiContextInspector`.
- `processing` and `actionsDisabled` reflect caller-owned state. `accepted`, `rejected`, and `regenerateRequested` emit intent only.

```html
<lsd-ai-content
  id="summary-draft"
  title="Architecture summary"
  provenance="ai-generated"
  state="draft"
  confidence="medium"
  [citations]="displaySafeSources"
  [contextInspectorVisible]="canInspectContext"
  (accepted)="requestAcceptance()"
  (rejected)="requestRejection()"
  (regenerateRequested)="requestRegeneration()">
  <p><!-- AI-authored content --></p>
  <section lsdAiSourcePreview><!-- caller-selected safe preview --></section>
  <pre lsdAiContextInspector><!-- caller-authorized safe context --></pre>
</lsd-ai-content>
```

## Required compositions

- Use the generating state while work is pending and the failed state for AI-specific failure. Never replace existing approved content with a loader or failure.
- Use citation chips and the source preview for source-backed output.
- Compose `ReviewApprovalComponent` for the canonical current/proposed compare view and final Accept/Reject workflow. The AI content pattern's actions are intent events and do not imply approval.
- Keep “Not architect approved” visible until the caller supplies `human-approved` provenance after its governed persistence succeeds.

## Accessibility

The component is a named region with text attribution in addition to color. Generation sets `aria-busy` and uses a polite status; failure uses an assertive alert. Citation chips are native buttons with pressed state, actions form a named group, and the context inspector uses native disclosure semantics. Animation stops under reduced-motion preference. Callers must provide meaningful, non-secret citation labels and accessible projected content.

## Responsive behavior

Headers and actions stack below 48rem. Citation chips wrap, source previews remain in document order, and content owns specialized overflow. Attribution stays visible at every width and in light and dark appearance.

## Do / don't

Do preserve attribution through edits, require an explicit governed approval transition, pass only display-safe citation/context data, and compose Review Approval for comparisons. Do not style AI material as an ordinary approved surface, interpret confidence as correctness, reveal prompt/context based on this component alone, or perform model, retrieval, policy, persistence, or audit work here.

## Visual coverage

`ai-content.visual.spec.ts` defines light/dark and desktop/mobile cases across draft, generating, suggested, failed, and human-approved states, including citations, caution, inspector, and action processing.
