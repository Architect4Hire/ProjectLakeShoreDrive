# Review and approval pattern

`ReviewApprovalComponent` presents current and proposed content, governed provenance, and explicit accept/reject actions without knowing the reviewed record. It composes Surface, Badge, Button, and Split View APIs. Features remain responsible for permissions, validation, persistence, audit records, and queue progression.

## Variants and API

- Required: stable `id`, `title`, and typed `provenance`.
- Provenance exactly represents GOV-002: `human-authored`, `ai-suggested`, `ai-generated`, `human-modified-from-ai`, or `human-approved`.
- `decision` is `pending`, `approved`, or `rejected` and defaults to pending.
- `processing` is `approve`, `reject`, or `null`; it locks both decisions during an audited transition and shows loading only on the active action.
- `approvalDisabled` lets caller-owned authorization or validation prevent approval without suppressing rejection.
- The `approved` and `rejected` outputs express intent only. This component never silently promotes or mutates content.
- Project content through `lsdReviewCurrent`, `lsdReviewProposed`, `lsdReviewProvenance`, and optional `lsdReviewActions` slots.

```html
<lsd-review-approval
  id="change-review"
  title="Review proposed change"
  provenance="ai-suggested"
  [decision]="decision()"
  [processing]="processing()"
  [approvalDisabled]="!canApprove()"
  (approved)="approve()"
  (rejected)="reject()">
  <p lsdReviewProvenance><!-- citation/provenance composition --></p>
  <article lsdReviewCurrent><!-- current composition --></article>
  <article lsdReviewProposed><!-- proposal composition --></article>
</lsd-review-approval>
```

## Accessibility and interaction

The review is a named region. Current and proposed content inherit Split View's named regions, stable DOM order, focused mobile navigation, and semantic appearance. Decision controls form a labeled group; native buttons expose disabled and loading states. Decision badges announce completed outcomes politely. Approval remains a distinct affirmative action and is never inferred from viewing, editing, navigation, or dismissal.

## Responsive behavior

Desktop displays the current/proposed comparison side by side. Below 48rem, Split View provides focused pane switching and header/footer groups stack. Below 30rem, decision buttons stack with approval first in visual reading order while preserving logical DOM order. Projected content owns any specialized overflow behavior.

## Do / don't

Do show provenance, preserve the proposal as pending until the caller confirms persistence, and explain why approval is unavailable. Supply citations or source metadata in the provenance slot. Do not hide attribution, automatically approve generated content, mutate feature state inside this pattern, treat a button emission as persisted success, or import feature models/services.

## Appearance and visual coverage

All presentation uses semantic design-system components and tokens. `review-approval.visual.spec.ts` covers all five GOV-002 provenance categories, pending/approved/rejected outcomes, both processing actions, light/dark appearances, and desktop/mobile layouts for the workspace visual runner.
