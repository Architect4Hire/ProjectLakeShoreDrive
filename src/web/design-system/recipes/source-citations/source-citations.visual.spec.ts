import type { SourcePreviewState } from '../../patterns';
interface SourceCitationsVisualCase { readonly name: string; readonly appearance: 'light' | 'dark'; readonly viewport: 'desktop' | 'mobile'; readonly count: 'none' | 'one' | 'many'; readonly preview: 'closed' | SourcePreviewState; }
export const sourceCitationsVisualCases: readonly SourceCitationsVisualCase[] = [
  { name: 'many-light-desktop', appearance: 'light', viewport: 'desktop', count: 'many', preview: 'closed' },
  { name: 'ready-dark-desktop', appearance: 'dark', viewport: 'desktop', count: 'many', preview: 'ready' },
  { name: 'loading-light-desktop', appearance: 'light', viewport: 'desktop', count: 'one', preview: 'loading' },
  { name: 'failed-dark-mobile', appearance: 'dark', viewport: 'mobile', count: 'one', preview: 'failed' },
  { name: 'unavailable-light-mobile', appearance: 'light', viewport: 'mobile', count: 'many', preview: 'unavailable' },
  { name: 'empty-dark-mobile', appearance: 'dark', viewport: 'mobile', count: 'none', preview: 'closed' },
];
describe('source citations visual coverage', () => {
  it('covers appearance, widths, collection density, and preview states', () => {
    expect(new Set(sourceCitationsVisualCases.map(x => x.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(sourceCitationsVisualCases.map(x => x.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(sourceCitationsVisualCases.map(x => x.count))).toEqual(new Set(['none', 'one', 'many']));
    expect(new Set(sourceCitationsVisualCases.map(x => x.preview))).toEqual(new Set(['closed', 'ready', 'loading', 'failed', 'unavailable']));
  });
});
