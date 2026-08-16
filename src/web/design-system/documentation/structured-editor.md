# Structured editor shell

`StructuredEditorComponent<T>` lays out an ordered, section-backed editor without owning document content, AI behavior, persistence, or feature records. Typed templates bind presentation to caller-provided section identities.

## API and composition

- Required: stable `id`, `accessibleName`, and ordered typed `sections`.
- Supply one `ng-template[lsdEditorSectionContent]` per identity. Its context exposes the typed identity, zero-based index, and section count.
- Optional `ng-template[lsdEditorSectionActions]` provides caller-owned actions for a matching section.
- Project shared tools with `lsdEditorToolbar`, document actions with `lsdEditorActions`, and inspectable sources/context with `lsdEditorContext`.
- `saveState` supports `saved`, `dirty`, `saving`, and `error`; `saveError` supplies specific failure text.
- Enable the two-way `splitViewOpen` contract with `splitViewAvailable`.

## UX-DOC behavior and accessibility

Sections render in a semantic ordered list as individually labeled articles. Toolbars and action groups have accessible names, while projected controls retain native/design-system keyboard behavior. Save state is announced politely; save failure uses alert semantics. The context disclosure uses a native button with `aria-controls` and `aria-expanded`, moves focus to opened context, and restores focus to the toggle when closed.

Section actions are deliberately caller-owned: edit, generate, regenerate, add evidence, inspect sources, compare, or approve can be composed without teaching this shell domain or AI rules. The context pane supports UX-DOC-003 inspection and modification interfaces but does not decide what context is selected.

## Responsive split view

Desktop displays the ordered canvas and optional context pane side by side. Below the tablet breakpoint, opening context switches from canvas to context so neither editing surface becomes unusably narrow. Toolbar and section actions wrap, and the sticky desktop toolbar becomes static on constrained layouts.

## Do / don't

Do use stable identities, retain structured section data outside templates, and keep persistence state authoritative in the caller. Do not store generated prose only in projected DOM, hard-code AI actions in the shell, or treat visual dirty state as a substitute for recoverable drafts.

## Appearance, motion, and visual coverage

The shell uses semantic surfaces, borders, text, focus, and sticky-layer foundations in both appearances. Saving remains understandable as text when reduced motion disables the spinner. `structured-editor.visual.spec.ts` defines saved, dirty, saving, error, canvas, context, split, mobile, desktop, light, and dark critical states for the workspace visual runner.
