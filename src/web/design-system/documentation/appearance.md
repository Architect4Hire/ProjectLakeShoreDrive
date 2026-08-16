# Appearance switching

Traceability: DS-010.

`AppearanceService` owns the complete public appearance contract. Its accepted
and observable value is the `Appearance` union: `light | dark`. Feature and
component APIs select an appearance or consume semantic CSS variables; they do
not receive raw palette values.

The service defaults to light, reads only a validated value from
`lsd.design-system.appearance`, and applies the selection to the document root
as `data-appearance`, `color-scheme`, and the complete semantic `--lsd-color-*`
variable set. It then persists the validated selection. Storage and document
access are browser-guarded for Angular SSR, and unavailable storage falls back
deterministically to the in-memory light appearance.

Include `foundations/tailwind.css` in the application global style entry.
Inject `AppearanceService` at the application shell and call
`setAppearance('light' | 'dark')` or `toggleAppearance()` from an accessible
control. The control should expose its current state with text and/or
`aria-pressed`; appearance must not be communicated by color alone.

The starter's arbitrary color variants, direction setting, full class-name
replacement, and unvalidated JSON persistence were intentionally discarded.
Directionality remains an independent document/internationalization concern.
