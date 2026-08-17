# Nav menu

`NavMenuComponent` is the grouped, nested, collapsible navigation-list pattern for secondary/sidebar navigation - typically composed into `WorkbenchShellRecipeComponent`'s navigation slot. It owns route-active highlighting, group labels, one level of expandable children, and a persistent icon-rail collapse mode. It does not own routing configuration or application-specific route constants; active-state detection is built entirely on Angular's own `RouterLink`/`RouterLinkActive` directives, so it stays domain-neutral.

## API

- `accessibleName` (required) and `groups` (required): `NavMenuGroup[]`, each an optional section `label` plus `NavMenuItem[]`.
- `NavMenuItem`: stable `id`, `label`, `routerLink`, optional `iconName` (from the design system's typed icon registry), optional one level of `children`.
- `collapsed`: two-way `model()` for the persistent narrow icon-rail mode. Distinct from `WorkbenchShellRecipeComponent`'s own mobile open/closed overlay - a consumer composes both independently (collapsed is "always show only icons," not "hidden until toggled open").
- `itemActivated` emits the selected `NavMenuItem` on click, for callers that want to react beyond routing (e.g. closing a mobile drawer).

## Variants and states

Each item with `children` gets its own expand/collapse toggle (multiple groups can be expanded at once - there is no forced single-open accordion). When `collapsed` is true, labels hide visually (available via a `lsd-sr-only` span and a `TooltipComponent` on hover/focus) and items with no `iconName` fall back to an initials badge rendered from the label's first letter, so collapsed mode degrades gracefully even without icons registered. Items with `children` do not render their nested list while collapsed - only the parent's own icon/tooltip shows.

## Accessibility

Expand/collapse toggles use `aria-expanded` and `aria-controls` pointing at the nested list's `id`. The collapse-mode toggle uses `aria-pressed`. Active links get a `routerLinkActive` class (not only a color change - collapsed active items also get a filled accent background, not solely a text-color shift). Collapsed items keep their full label available to assistive technology via an `lsd-sr-only` span even though it's visually hidden.

## Responsive / collapsed-mode behavior

`collapsed` is a persistent user-driven layout preference (like an icon rail), not itself a breakpoint-driven behavior - the design system doesn't decide when to collapse based on viewport width. Consumers who want viewport-driven collapse can bind `collapsed` to their own media-query signal.

## Do / don't

Do keep `NavMenuItem.routerLink` pointing at real application routes owned by the caller. Do use `iconName` from the shared icon registry where available. Don't nest more than one level of `children` - the type only models one level, matching the interaction the expand/collapse toggle supports. Don't use this for primary top-level navigation that also needs a horizontal layout - see `app-navbar.md`.

## Appearance and visual coverage

Uses semantic tokens throughout (`accent-primary` for the active state, `surface-raised` for hover, `radius-control`/`radius-pill`). Reduced-motion removes the collapse-toggle icon's rotation transition.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { NavMenuComponent, type NavMenuGroup } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [NavMenuComponent], templateUrl: './example.html' })
export class NavMenuExampleComponent {
  readonly groups: NavMenuGroup[] = [
    { id: 'engagement', label: 'Engagement', items: [{ id: 'overview', label: 'Overview', routerLink: '/overview' }] },
  ];
}
```

```html
<lsd-nav-menu accessibleName="Engagement navigation" [groups]="groups" />
```
