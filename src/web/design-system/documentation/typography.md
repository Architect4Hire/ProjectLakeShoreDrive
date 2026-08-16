# Typography

Typography uses system font stacks and rem-based sizing so browser text-size
preferences remain effective. Primitive scales and semantic role mappings are
defined in `tokens/typography.ts`; global native-element and `data-text-role`
styles are defined in `foundations/typography.css`.

Representative roles are `heading-page`, `heading-section`,
`heading-subsection`, `body`, `label`, `metadata`, `code`, and
`document-prose`.

Interface roles favor compact, legible metrics for dense workbench screens.
Document prose uses a reading-oriented serif stack and a 1.75rem line height.
Code uses a system monospace stack. These roles are business-neutral and must
not be replaced with page-specific typography classes.

The Angular workspace must include `foundations/typography.css` once its
global style entry point exists. The current repository has no build
configuration, so the foundation is not yet wired into an application.
