# AI confidence and caution

`AiConfidenceComponent` communicates a qualitative, caller-supplied uncertainty assessment without converting model scores into unsupported precision. It composes Alert Banner and Badge primitives. It does not calculate confidence, inspect model output, retrieve evidence, decide authorization, or approve content.

## Semantic levels and API

- Required `id` and display-safe `summary` identify and explain the assessment.
- `level` is deliberately categorical: `unknown`, `limited`, `moderate`, or `strong`. There is no numeric score or percentage input.
- `unknown` and `limited` use warning treatment. `moderate` and `strong` use informational treatment. No level uses success or approved styling.
- Every level displays “AI assessment,” “Not architect approved,” and caller-configurable `verificationLabel` text.
- `announcement` is `off` by default and may be `polite` or `assertive` when a changing assessment genuinely warrants announcement.
- `showDetails` reveals caller-supplied `lsdAiConfidenceBasis` and `lsdAiConfidenceLimitations` slots using native disclosure semantics.
- Optional controls project through `lsdAiConfidenceActions`.

```html
<lsd-ai-confidence
  id="recommendation-confidence"
  level="limited"
  summary="Relevant operational constraints were not represented."
  [showDetails]="true">
  <p lsdAiConfidenceBasis>Three governed sources support part of the recommendation.</p>
  <p lsdAiConfidenceLimitations>Production telemetry was not available.</p>
  <lsd-citation-chip lsdAiConfidenceActions
    [citation]="primarySource"
    previewId="source-preview"
    (previewRequested)="showSource($event)" />
</lsd-ai-confidence>
```

## Accessibility

The Alert Banner supplies a labeled status or group. Level, AI origin, non-approval, summary, and verification guidance are all visible text, so meaning never depends on color. Basis and limitations use a native keyboard-operable disclosure and named sections. The component does not use meter or progressbar semantics because the categories are caution labels, not measurements.

Use `announcement="polite"` only when the level or summary changes meaningfully. Avoid repeatedly announcing confidence during generation.

## Responsive behavior

Labels wrap at available width and stack below 30rem. Summary, guidance, details, and actions remain in logical reading order. Alert Banner supplies mobile action stacking and semantic light/dark appearance.

## Do / don't

Do state why confidence is limited, identify missing evidence, keep verification guidance actionable, and default to `unknown` when no defensible qualitative assessment exists. Do not transform opaque model scores into percentages, use confidence as a correctness claim, use success styling for “strong,” hide known limitations, or treat any level as architect approval.

## Visual coverage

`ai-confidence.visual.spec.ts` covers all four semantic levels in light/dark appearance and desktop/mobile widths, including expanded details and actions.
