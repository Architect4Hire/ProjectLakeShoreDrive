interface WorkbenchShellVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly navigation: 'persistent' | 'closed' | 'open';
  readonly context: 'present' | 'absent';
}

export const workbenchShellVisualCases: readonly WorkbenchShellVisualCase[] = [
  { name: 'desktop-light-persistent', appearance: 'light', viewport: 'desktop', navigation: 'persistent', context: 'present' },
  { name: 'desktop-dark-persistent', appearance: 'dark', viewport: 'desktop', navigation: 'persistent', context: 'absent' },
  { name: 'tablet-light-closed', appearance: 'light', viewport: 'tablet', navigation: 'closed', context: 'present' },
  { name: 'tablet-dark-open', appearance: 'dark', viewport: 'tablet', navigation: 'open', context: 'present' },
  { name: 'mobile-light-closed', appearance: 'light', viewport: 'mobile', navigation: 'closed', context: 'absent' },
  { name: 'mobile-dark-open', appearance: 'dark', viewport: 'mobile', navigation: 'open', context: 'present' },
];

describe('workbench shell visual coverage', () => {
  it('covers appearance, responsive navigation, and optional context states', () => {
    expect(new Set(workbenchShellVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(workbenchShellVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(workbenchShellVisualCases.map((item) => item.navigation))).toEqual(new Set(['persistent', 'closed', 'open']));
    expect(new Set(workbenchShellVisualCases.map((item) => item.context))).toEqual(new Set(['present', 'absent']));
  });
});
