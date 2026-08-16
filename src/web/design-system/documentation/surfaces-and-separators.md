# Surfaces and separators

Traceability: DS-003, DS-004, DS-005, DS-006.

`SurfaceComponent` and `SeparatorComponent` replace repeated page-level bundles for panels, cards, grouped content, and dividing rules. Import both from the design-system public API.

```html
<lsd-surface
  tone="panel"
  padding="comfortable"
  radius="panel"
  elevation="raised"
  [accessibility]="{ role: 'region', label: 'Architecture summary' }">
  <!-- composed design-system content -->
</lsd-surface>

<lsd-separator spacing="section" />
```

## Surface contract

- `tone`: `page | panel | raised`, mapped to semantic appearance tokens.
- `padding`: `none | compact | default | comfortable`, mapped to the spacing contract.
- `radius`: `none | panel | prominent`, mapped to the radius contract.
- `border`: `none | default | strong`, mapped to border width/style plus `border-default` color.
- `elevation`: `flat | raised | sticky`, mapped directly to semantic elevation tokens.
- `accessibility`: `{ role: 'none' }` by default, or a typed named `group`/`region`. Do not create unnamed landmark regions.

## Separator contract

- `orientation`: `horizontal | vertical`. Horizontal uses native `<hr>` semantics; vertical exposes `role="separator"` and `aria-orientation="vertical"`.
- `spacing`: `none | compact | default | section`, mapped to spacing tokens.
- `lineStyle`: `solid | dashed`, mapped through the separator border contract and semantic `border-default` color.
- `decorative`: removes the rule from the accessibility tree when it carries no structural meaning.

Both primitives are noninteractive and intentionally excluded from keyboard focus. They contain no motion and resolve semantic backgrounds, text, and border color through the deterministic light/dark appearance contract. The starter's repeated `bg-background`, `bg-card`, border, radius, and shadow bundles were replaced because they were page-level implementation strings rather than stable component APIs.
