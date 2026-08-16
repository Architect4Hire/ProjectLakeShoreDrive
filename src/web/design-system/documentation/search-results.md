# Search results pattern

`SearchResultsComponent<T>` standardizes query controls, facet disclosure, result counts and metadata, keyboard navigation, deeper result evidence, and non-result states. It composes Filter Action Bar, Surface, and State Feedback rather than owning search execution or feature records.

## Typed API and composition

- Required: stable `id` and typed `results`; optional `accessibleName`.
- `state` is `idle`, `loading`, `ready`, or `error`; `query` and optional `totalResults` describe caller-owned query state.
- Each `SearchResultItem<T>` provides identity, title, optional description, concise label/value metadata, and an optional details flag.
- Project a public search control through `lsdSearchQuery`, facets through `lsdSearchFacets`, and persistent actions through `lsdSearchActions`. The composed Filter Action Bar owns responsive facet disclosure and active-filter count.
- Use typed `lsdSearchResultContent` and `lsdSearchResultDetails` templates for result-specific actions/content and progressively disclosed evidence.
- Project recovery controls through `lsdSearchEmptyActions` or `lsdSearchErrorActions`.
- `resultFocused` and `resultActivated` emit typed identities; search, routing, pagination, and selection remain caller-owned.

```html
<lsd-search-results
  id="library-search"
  [query]="query()"
  [state]="searchState()"
  [results]="results()"
  [totalResults]="total()"
  (resultActivated)="open($event)">
  <lsd-input lsdSearchQuery label="Search" />
  <div lsdSearchFacets><!-- public filter controls --></div>
  <ng-template lsdSearchResultContent let-result><!-- actions/preview --></ng-template>
  <ng-template lsdSearchResultDetails let-result><!-- evidence/provenance --></ng-template>
</lsd-search-results>
```

## Accessibility and keyboard interaction

Results are an ordered list of named articles. One result is in the roving tab sequence. When focus is on the article, Arrow Up/Down wraps through results, Home/End jump to boundaries, and Enter emits activation. Key events originating inside projected links or controls are not intercepted, preserving native interaction. Query summaries and loading state use polite status announcements; errors use the standard recoverable-error behavior. Native details keep deeper metadata collapsed and keyboard accessible.

## Responsive behavior

The composed Filter Action Bar keeps query/actions visible and progressively discloses facets below 48rem. Result surfaces remain single-column at all widths. Below 30rem, metadata changes from inline pairs to stacked label/value groups, and long content wraps without horizontal overflow.

## Do / don't

Do retain query/filter state in the feature, provide stable identities and concise metadata, expose recovery actions, and place evidence/provenance in details. Do not execute searches, import feature models/services, render raw backend errors, replace native link behavior, intercept keys from projected controls, hide frequently used search actions with facets, or place decision-critical information only in collapsed details.

## Appearance and visual coverage

Controls, surfaces, metadata, statuses, borders, and focus use semantic design-system APIs in both appearances. `search-results.visual.spec.ts` defines idle/loading/results/empty/error states, expanded facets/details, and desktop/mobile coverage for the workspace visual runner.
