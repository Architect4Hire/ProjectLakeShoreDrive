# AI generation progress pattern

`AiGenerationProgressComponent` presents model-independent generation progress while preserving approved content and making the unapproved AI boundary explicit. It composes Surface, Badge, Button, and Alert Banner primitives. It does not start or cancel work, call models, retrieve context, authorize data, or infer progress.

## States and variants

- `state`: `generating`, `cancelling`, `cancelled`, `completed`, or `failed`.
- `mode="indeterminate"` is the default when the caller cannot measure progress. It deliberately omits numeric ARIA values.
- `mode="determinate"` accepts caller-owned `value` and `max`; display values are clamped to a safe `0..max` range.
- `announcement` accepts concise caller-owned milestone text. Change it only for meaningful phases, not every token or percentage update.
- `cancellable` controls whether a cancel button is presented. `cancelRequested` emits intent only. The caller should move to `cancelling` while its cancellation request is pending, then provide `cancelled`, `completed`, or `failed` based on its own workflow result.
- `failureMessage`, `progressLabel`, and `cancelLabel` provide display-safe presentation copy.

```html
<lsd-ai-generation-progress
  id="architecture-generation"
  title="Generate architecture section"
  mode="determinate"
  [state]="generationState()"
  [value]="completedSteps()"
  [max]="totalSteps()"
  [announcement]="accessibleMilestone()"
  [cancellable]="canRequestCancellation()"
  (cancelRequested)="requestCancellation()">
  <p>Preparing an AI-generated draft. Approved content remains unchanged.</p>
</lsd-ai-generation-progress>
```

## Accessibility

The component is a named region and exposes `aria-busy` only while generating or cancelling. Determinate progress uses the native progressbar ARIA value contract; indeterminate progress has an accessible label without misleading numeric values. Milestones and terminal states are announced through an atomic polite status, while failures use one assertive alert. Cancellation is a native keyboard-operable button with visible focus inherited from Button. Status, “AI-generated draft,” and “Not architect approved” text ensure meaning never relies on motion or color.

Animation and width transitions stop under `prefers-reduced-motion: reduce`; indeterminate progress becomes a static filled treatment. The progress semantics and status text remain unchanged.

## Responsive behavior

The header and footer stack below 48rem. Progress remains full-width, labels remain in document order, and the unapproved disclosure stays visible at all widths.

## Do / don't

Do keep existing approved content available while generation runs, use indeterminate mode unless progress is genuinely measurable, announce meaningful milestones, and reflect cancellation asynchronously. Do not remove approved content, expose raw prompts or sensitive context, treat completion as approval, fake percentage progress, or perform model, retrieval, policy, or backend work in this component.

## Visual coverage

`ai-generation-progress.visual.spec.ts` defines light/dark and desktop/mobile cases for all states and both progress modes, including cancellation and reduced-motion presentation.
