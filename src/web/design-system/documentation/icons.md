# Icon abstraction

## Purpose and variants

Use `IconComponent` for supported `IconName`, `IconSize`, `IconTone`, and `IconAccessibility` values; arbitrary SVG paths are not a variant.

Traceability: DS-003, DS-007, DS-008.

`IconComponent` is the only supported feature-facing icon renderer. Import it and `IconName` from the design-system public API. Feature code must not depend on SVG asset paths, registry internals, or an icon vendor.

```html
<lsd-icon name="search" />
<lsd-icon
  name="warning"
  tone="warning"
  [accessibility]="{ mode: 'informative', label: 'Warning' }" />
```

## Contract

- Names are compile-time checked by `IconName`; the initial architecture-neutral set is `check`, four chevrons, `close`, `error`, `info`, `menu`, `minus`, `more-vertical`, `plus`, `search`, and `warning`.
- Icons default to `{ mode: 'decorative' }`, which sets `aria-hidden="true"`. Use `{ mode: 'informative', label: string }` only when the icon conveys information that adjacent text does not already provide.
- Sizes are `small`, `medium`, and `large`. Tones are `current`, `primary`, `muted`, `success`, `warning`, `danger`, and `info`.
- Icons are intentionally noninteractive and never enter keyboard focus. Put action icons inside a native interactive primitive such as `ButtonComponent`; the control owns the accessible name and keyboard behavior.
- The SVG uses `currentColor`. Non-current tones resolve exclusively through semantic color tokens, so the same API works in light and dark appearances.

The retained starter demonstrated the value of centralized SVG rendering, but its `angular-svg-icon` component and asset-path strings are not part of this public contract. The local registry replaces that coupling and can change implementation without feature changes. The original starter icon assets remain excluded pending independent provenance review.

## Accessibility, responsive behavior, and do / don't

Decorative icons are hidden from assistive technology. Semantic icons require a label. Size is explicit and does not change by viewport. Do pair icons with visible text where practical; don't use an icon alone to communicate state.

## Standalone Angular usage

```ts
import { Component } from '@angular/core';
import { IconComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [IconComponent], template: `<lsd-icon name="search" accessibility="decorative" />` })
export class IconExampleComponent {}
```

```html
<lsd-icon name="search" accessibility="decorative" />
```
