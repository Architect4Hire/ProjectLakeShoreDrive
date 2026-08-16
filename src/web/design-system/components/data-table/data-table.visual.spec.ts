export const dataTableVisualCases = [
  { appearance: 'light', viewport: 'desktop', state: 'populated' },
  { appearance: 'dark', viewport: 'desktop', state: 'loading' },
  { appearance: 'light', viewport: 'mobile', state: 'cards' },
  { appearance: 'dark', viewport: 'mobile', state: 'empty' },
  { appearance: 'light', viewport: 'desktop', state: 'error' },
  { appearance: 'dark', viewport: 'desktop', state: 'disabled-action' },
] as const;
describe('data table visual regression cases', () => {
  it('covers appearances, responsive modes, and critical states', () => {
    expect(new Set(dataTableVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(dataTableVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(dataTableVisualCases.map((item) => item.state))).toEqual(new Set(['populated', 'loading', 'cards', 'empty', 'error', 'disabled-action']));
  });
});
