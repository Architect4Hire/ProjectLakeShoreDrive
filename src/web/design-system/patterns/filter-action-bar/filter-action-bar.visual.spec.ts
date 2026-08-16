export const filterActionBarVisualCases = [
  { appearance: 'light', viewport: 'desktop', state: 'dense' },
  { appearance: 'dark', viewport: 'desktop', state: 'active-filters' },
  { appearance: 'light', viewport: 'tablet', state: 'collapsed' },
  { appearance: 'dark', viewport: 'mobile', state: 'expanded' },
  { appearance: 'light', viewport: 'mobile', state: 'actions-wrapped' },
] as const;

describe('filter action bar visual regression cases', () => {
  it('covers appearances, responsive collapse, active count, and wrapped actions', () => {
    expect(new Set(filterActionBarVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(filterActionBarVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(filterActionBarVisualCases.map((item) => item.state))).toEqual(new Set(['dense', 'active-filters', 'collapsed', 'expanded', 'actions-wrapped']));
  });
});
