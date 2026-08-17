# App navbar recipe

## Purpose

`AppNavbarComponent` composes the desktop top navigation bar: a logo slot, a flat list of top-level primary links, a caller-owned actions slot, and a `ProfileMenuComponent` trigger. It is deliberately top-level-only - it does not render nested dropdown flyouts. Grouped/nested secondary navigation belongs in `NavMenuComponent`, composed separately into `WorkbenchShellRecipeComponent`'s navigation slot. Splitting primary (navbar) from secondary (sidebar) navigation this way avoids two overlapping menu interaction models (inline-expand vs. hover/click flyout) in one component.

## API and contract

- `links`: optional `AppNavbarLink[]` (`id`, `label`, `routerLink`) rendered as a flat, active-highlighted list via Angular's own `RouterLink`/`RouterLinkActive`.
- `profileName` (required) and `profileEmail` (optional) forward to the composed `ProfileMenuComponent`.
- `[lsdAppNavbarLogo]` and `[lsdAppNavbarActions]` are content-projection slots for caller-owned branding and extra toolbar controls.
- `[lsdProfileMenuLink]` passes through to the composed profile menu's own link slot (see `profile-menu.md`).

## Variants and states

Active links use `routerLinkActive` for highlighting; there is no other state beyond a link being active or not, since the component holds no navigation state of its own - `AppNavbarComponent` is presentation-only.

## Accessibility

The link list is a labeled `<nav aria-label="Primary">` landmark. Each link is a native `<a>` with `routerLinkActive` providing non-color-dependent emphasis (bold weight, not only an accent-color change). The composed profile menu carries its own accessibility contract (see `profile-menu.md`).

## Responsive behavior

Below `48rem`, the flat top-level link list hides entirely. This depends on the caller also composing `NavMenuComponent` into the workbench shell's navigation drawer for mobile access to the same destinations - `AppNavbarComponent` alone does not guarantee mobile-reachable navigation for its `links` input. Consumers who need the same links reachable on narrow viewports should project matching items into `NavMenuComponent` rather than relying on the navbar alone.

## Do / don't

Do keep `links` to primary, top-level destinations only. Do compose `NavMenuComponent` in the workbench shell's drawer for anything nested or for mobile reachability. Don't add per-link dropdown children to `links` - the type intentionally has no `children` field, unlike `NavMenuItem`.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { AppNavbarComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [AppNavbarComponent], templateUrl: './example.html' })
export class NavbarExampleComponent {}
```

```html
<lsd-app-navbar [links]="primaryLinks" profileName="Jamie Ortiz" profileEmail="jamie@example.com">
  <img lsdAppNavbarLogo src="/logo.svg" alt="Lake Shore Drive" />
  <a lsdProfileMenuLink routerLink="/profile">Profile</a>
  <a lsdProfileMenuLink routerLink="/settings">Settings</a>
  <button lsdProfileMenuLink type="button" (click)="logOut()">Log out</button>
</lsd-app-navbar>
```
