interface MasterDetailVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly view: 'master' | 'detail';
  readonly detailAvailable: boolean;
}

export const masterDetailVisualCases: readonly MasterDetailVisualCase[] = [
  { name: 'split-light-desktop', appearance: 'light', viewport: 'desktop', view: 'master', detailAvailable: true },
  { name: 'split-dark-desktop', appearance: 'dark', viewport: 'desktop', view: 'detail', detailAvailable: true },
  { name: 'master-light-tablet', appearance: 'light', viewport: 'tablet', view: 'master', detailAvailable: true },
  { name: 'detail-dark-mobile', appearance: 'dark', viewport: 'mobile', view: 'detail', detailAvailable: true },
  { name: 'placeholder-light-mobile', appearance: 'light', viewport: 'mobile', view: 'detail', detailAvailable: false },
];

describe('master/detail visual coverage', () => {
  it('covers split, focused, empty-detail, appearance, and responsive states', () => {
    expect(new Set(masterDetailVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(masterDetailVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(masterDetailVisualCases.map((item) => item.view))).toEqual(new Set(['master', 'detail']));
    expect(masterDetailVisualCases.some((item) => !item.detailAvailable)).toBeTrue();
  });
});
