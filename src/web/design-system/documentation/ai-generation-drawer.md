# AI generation drawer recipe

Traceability: DS-003, DS-013, DS-014, UX-DOC-002, UX-DOC-003.

## Purpose and usage

`AiGenerationDrawerComponent` composes the public drawer, generation-progress, AI-content, badge, and surface APIs into a section-generation workspace. Supply an immutable `AiGenerationDrawerViewModel`, caller-owned `open` state, and projected context, sources, result, and review controls.

```html
<lsd-ai-generation-drawer id="section-generation" [model]="generation" [open]="open"
  (cancelRequested)="cancel()" (accepted)="accept()" (rejected)="reject()"
  (regenerateRequested)="regenerate()" (closeRequested)="close()">
  <lsd-button lsdAiGenerationContextActions>Edit context</lsd-button>
  <lsd-source-citations lsdAiGenerationSources ... />
  <article lsdAiGenerationResult>{{ generatedDraft }}</article>
</lsd-ai-generation-drawer>
```

## Contract and states

The model contains operation, target, selected-context counts, generation state, progress presentation, announcement, and GOV-002 provenance. States are generating, cancelling, cancelled, completed, and failed. All outputs are intents only; callers own retrieval, generation, cancellation, selection, review decisions, authorization, persistence, and transitions.

Generated results always retain AI-draft and “Not approved” treatment until the caller supplies genuinely human-approved provenance. Sources should use the public source-citations recipe. Context action visibility must be decided by authorized application code.

## Responsive behavior and accessibility

The wide drawer occupies available mobile width. Sections stack, context counts wrap, and the operation header becomes a grid below `30rem`. The public drawer traps/restores focus and supports Escape; progress announces sparse milestones and honors reduced motion; context is a named region; provenance and approval state use visible text rather than color.

## Do / don't

Do show selected context before generation, pass display-safe sources, and keep approved content unchanged until review. Don't call models, retrieve sources, infer permissions, mutate documents, or implement workflow state in this recipe.

## Visual regression

Capture light/dark desktop and mobile drawers for every generation state, determinate/indeterminate progress, empty/many context sources, long results, failed generation, disabled review actions, and keyboard focus.
