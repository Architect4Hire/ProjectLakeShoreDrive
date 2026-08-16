# Motion

Traceability: DS-003, DS-008.

The motion tokens preserve the starter's existing 100ms, 200ms, 300ms, and
500ms interaction timings without adding decorative animation. Components use
the semantic duration and easing roles through the CSS custom properties in
`foundations/motion.css`; hard-coded component durations are unsupported.

## Reduced motion

The application global style entry includes these rules through
`foundations/tailwind.css` and must
place `data-lsd-design-system` on the design-system application boundary. When
`prefers-reduced-motion: reduce` is active:

- every duration variable other than `none` resolves to `0ms`;
- smooth scrolling inside the boundary becomes immediate; and
- scoped transition/animation delays and durations resolve to `0ms`, including
  pseudo-elements, with animation iterations limited to one as a safety net.

Angular components must express persistent state through text, iconography,
ARIA state, shape, or color with sufficient contrast. Motion may reinforce a
state change but must never reveal information that is otherwise unavailable.
Entrance/exit completion logic must not depend on a non-zero CSS duration, and
focus must be placed or restored independently of visual transitions.

## Base transition contract

Supported base transitions are state change (`fast`), ordinary transition
(`default`), overlay transition (`slow`), and an existing-capability deliberate
transition (`deliberate`). All resolve through `--motion-duration-*`, so the
preference media query disables them without component-specific overrides.
Angular animation implementations must read the same preference and select a
zero-duration or no-animation path; CSS alone cannot override durations coded
inside Angular animation metadata.
