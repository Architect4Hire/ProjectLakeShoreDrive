# Project Lake Shore Drive — Angular 22 and Design System Architecture

## Angular baseline

The web client uses Angular 22 with:

- standalone components/directives/pipes;
- route-level lazy loading;
- Signals for local/view state;
- computed state for derivation;
- RxJS for naturally asynchronous streams;
- strict TypeScript;
- typed APIs;
- built-in control flow;
- zoneless-compatible / OnPush-friendly patterns;
- accessible semantic HTML.

Do not introduce React conventions, hooks, Redux or JSX vocabulary.

## Feature routes

```text
/engagements
/engagements/:id/overview
/engagements/:id/discovery
/engagements/:id/requirements
/engagements/:id/architecture
/engagements/:id/adrs
/engagements/:id/raid
/engagements/:id/estimates
/engagements/:id/documents
/engagements/:id/ai
/knowledge
/patterns
/templates
/admin
```

## Design-system location

The authoritative local design system lives under:

```text
src/web/design-system/
```

Recommended layers:

```text
tokens/
foundations/
primitives/
components/
patterns/
recipes/
layouts/
icons/
utilities/
documentation/
```

## Boundary rule

Tailwind implements design-system primitives and recipes.

Feature components consume semantic components/recipes instead of repeating large class strings.

Repeated feature styling is a design-system defect.

## Required semantic UI

Core primitives/components:

- button, input, select, checkbox;
- badge/status;
- surface/card;
- tabs;
- dialog/drawer;
- tooltip;
- data table;
- file picker;
- command palette;
- loading/empty/error states.

Lake Shore Drive recipes:

- workbench shell;
- engagement header;
- phase rail;
- requirement matrix row;
- ADR card;
- RAID register;
- source citation panel;
- document section editor;
- approval bar;
- AI generation drawer;
- architecture comparison;
- knowledge result card.

## AI-specific UX rule

AI content must never visually masquerade as approved architect content.

Standard patterns include:

- AI Draft badge;
- generating state;
- suggested-change state;
- Accept / Reject;
- citation chip;
- source preview;
- regenerate action;
- version comparison;
- prompt/context inspector for authorized users;
- AI failure state.

## State patterns

- Component-local state: signals.
- Derived UI state: `computed()`.
- Side effects: `effect()` only when truly needed.
- HTTP/domain data: typed services/facades, converted to signals deliberately where helpful.
- Complex editor forms: typed reactive or Angular 22 signal-form patterns where mature and practical.
- Cross-feature state: explicit application service/store only when ownership is clear.

## Accessibility

Target WCAG 2.2 AA:

- keyboard operation;
- visible focus;
- semantic labels;
- error association;
- live status announcements;
- contrast;
- reduced motion;
- responsive alternatives for dense matrices.
