export const commandPaletteVisualCases = [
  { appearance: 'light', viewport: 'desktop', state: 'grouped' },
  { appearance: 'dark', viewport: 'desktop', state: 'active-command' },
  { appearance: 'light', viewport: 'mobile', state: 'filtered' },
  { appearance: 'dark', viewport: 'mobile', state: 'empty' },
  { appearance: 'light', viewport: 'desktop', state: 'disabled-command' },
] as const;
describe('command palette visual regression cases', () => {
  it('covers appearances, responsive layouts, and critical states', () => {
    expect(new Set(commandPaletteVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(commandPaletteVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(commandPaletteVisualCases.map((item) => item.state))).toEqual(new Set(['grouped', 'active-command', 'filtered', 'empty', 'disabled-command']));
  });
});
