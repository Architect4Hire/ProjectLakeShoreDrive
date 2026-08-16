---
paths:
  - "src/web/**/*.ts"
  - "src/web/**/*.html"
  - "src/web/**/*.css"
  - "src/web/**/*.scss"
  - "src/web/angular.json"
  - "src/web/package.json"
---

# Angular 22 rules

- New UI code uses Angular 22 idioms, not React patterns.
- Prefer standalone components, directives and pipes.
- Prefer signals for local UI state and `computed()` for derived state.
- Use `effect()` only for side effects, not as a substitute for derived state.
- Prefer typed reactive forms for non-trivial forms.
- Prefer built-in control flow: `@if`, `@for`, `@switch`.
- Use route-level lazy loading for feature boundaries.
- Use `OnPush`; keep code zoneless-compatible.
- Do not add ZoneJS dependency unless the project explicitly requires it.
- Prefer Angular-supported RxJS/signal interop over manual subscription bookkeeping.
- Avoid `subscribe()` in components when `async`, signals, or lifecycle-safe interop expresses the behavior.
- Use functional interceptors/guards/providers when consistent with the project.
- Component classes orchestrate view behavior; domain invariants remain server-owned.
- No hardcoded internal service URLs in components.
- HTTP is accessed through typed client/services.
- Handle loading, empty, error, partial and long-running progress states.
- Use `track` in `@for` with a stable identity.
- Keep template expressions cheap and side-effect free.
- Preserve strict TypeScript and strict template checking.
- Do not introduce NgModules for new code without a concrete compatibility reason.
- Do not introduce React hooks, JSX, Redux vocabulary, or React component patterns.
- Run formatting, lint, tests and build for affected web projects.
