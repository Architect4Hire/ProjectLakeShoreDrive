---
name: add-angular-feature
description: Add or modify an Angular 22 feature while preserving the Lake Shore Drive design system, typed API boundaries, accessibility, and modern Angular practices.
---


# Add Angular Feature

## Use when

Adding a route, page, form, feature state, feature service, or user-facing workflow.

## Procedure

1. Read `.claude/rules/angular.md` and `.claude/rules/design-system.md`.
2. Identify the feature boundary, route, owning backend API, and existing design-system primitives.
3. Inspect nearby Angular code before choosing patterns.
4. Prefer standalone components and route-level lazy loading.
5. Model local state with signals; derive with `computed()`.
6. Use typed reactive forms for substantial forms.
7. Put transport in a typed Angular API client/service, not in presentation components.
8. Compose `src/web/design-system/` primitives.
9. Add explicit loading, empty, error and success/progress states.
10. Preserve cancellation for stale searches/requests.
11. Verify keyboard/focus/labels and responsive behavior.
12. Run focused tests, lint and build.

## Stop conditions

Stop and surface a design decision if the task requires:

- a second component framework;
- bypassing the API boundary;
- creating global state for one local feature;
- a new service boundary;
- React/Next.js code.

## Completion report

State:

- route/components added;
- design-system primitives reused/added;
- state model;
- API client touched;
- accessibility checks;
- tests/build run.
