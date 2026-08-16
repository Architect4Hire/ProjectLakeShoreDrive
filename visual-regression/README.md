# Visual regression

Traceability: DS-012, TEST-006.

The Angular fixture app imports production standalone APIs only from the root design-system entry point. Fixtures use fixed strings and records; Playwright fixes locale, timezone, viewport, reduced motion, animations, transitions, and caret rendering.

Run `npm ci`, `npx playwright install chromium`, then `npm run test:visual`. Update reviewed baselines with `npm run test:visual:update`. Never update snapshots as an automatic response to failure: inspect `visual-regression/results` first.

The explicit matrix covers light/dark appearance and desktop/tablet/mobile widths. Add a stable fixture and matrix case whenever a production component or critical recipe joins the supported surface. Do not use current dates, random IDs, network data, timers, or snapshots taken while an animation is active.
