export const structuredEditorVisualCases = [
  { appearance: 'light', viewport: 'desktop', state: 'saved' },
  { appearance: 'dark', viewport: 'desktop', state: 'dirty' },
  { appearance: 'light', viewport: 'desktop', state: 'saving-split' },
  { appearance: 'dark', viewport: 'mobile', state: 'canvas' },
  { appearance: 'light', viewport: 'mobile', state: 'context' },
  { appearance: 'dark', viewport: 'desktop', state: 'save-error' },
] as const;
describe('structured editor visual regression cases', () => {
  it('covers appearances, responsive split modes, and save states', () => {
    expect(new Set(structuredEditorVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(structuredEditorVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(structuredEditorVisualCases.map((item) => item.state))).toEqual(new Set(['saved', 'dirty', 'saving-split', 'canvas', 'context', 'save-error']));
  });
});
