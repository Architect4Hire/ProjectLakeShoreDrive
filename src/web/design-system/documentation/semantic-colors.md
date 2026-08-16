# Semantic color tokens

The public semantic color contract is defined in
`tokens/semantic-colors.ts`. It maps intent-based names to private primitive
palette values for both light and dark appearances.

Application features may depend on semantic token names. They must not import
raw palette scales or assume which raw color currently resolves a token.

AI-generated content uses the `ai-draft-*` family until approval. Approved
content uses the separate `ai-approved-*` family. Each state has surface,
text, border, and accent tokens so the distinction does not depend on one
color cue or on feature-specific styling.

Filled accent and status controls use the corresponding `text-on-*` token.
These foreground roles preserve contrast across appearances without exposing
or inferring palette steps in component code.

The private palette mapping is applied as semantic `--lsd-color-*` variables by
the appearance foundation. Raw values are not part of the public import API.
Tailwind integration remains a separate implementation step.
