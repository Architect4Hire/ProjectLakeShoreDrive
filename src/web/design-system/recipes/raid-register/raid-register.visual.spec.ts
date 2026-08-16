import type { RaidItemType } from './raid-register.component';
interface RaidRegisterVisualCase { readonly name: string; readonly appearance: 'light' | 'dark'; readonly viewport: 'desktop' | 'tablet' | 'mobile'; readonly state: 'populated' | 'empty' | 'loading' | 'error'; readonly emphasizedType: RaidItemType; }
export const raidRegisterVisualCases: readonly RaidRegisterVisualCase[] = [
  { name: 'populated-light-desktop', appearance: 'light', viewport: 'desktop', state: 'populated', emphasizedType: 'risk' },
  { name: 'dense-dark-desktop', appearance: 'dark', viewport: 'desktop', state: 'populated', emphasizedType: 'assumption' },
  { name: 'loading-light-tablet', appearance: 'light', viewport: 'tablet', state: 'loading', emphasizedType: 'issue' },
  { name: 'error-dark-tablet', appearance: 'dark', viewport: 'tablet', state: 'error', emphasizedType: 'dependency' },
  { name: 'cards-light-mobile', appearance: 'light', viewport: 'mobile', state: 'populated', emphasizedType: 'issue' },
  { name: 'empty-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'empty', emphasizedType: 'risk' },
];
describe('RAID register visual coverage', () => {
  it('covers appearance, widths, states, and all RAID types', () => {
    expect(new Set(raidRegisterVisualCases.map(x => x.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(raidRegisterVisualCases.map(x => x.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(raidRegisterVisualCases.map(x => x.state))).toEqual(new Set(['populated', 'empty', 'loading', 'error']));
    expect(new Set(raidRegisterVisualCases.map(x => x.emphasizedType))).toEqual(new Set(['risk', 'assumption', 'issue', 'dependency']));
  });
});
