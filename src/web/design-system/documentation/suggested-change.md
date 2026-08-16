# Suggested change pattern

`SuggestedChangeComponent` presents an AI-originated review-queue item as either a before/proposed comparison or a proposal-only change. It composes Surface, Badge, and Button primitives, keeps attribution visible, and emits review intent without inserting content into a record or granting approval.

## Variants and typed API

- Required `id` and `title` identify the review item.
- `layout` is `comparison` or `proposal-only`. Comparison shows `lsdSuggestedChangeBefore` and `lsdSuggestedChangeProposed`; proposal-only shows only the proposal.
- `provenance` is intentionally limited to `ai-suggested`, `ai-generated`, or `human-modified-from-ai`.
- `state` is caller-owned `pending`, `accepted`, or `rejected`. Accepted still displays “Not architect approved”; a separate governed approval workflow must change authoritative provenance.
- `processing` is `accept`, `reject`, or `null`; it disables both decisions while the consuming application records the queue action.
- `acceptDisabled` lets caller-owned validation or authorization prevent acceptance while preserving rejection. `actionsDisabled` disables both actions.
- `accepted` and `rejected` emit intent only. They never mutate the item, insert the proposal, persist queue state, or approve content.
- Project display-safe metadata through `lsdSuggestedChangeProvenance`, deeper evidence through `lsdSuggestedChangeContext`, and optional controls through `lsdSuggestedChangeActions`.

```html
<lsd-suggested-change
  id="resilience-change"
  title="Review resilience recommendation"
  layout="comparison"
  provenance="ai-suggested"
  [state]="queueItem.state"
  [processing]="processing()"
  [acceptDisabled]="!canAccept()"
  (accepted)="requestAcceptance(queueItem.id)"
  (rejected)="requestRejection(queueItem.id)">
  <p lsdSuggestedChangeProvenance>Suggested from governed ADR 0004.</p>
  <section lsdSuggestedChangeBefore><!-- current record excerpt --></section>
  <section lsdSuggestedChangeProposed><!-- proposed replacement --></section>
  <section lsdSuggestedChangeContext><!-- display-safe rationale and evidence --></section>
</lsd-suggested-change>
```

## Accessibility

The component is a named review region. Comparison panes are named regions in stable before/proposed DOM order. Provenance, review state, and “Not architect approved” are expressed in text instead of color alone. Decisions are native buttons in a named group with disabled and loading states. Resolved states announce politely through the status badge. Optional context uses keyboard-operable native disclosure semantics.

## Responsive behavior

Before and proposed panes appear side by side on desktop and stack below 48rem without changing their logical order. Header and footer groups also stack, while decision buttons remain grouped. At narrow mobile widths the visual action order emphasizes Accept while preserving Reject-first DOM and reading order.

## Do / don't

Do keep suggestions in an explicit review queue, show provenance, preserve the current value until caller-owned acceptance succeeds, and put deeper evidence in the context slot. Do not silently insert proposals, call acceptance “approval,” hide AI origin after acceptance, infer authorization from component inputs, or perform model, retrieval, persistence, policy, or audit work here.

## Visual coverage

`suggested-change.visual.spec.ts` defines light/dark and desktop/mobile coverage for both layouts, all provenance and resolution states, both processing actions, and expanded context.
