# Radius, borders, elevation, and layers

Traceability: DS-003, DS-006.

The raw radius, border-width, and shadow scales normalize the starter's
repeated `rounded-*`, `border`, and `shadow-*` values. Consumers should select
semantic roles such as `radiusTokens.panel`, `borderTokens.separator`, and
`elevationTokens.popover`; they should not preserve `rounded-[30px]`,
`shadow-custom`, or other starter one-offs.

Border tokens intentionally omit color. Pair them with a semantic color such
as `border-default`, so appearance remains controlled by the theme.

## Deterministic stacking

Every global stacking context must use one of `globalLayers`. No component may
choose a value between these layers.

| Order | Layer | Represents |
| ---: | --- | --- |
| 0 | `base` | normal page and panel content |
| 10 | `raised` | locally raised, non-sticky content |
| 100 | `sticky` | sticky workbench headers, rails, and controls |
| 200 | `popover` | menus, combobox lists, and popovers |
| 300 | `overlay` | isolated drawer and dialog hosts |
| 400 | `tooltip` | transient explanatory content above interaction surfaces |
| 500 | `notification` | urgent global notices and toast regions |

Drawers and dialogs mount an isolated host at `overlay`. Within that stacking
context, `localOverlayLayers.backdrop` sits below
`localOverlayLayers.content`. This lets multiple overlay implementations share
one deterministic contract without dialog- or drawer-specific magic numbers.
Application overlay coordination determines which host is active; it must not
stack concurrent hosts by incrementing z-index values.

## Capability verification

- Sticky workbench regions: `globalLayers.sticky` + `elevationTokens.sticky`.
- Popovers: `globalLayers.popover` + `elevationTokens.popover`.
- Drawers and dialogs: `globalLayers.overlay`, local backdrop/content layers,
  and `elevationTokens.overlay` or `overlay-prominent`.
- Tooltips: `globalLayers.tooltip` + `elevationTokens.popover`.

These roles cover the starter's observed z-index values (0, 1, 10, and 20)
without carrying their component-local numbers into the production system.

