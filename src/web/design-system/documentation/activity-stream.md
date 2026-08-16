# Activity and history stream

`ActivityStreamComponent<T>` presents a chronological, auditable sequence of significant changes without knowing the affected record type or loading service. It standardizes actor, action, timestamp, source, human/AI attribution, optional details, and empty presentation by composing Surface, Badge, and State Feedback APIs.

## Typed API and composition

Each `ActivityStreamItem<T>` requires a typed identity, actor, action, machine-readable ISO `occurredAt`, caller-localized `timestampLabel`, and attribution. `source` and `hasDetails` are optional. Attribution supports all five GOV-002 categories plus `system` for application-generated audit events.

Use one `lsdActivityDetails` template for typed per-event details. Its context provides the item, index, and count.

```html
<lsd-activity-stream id="record-history" accessibleName="Record history" [items]="history()">
  <ng-template lsdActivityDetails let-event let-index="index">
    <!-- diff, reason, citations, or audit metadata using public APIs -->
  </ng-template>
</lsd-activity-stream>
```

The feature owns ordering, pagination, localization, persistence, actor resolution, source links, and authorization. The component preserves the supplied order and does not claim to create an audit record.

## Accessibility and interaction

The stream is an ordered list inside a named region. Each event is an article labeled by its actor/action statement. Native `<time datetime>` preserves a machine-readable instant while showing caller-localized text. Attribution is visible text, not color alone. Optional details use native `<details>`/`<summary>`, begin collapsed, and support keyboard operation without custom scripting. The empty case composes the standard accessible state pattern.

## Responsive behavior

Desktop keeps event metadata and attribution aligned horizontally. Below 30rem, attribution moves beneath the actor/action text, while the timeline and chronological DOM order remain intact. Long actor, action, source, and detail content wraps rather than introducing horizontal scrolling.

## Do / don't

Do provide immutable event identities, absolute timestamps, localized display labels, meaningful actors, and resolvable source context. Put diffs or secondary audit metadata in the details template. Do not use this visual pattern as the audit store, fabricate actor/source information, hide AI attribution, reorder events in CSS, import feature models/services, or place decision-critical action controls only inside collapsed details.

## Appearance and visual coverage

Timeline, surfaces, badges, borders, text, focus, and empty presentation use semantic design-system APIs in both appearances. `activity-stream.visual.spec.ts` covers all attribution categories, expanded details, empty state, and desktop/mobile layouts for the workspace visual runner.
