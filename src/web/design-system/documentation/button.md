# Button primitive

`ButtonComponent` is the standalone, native-button primitive for user-initiated actions. Import it from the design-system public API; do not import its implementation path.

```html
<lsd-button tone="primary" size="medium" (activated)="save()">
  <app-save-icon lsdButtonLeadingIcon />
  Save
</lsd-button>
```

## Contract

- `tone`: `primary | danger | success | warning | info | neutral`
- `impact`: `bold | light | minimal`
- `size`: `small | medium | large`; narrow/coarse-pointer layouts retain a 44px minimum target
- `shape`: `square | rounded | pill`
- `type`: `button | submit | reset`, defaulting to the safer `button`
- `disabled` and `loading` both make the native button unavailable. Loading also sets `aria-busy` and announces `loadingLabel` through a polite status.
- `pressed` supplies native toggle-button state when defined.
- `accessibleLabel` forwards an accessible name for icon-only usage. Visible button text remains preferred.
- Icons compose through `lsdButtonLeadingIcon` and `lsdButtonTrailingIcon`; projected icons are decorative because the button label owns the accessible name.

Native `<button>` behavior supplies Enter/Space activation, form semantics, focus order, and disabled-event suppression. The shared interaction foundation supplies focus-visible and disabled treatment. All colors use semantic light/dark tokens, and reduced-motion mode removes the transition and spinner rotation without hiding loading state.

Focused component tests cover native semantics, activation, disabled/loading behavior, accessible status, and icon projection. Run them with the Angular workspace test target once that target is present.
