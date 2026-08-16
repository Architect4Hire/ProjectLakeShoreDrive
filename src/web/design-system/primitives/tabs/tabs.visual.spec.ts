export const tabsVisualCases = [
  { name: 'light-default', appearance: 'light', viewport: 'desktop', state: 'selected' },
  { name: 'dark-default', appearance: 'dark', viewport: 'desktop', state: 'selected' },
  { name: 'light-overflow', appearance: 'light', viewport: 'mobile', state: 'overflow' },
  { name: 'dark-disabled', appearance: 'dark', viewport: 'mobile', state: 'disabled' },
] as const;

describe('tabs visual regression cases', () => {
  it('covers appearances, responsive overflow, selection, and disabled state', () => {
    expect(new Set(tabsVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(tabsVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(tabsVisualCases.map((item) => item.state))).toEqual(new Set(['selected', 'overflow', 'disabled']));
  });
});
