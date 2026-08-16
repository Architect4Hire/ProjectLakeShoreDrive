# Interaction state foundations

Traceability: DS-008.

The application includes these rules through `foundations/tailwind.css`. They
enhance native elements and explicit ARIA states; they do not replace native
semantics.

## Contract

- Use native `disabled`, `readonly`, and `required`/constraint validation when
  the HTML element supports them. ARIA communicates a state but does not
  implement its behavior; custom widgets with `aria-disabled="true"` must also
  suppress activation in their Angular logic.
- Keyboard focus receives a 3px semantic ring with a 2px offset. The outline
  declaration is intentionally protected from utility-class suppression.
- Invalid fields use the semantic danger color in addition to native/ARIA
  state. Associate error text using `aria-describedby` and announce dynamic
  errors as appropriate.
- Readonly fields remain legible and focusable; they are not styled as disabled.
- `.lsd-sr-only` visually hides content while preserving it for assistive
  technology. `.lsd-sr-only-focusable` reveals skip links on focus.

The theme boundary supplies `--lsd-color-focus-ring`,
`--lsd-color-status-danger`, and `--lsd-color-surface-raised` from the semantic
color tokens. The system-color
fallbacks keep focus and state visible before theme wiring and in forced-color
modes.

## Focus contrast

`--color-focus-ring` resolves to `accent-primary`: blue 700 in the light
appearance and blue 400 in the dark appearance. Static contrast verification
covers `surface-page`, `surface-panel`, and `surface-raised` in both themes.
The browser `Highlight` fallback is used when semantic theme variables are not
present, and forced-colors mode retains the native system focus color.
