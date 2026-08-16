import type { AdrProvenance } from './adr-summary.component';
interface AdrSummaryVisualCase { readonly name: string; readonly appearance: 'light' | 'dark'; readonly viewport: 'desktop' | 'tablet' | 'mobile'; readonly provenance: AdrProvenance; readonly links: 'many' | 'none'; readonly actions: boolean; }
export const adrSummaryVisualCases: readonly AdrSummaryVisualCase[] = [
  { name: 'human-approved-light-desktop', appearance: 'light', viewport: 'desktop', provenance: 'human-approved', links: 'many', actions: true },
  { name: 'ai-generated-dark-desktop', appearance: 'dark', viewport: 'desktop', provenance: 'ai-generated', links: 'many', actions: true },
  { name: 'ai-suggested-light-tablet', appearance: 'light', viewport: 'tablet', provenance: 'ai-suggested', links: 'none', actions: true },
  { name: 'human-modified-dark-tablet', appearance: 'dark', viewport: 'tablet', provenance: 'human-modified-from-ai', links: 'many', actions: false },
  { name: 'human-authored-light-mobile', appearance: 'light', viewport: 'mobile', provenance: 'human-authored', links: 'none', actions: false },
  { name: 'long-ai-draft-dark-mobile', appearance: 'dark', viewport: 'mobile', provenance: 'ai-generated', links: 'many', actions: true },
];
describe('ADR summary visual coverage', () => {
  it('covers appearance, widths, provenance, links, and actions', () => {
    expect(new Set(adrSummaryVisualCases.map(x => x.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(adrSummaryVisualCases.map(x => x.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(adrSummaryVisualCases.map(x => x.provenance))).toEqual(new Set(['human-authored', 'ai-suggested', 'ai-generated', 'human-modified-from-ai', 'human-approved']));
    expect(new Set(adrSummaryVisualCases.map(x => x.links))).toEqual(new Set(['many', 'none']));
    expect(new Set(adrSummaryVisualCases.map(x => x.actions))).toEqual(new Set([true, false]));
  });
});
