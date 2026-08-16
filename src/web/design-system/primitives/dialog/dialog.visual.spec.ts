import { DialogSize } from './dialog.component';

/** Deterministic critical states consumed by the visual-regression harness once configured. */
export const dialogVisualCases: ReadonlyArray<{
  name: string;
  appearance: 'light' | 'dark';
  viewport: 'mobile' | 'desktop';
  size: DialogSize;
}> = [
  { name: 'default-light-desktop', appearance: 'light', viewport: 'desktop', size: 'medium' },
  { name: 'default-dark-desktop', appearance: 'dark', viewport: 'desktop', size: 'medium' },
  { name: 'large-light-mobile', appearance: 'light', viewport: 'mobile', size: 'large' },
  { name: 'large-dark-mobile', appearance: 'dark', viewport: 'mobile', size: 'large' },
];

describe('dialog visual regression cases', () => {
  it('covers both appearances and responsive critical states', () => {
    expect(new Set(dialogVisualCases.map((testCase) => testCase.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(dialogVisualCases.map((testCase) => testCase.viewport))).toEqual(new Set(['mobile', 'desktop']));
  });
});
