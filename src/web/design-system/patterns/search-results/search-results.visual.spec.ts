import { SearchQueryState } from './search-results.component';

interface SearchResultsVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly state: SearchQueryState;
  readonly facetsExpanded?: boolean;
  readonly detailsOpen?: boolean;
}

export const searchResultsVisualCases: readonly SearchResultsVisualCase[] = [
  { name: 'idle-light-desktop', appearance: 'light', viewport: 'desktop', state: 'idle' },
  { name: 'loading-dark-desktop', appearance: 'dark', viewport: 'desktop', state: 'loading' },
  { name: 'results-light-desktop', appearance: 'light', viewport: 'desktop', state: 'ready', detailsOpen: true },
  { name: 'facets-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'ready', facetsExpanded: true },
  { name: 'empty-light-mobile', appearance: 'light', viewport: 'mobile', state: 'ready' },
  { name: 'error-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'error' },
];

describe('search results visual coverage', () => {
  it('covers query states, facets, details, appearances, and responsive widths', () => {
    expect(new Set(searchResultsVisualCases.map((item) => item.state)).size).toBe(4);
    expect(searchResultsVisualCases.some((item) => item.facetsExpanded)).toBeTrue();
    expect(searchResultsVisualCases.some((item) => item.detailsOpen)).toBeTrue();
    expect(new Set(searchResultsVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(searchResultsVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
  });
});
