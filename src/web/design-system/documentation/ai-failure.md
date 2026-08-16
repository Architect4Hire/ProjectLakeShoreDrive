# AI failure pattern

`AiFailureComponent` distinguishes recoverable and terminal AI-operation failures while confirming that approved content was not replaced. It composes Alert Banner, Badge, and Button primitives. It never retries a model, sends a report, writes to the clipboard, exposes diagnostics, or makes an authorization decision.

## States and typed hooks

- Required `id` and display-safe `message` identify and explain the failure.
- `kind="recoverable"` uses a polite warning alert and may show Retry. `kind="terminal"` uses an assertive danger alert and never shows Retry.
- `retryAvailable` controls presentation; `retryRequested` emits intent only.
- `detailsAvailable` must be set only after caller-owned authorization/redaction checks. It reveals the `lsdAiFailureDetails` slot through native disclosure and emits `detailsToggled` for presentation telemetry if the caller chooses to observe it.
- `correlationVisible` independently controls whether `correlationId` enters the DOM. `copyCorrelationAvailable` shows Copy only when a visible identifier exists. `correlationCopyRequested` emits the identifier but does not access the clipboard.
- `reportAvailable` shows Report. `reportRequested` emits kind plus the correlation ID only when that identifier is already visible.
- `processing` is `retry`, `report`, `copy-correlation`, or `null` and locks concurrent actions.
- `copyState` is caller-owned `idle`, `copied`, or `failed` and supplies polite assistive feedback.

```html
<lsd-ai-failure
  id="section-generation-failure"
  kind="recoverable"
  message="The draft was not saved. Your approved section is unchanged."
  [detailsAvailable]="canInspectDiagnostics()"
  [correlationVisible]="canViewCorrelation()"
  [correlationId]="displaySafeCorrelationId()"
  [copyCorrelationAvailable]="canCopyCorrelation()"
  [reportAvailable]="canReport()"
  [processing]="processingAction()"
  (retryRequested)="requestRetry()"
  (correlationCopyRequested)="copyAfterUserIntent($event)"
  (reportRequested)="requestReport($event)">
  <pre lsdAiFailureDetails><!-- authorized, redacted diagnostics only --></pre>
</lsd-ai-failure>
```

## Accessibility

Recoverable failures use a polite live status; terminal failures use an assertive alert. Titles, failure kind, AI attribution, and approved-content safety are visible text, not color-only signals. Retry, Copy, and Report compose native Button semantics with focus, disabled, and loading behavior. Diagnostic details use keyboard-operable native disclosure. Copy results are announced politely without stealing focus.

The component contains no motion of its own. Button loading animation follows the shared reduced-motion treatment.

## Responsive behavior

Labels and actions wrap at normal widths and stack below 30rem. Correlation metadata also changes from label/value columns to a stacked layout, preventing horizontal overflow for long identifiers.

## Do / don't

Do explain whether work was preserved, reserve terminal for failures that cannot recover in the current flow, redact diagnostic content before projection, and expose correlation IDs only when authorized. Do not put secrets or raw provider payloads in messages, retry automatically, write to the clipboard without explicit intent, send reports from this component, or imply that a failed AI draft changed approved content.

## Visual coverage

`ai-failure.visual.spec.ts` covers recoverable/terminal failures, light/dark appearance, desktop/mobile widths, authorized and hidden diagnostics, correlation/report controls, processing, and copy feedback.
