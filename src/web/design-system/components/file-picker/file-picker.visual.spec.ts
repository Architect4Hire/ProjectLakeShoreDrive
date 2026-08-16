export const filePickerVisualCases = [
  { appearance: 'light', viewport: 'desktop', state: 'idle' },
  { appearance: 'dark', viewport: 'desktop', state: 'dragging' },
  { appearance: 'light', viewport: 'mobile', state: 'validation-error' },
  { appearance: 'dark', viewport: 'mobile', state: 'progress' },
  { appearance: 'light', viewport: 'desktop', state: 'transport-error' },
  { appearance: 'dark', viewport: 'desktop', state: 'disabled' },
] as const;
describe('file picker visual regression cases', () => {
  it('covers appearances, responsive layouts, and critical states', () => {
    expect(new Set(filePickerVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(filePickerVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(filePickerVisualCases.map((item) => item.state))).toEqual(new Set(['idle', 'dragging', 'validation-error', 'progress', 'transport-error', 'disabled']));
  });
});
