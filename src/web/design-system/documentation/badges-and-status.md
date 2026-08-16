# Badges and status

Traceability: DS-003, DS-006, DS-007, DS-008, DS-014.

`BadgeComponent` displays short, noninteractive metadata and workflow state. Import it from the design-system public API.

```html
<lsd-badge variant="success">Complete</lsd-badge>
<lsd-badge variant="ai-draft">AI draft</lsd-badge>
<lsd-badge variant="approved">Approved</lsd-badge>
```

## Contract

- `variant`: `neutral | info | success | warning | danger | ai-draft | suggested | approved | deprecated | archived`
- `size`: `small | medium`
- Projected text carries the status meaning, so color and the decorative dot are never the only indicators.
- `accessibleLabel` may provide fuller context than the visible short label.
- Static badges have ordinary text semantics and do not enter keyboard focus. Set `announce` only when a badge changes in response to background work or another action and the new state must be announced; it creates a polite `status` live region.
- A badge is not an action. Compose it with a link or button when interaction is required instead of adding click or keyboard behavior to the badge.

All variants use semantic tokens. `ai-draft` uses the dedicated draft surface/text/border set, while `approved` uses the dedicated approved set; this distinction is preserved in both appearances as required by DS-014. `suggested` intentionally uses informational semantics, `deprecated` uses danger semantics plus a text treatment, and `archived` uses muted semantics plus a dashed border. These remain distinguishable when color perception is limited.

The starter's hard-coded yellow table label was not retained because it exposed palette values and a dashboard-specific status assumption.
