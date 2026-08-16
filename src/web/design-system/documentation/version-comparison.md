# Version comparison and regeneration

`VersionComparisonComponent` compares two caller-owned document-section versions and exposes a regeneration intent without changing either version. It composes Split View, Surface, Badge, and Button primitives and keeps current, draft, and architect-approved states explicit.

## Typed API

- Required `id`, `title`, `baseVersion`, and `comparedVersion` identify the comparison.
- Each `DocumentVersionPresentation` carries stable `versionId`, display `label`, lifecycle `status`, `authorship`, and optional display-safe `changedBy`, `changedAt`, `promptVersion`, and `sourceCount`.
- `status` is `current`, `draft`, or `approved`. Current is deliberately not synonymous with approved.
- `authorship` is `human`, `ai`, or `human-modified-ai` and remains independent from lifecycle status.
- `regenerateAvailable`, `regenerateDisabled`, and `regenerating` reflect caller-owned workflow state.
- `regenerationRequested` emits only `{ baseVersionId, comparedVersionId }`. It does not generate content, choose context, replace a version, persist history, or grant approval.
- Project versions through `lsdVersionComparisonBase` and `lsdVersionComparisonCompared`; project history detail through `lsdVersionComparisonChanges`, `lsdVersionComparisonSources`, and `lsdVersionComparisonContext`.

```html
<lsd-version-comparison
  id="summary-versions"
  title="Compare architecture summary versions"
  [baseVersion]="currentVersion"
  [comparedVersion]="draftVersion"
  [regenerating]="generationPending()"
  [regenerateDisabled]="!contextReviewed()"
  (regenerationRequested)="requestRegeneration($event)">
  <article lsdVersionComparisonBase><!-- current or approved content --></article>
  <article lsdVersionComparisonCompared><!-- AI draft content --></article>
  <p lsdVersionComparisonChanges><!-- caller-owned change summary --></p>
  <div lsdVersionComparisonSources><!-- CitationChip composition --></div>
  <p lsdVersionComparisonContext><!-- authorized prompt/context metadata --></p>
</lsd-version-comparison>
```

## State distinctions

Current versions use neutral treatment, AI drafts use the dashed AI-draft surface and visible “not approved” language, and approved versions use the approved semantic surface. Any comparison containing a draft gains an additional persistent AI boundary. Authorship badges remain visible independently so a human-modified AI draft does not masquerade as human-authored or approved content.

Regeneration is an intent based on stable version IDs. Before enabling it, application code should let the architect inspect or modify generation context as required by UX-DOC-003. The resulting content should enter history as a new draft rather than overwriting either displayed version.

## Accessibility

The comparison is a named region. Split View provides two named version regions, stable DOM order, and keyboard-operable focused-pane switching at compact widths. Lifecycle, authorship, and non-approval distinctions use visible text as well as color and borders. Generation history uses native disclosure semantics. Regeneration uses the Button primitive's disabled, loading, focus, and polite status behavior.

## Responsive behavior

Versions display side by side on desktop. Below 48rem Split View shows one version at a time with labeled controls and focus transfer. History columns collapse into logical order, headers/actions stack, and metadata labels stack below 30rem.

## Do / don't

Do retain stable version IDs, preserve immutable history, distinguish current from approved, expose sources and prompt version, and create a new draft after regeneration. Do not overwrite an approved version, infer approval from “current,” enable regeneration before required context review, hide AI authorship after human edits, or implement model, retrieval, persistence, authorization, or audit logic here.

## Visual coverage

`version-comparison.visual.spec.ts` covers current/draft/approved lifecycle states, every authorship category, light/dark appearance, desktop/mobile widths, open history, and regeneration processing.
