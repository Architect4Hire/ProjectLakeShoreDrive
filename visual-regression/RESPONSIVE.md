# Responsive behavior tests

Traceability: DS-009.

Run `npm run test:responsive`. Fixed widths are desktop 1280px, tablet 768px, and mobile 390px. The suite verifies behavior rather than scaled screenshots: persistent/off-canvas shell navigation and Escape handling; table-to-card substitution; split-view pane switching and focus; drawer width and dismissal; phase-navigation overflow reachability; and dense-recipe page overflow.

Run `node src/web/design-system/documentation/check-responsive-documentation.mjs` to ensure every critical recipe retains explicit narrow-screen guidance. Manual review remains required for content quality, zoom, device safe areas, virtual keyboards, localization expansion, and real assistive-technology combinations.
