# ADR summary recipe

Traceability: DS-003. Supporting product context: BR-060 through BR-063 and GOV-002.

## Purpose

`AdrSummaryComponent` presents an architecture decision record summary with number, title, status, decision, rationale, linked requirements and patterns, provenance, and contextual actions. It composes public surface, badge, and separator primitives and contains no domain services.

## Usage

```html
<lsd-adr-summary [adr]="adr">
  <lsd-button lsdAdrRequirements impact="minimal">Related requirements</lsd-button>
  <lsd-button lsdAdrPatterns impact="minimal">Pattern details</lsd-button>
  <span lsdAdrContext>Updated yesterday</span>
  <lsd-button lsdAdrActions impact="light">Review ADR</lsd-button>
</lsd-adr-summary>
```

`AdrSummaryViewModel` requires `number`, `title`, typed status presentation, decision, rationale summary, and GOV-002 provenance. Linked references contain display-safe stable IDs and labels. `headingLevel` accepts 2–4, and `actionsLabel` names the action group.

## States and provenance

ADR status is presentation data because the canonical requirements do not define its lifecycle. Provenance is fixed to human authored, AI suggested, AI generated, human modified from AI, or human approved. AI-generated content explicitly says “Not approved” and uses the AI-draft treatment; only `human-approved` receives approved styling.

The requirement, pattern, context, and action slots accept richer public controls. Application code owns authorized visibility, navigation, retrieval, and mutations.

## Responsive behavior

Desktop uses paired decision/rationale and requirement/pattern columns. Below `48rem`, header badges move beneath identity, content becomes one column, and footer actions wrap below context. Long titles, decisions, and references wrap without widening the viewport.

## Accessibility

The card is a named region using ADR number and title, with a configurable real heading. Decision, rationale, requirements, and patterns are named sections. Status and provenance are visible text rather than color alone. Stable linked IDs remain visible and included in badge accessible names. Actions form a group named with the ADR number.

## Do / don't

Do provide concise summaries and already-authorized references, preserve stable ADR/reference IDs, and use public components in slots. Don't fetch similar ADRs, resolve evidence, calculate permissions, persist edits, approve decisions, or implement lifecycle transitions in this recipe.

## Visual regression

Capture light/dark desktop, tablet, and mobile layouts; every provenance treatment; approved versus AI-generated states; long content; many/no links; actions present/absent; and keyboard focus on projected controls.
