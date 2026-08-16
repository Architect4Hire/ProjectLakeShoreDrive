# Workbench shell recipe

Traceability: UX-001, DS-003, DS-009.

## Purpose

`WorkbenchShellRecipeComponent` composes the persistent Lake Shore Drive application frame. It provides named slots for primary navigation, engagement context and switching, global search, a command-palette trigger or palette, notifications, tasks, user menu, page content, and an optional footer. It owns presentation only: consuming features own routes, data, authorization, counts, commands, and menu behavior.

## Usage

```html
<lsd-workbench-shell-recipe id="engagement-workbench" [(navigationOpen)]="navigationOpen">
  <app-primary-navigation lsdWorkbenchNavigation />
  <app-engagement-switcher lsdWorkbenchEngagement />
  <lsd-input lsdWorkbenchSearch label="Search Lake Shore Drive" type="search" />
  <app-command-trigger lsdWorkbenchCommandPalette />
  <app-notification-trigger lsdWorkbenchNotifications />
  <app-task-trigger lsdWorkbenchTasks />
  <app-user-menu lsdWorkbenchUserMenu />
  <app-engagement-phase-nav lsdWorkbenchContext />

  <router-outlet />
</lsd-workbench-shell-recipe>
```

Only public design-system controls and patterns should fill recipe slots. Keep application services and feature components outside the recipe.

## Inputs and state

- `id` is required and creates stable navigation and main-content relationships.
- `navigationLabel`, `navigationTitle`, and `contentLabel` provide accessible names.
- `navigationOpen` is a two-way model for the narrow-screen navigation. The caller may close it after routing; the recipe closes it for its close control, backdrop, and Escape.

The engagement context and footer are optional and collapse when empty. Search, notification, and task loading/error states belong to the projected public components; the shell does not fetch or infer them.

## Responsive behavior

- Desktop (`64rem` and wider): navigation is a persistent 18rem rail and content uses the remaining width.
- Tablet: navigation becomes an off-canvas overlay; the header keeps engagement, search, and global actions available.
- Mobile (below `48rem`): the toolbar wraps search to a full-width row, action controls remain grouped, and content inset becomes compact.
- Reduced-motion preferences remove navigation and skip-link transitions.

Dense feature content must provide its own documented narrow-screen adaptation; the shell does not force desktop tables into the viewport.

## Accessibility

- Navigation and main landmarks have configurable accessible names.
- The menu trigger exposes `aria-controls` and `aria-expanded`; Escape and the labeled backdrop close the narrow navigation.
- A keyboard-visible skip link moves focus to a programmatically focusable main landmark.
- Projected controls retain their native keyboard and announcement behavior. Every icon-only trigger must have an accessible name, and notification/task counts must not rely on color alone.
- DOM order is navigation, header, main, then footer, matching the reading and focus order.

## Do / don't

Do place global, cross-engagement capabilities in the header and engagement-scoped navigation in the context slot. Do use public command-palette, input, button, notification, and navigation APIs.

Don't fetch engagement or account data here, hide unauthorized actions here, persist navigation state here, or place workflow state machines in the recipe. Callers decide what data is safe and authorized to project.

## Visual regression

Capture light and dark desktop shells with persistent navigation, tablet and mobile shells with navigation open and closed, and layouts with and without engagement context. Include focus-visible and reduced-motion runs in the accessibility suite.
