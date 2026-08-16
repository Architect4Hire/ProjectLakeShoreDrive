# Drawer

`DrawerComponent` presents a focused modal workflow beside the underlying workbench. It is business-neutral and suitable for source previews, generation progress/details, filters, and other supplemental tasks.

## API and composition

- Required: `id`, `title`.
- Optional: `description`, `open`, logical `placement` (`start` or `end`), `size` (`compact`, `default`, `wide`), `dismissible`, and `closeLabel`.
- Output: `closeRequested` with `escape`, `backdrop`, or `close-button`; the owner then sets `open` to false.
- Project content normally and mark the action container with `lsdDrawerActions`.
- Mark the safest initial control with `lsdDrawerInitialFocus`; otherwise the first enabled focusable control is selected.

```html
<lsd-drawer id="source-preview" title="Source preview"
  description="Inspect the evidence used for this suggestion."
  [open]="previewOpen()" (closeRequested)="previewOpen.set(false)">
  <article>Source content</article>
  <div lsdDrawerActions><lsd-button lsdDrawerInitialFocus>Done</lsd-button></div>
</lsd-drawer>
```

## Accessibility and overlay behavior

The native modal dialog supplies top-layer rendering and focus containment. The heading and optional description label it. Initial focus is deterministic, Escape/backdrop/close controls request dismissal, and focus returns to the previously active trigger. A non-dismissible drawer suppresses those implicit exits; its projected workflow must provide an explicit completion path.

## Responsive behavior and appearance

At compact widths the drawer occupies available viewport width and height. At larger widths it uses tokenized compact, default, or wide panel sizing. Body content scrolls independently, actions wrap, and the close target remains at least 44px. Logical placement supports left-to-right and right-to-left layouts. Semantic surface, border, and text tokens resolve in both appearances. Overlay transitions use shared motion tokens and reduce to zero duration under `prefers-reduced-motion`.

## AI-specific usage

For DS-013, compose source citations or generation-state components inside this primitive; do not teach the drawer about AI provider payloads or feature records. Do use it to preserve workbench context while inspecting evidence. Do not hide approval-critical information solely inside a dismissible overlay.

## Visual coverage

`drawer.visual.spec.ts` defines light/dark, mobile/desktop, start/end, source-preview, and generating-state cases for the workspace visual runner. Component tests cover modal opening, labeling, projected actions, initial focus, Escape dismissal, focus restoration, placement, tokenized sizing, and semantic appearance classes.
