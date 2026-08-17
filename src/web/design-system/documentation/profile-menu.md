# Profile menu

`ProfileMenuComponent` is the avatar-trigger account dropdown: an identity header (initials avatar, name, optional email), a caller-owned list of links (Profile/Settings/Log out or whatever the consumer needs), and the design system's appearance controls (light/dark, the seven-color accent picker, and direction) surfaced inline, since this is the natural place an end user expects to find them - the design system otherwise has no other built-in surface for exposing `AppearanceService` to a user.

## API

- `id` (required): DOM id base for the trigger/panel pair.
- `name` (required) and `email` (optional): identity header content. The avatar shows the name's first letter, not an external image - matching this design system's no-external-network-dependency posture rather than the reference template's `ui-avatars.com`-generated avatar image.
- `directionControlEnabled`: hides the RTL/LTR toggle when a consumer's application doesn't support RTL content yet (defaults to shown).
- `[lsdProfileMenuLink]` is a content-projection slot for any number of consumer-owned links or buttons (e.g. `routerLink`-based navigation, or a log-out action).

## Behavior

The panel is a native `[popover]` (not custom-built focus-trap/click-outside logic) so light-dismiss, Escape-to-close, and top-layer stacking come from the browser for free. A `beforetoggle` handler positions the panel near its trigger (plain popovers have no built-in anchoring - see the same technique and its rationale in `DataTableComponent.positionActionsMenu`).

Appearance changes call straight through to the injected `AppearanceService` (`setAppearance`/`setAccentColor`/`setDirection`) - the pattern holds no appearance state of its own. Accent swatches preview each option's actual resolved color via `AppearanceService.previewColorFor()`, which keeps the raw per-accent hex values encapsulated in the service rather than importing `tokens/internal/` into a pattern component.

## Accessibility

The trigger has an accessible name derived from `name`. Each settings row is a labeled `role="group"` with `aria-pressed` on the active option (mode/accent/direction) - state is never conveyed by color alone. Accent swatches carry `aria-label="Use <Color> accent"` in addition to their visual preview.

## Do / don't

Do let the consumer own what links appear (log-out behavior, routes, feature flags). Don't put feature-specific menu items in the design system's part of this component - project them instead. Don't assume `email` is always present; it's optional and the header layout adapts when it's absent.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { ProfileMenuComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [ProfileMenuComponent], templateUrl: './example.html' })
export class ProfileMenuExampleComponent {}
```

```html
<lsd-profile-menu id="account-menu" name="Jamie Ortiz" email="jamie@example.com">
  <a lsdProfileMenuLink routerLink="/profile">Profile</a>
  <button lsdProfileMenuLink type="button" (click)="logOut()">Log out</button>
</lsd-profile-menu>
```
