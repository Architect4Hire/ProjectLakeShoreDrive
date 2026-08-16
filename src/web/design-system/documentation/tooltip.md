# Tooltip primitive

Traceability: DS-003, DS-007, DS-008.

`TooltipComponent` provides brief, supplemental, non-critical information for an existing focusable control. Import it and `TooltipTriggerDirective` from the public design-system API.

```html
<lsd-tooltip id="citation-help" text="Citations link claims to source evidence." placement="top">
  <button lsdTooltipTrigger type="button">Citation help</button>
</lsd-tooltip>
```

## Contract

- `id` and `text` are required. The stable ID becomes the tooltip ID.
- The projected, natively focusable trigger must carry `lsdTooltipTrigger`; the directive applies the correct `aria-describedby` without exposing registry or DOM implementation details.
- `placement`: `top | right | bottom | left`. Placement is advisory and does not change reading order.
- Focus or pointer entry opens the tooltip. Focus departure or pointer departure closes it. Escape dismisses it without moving focus and it stays dismissed until the current focus/hover engagement ends.
- The tooltip is noninteractive and has `pointer-events: none`. Critical information and actions must remain inline or use another component.

The component uses semantic raised-surface, text, and border tokens in both appearances, plus the documented popover elevation and tooltip z-index layer. It has no animation, so reduced-motion behavior is inherently satisfied. The bounded width remains usable on narrow screens.

The starter's sidebar tooltip was replaced because it was hover-only, used scale animation as state, lacked `role="tooltip"`/`aria-describedby`, and could not be dismissed with Escape.
