import { DrawerPlacement, DrawerSize } from './drawer.component';

/** Critical states consumed by the workspace visual-regression harness once configured. */
export const drawerVisualCases: ReadonlyArray<{
  name: string;
  appearance: 'light' | 'dark';
  viewport: 'mobile' | 'desktop';
  placement: DrawerPlacement;
  size: DrawerSize;
}> = [
  { name: 'source-preview-light-end', appearance: 'light', viewport: 'desktop', placement: 'end', size: 'default' },
  { name: 'source-preview-dark-start', appearance: 'dark', viewport: 'desktop', placement: 'start', size: 'wide' },
  { name: 'generating-light-mobile', appearance: 'light', viewport: 'mobile', placement: 'end', size: 'default' },
  { name: 'generating-dark-mobile', appearance: 'dark', viewport: 'mobile', placement: 'end', size: 'default' },
];

describe('drawer visual regression cases', () => {
  it('covers appearances, responsive widths, and logical placements', () => {
    expect(new Set(drawerVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(drawerVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(drawerVisualCases.map((item) => item.placement))).toEqual(new Set(['end', 'start']));
  });
});
