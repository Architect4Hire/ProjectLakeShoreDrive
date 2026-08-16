export const stepperVisualCases = [
  { name: 'light-progress', appearance: 'light', viewport: 'desktop', state: 'mixed' },
  { name: 'dark-progress', appearance: 'dark', viewport: 'desktop', state: 'mixed' },
  { name: 'light-overflow', appearance: 'light', viewport: 'mobile', state: 'overflow' },
  { name: 'dark-error-disabled', appearance: 'dark', viewport: 'mobile', state: 'error-disabled' },
] as const;

describe('stepper visual regression cases', () => {
  it('covers appearances, responsive overflow, and critical states', () => {
    expect(new Set(stepperVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(stepperVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(stepperVisualCases.map((item) => item.state))).toEqual(new Set(['mixed', 'overflow', 'error-disabled']));
  });
});
