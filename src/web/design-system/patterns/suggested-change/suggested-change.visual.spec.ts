import { SuggestedChangeLayout, SuggestedChangeProcessing, SuggestedChangeProvenance, SuggestedChangeState } from './suggested-change.component';

interface SuggestedChangeVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly layout: SuggestedChangeLayout;
  readonly provenance: SuggestedChangeProvenance;
  readonly state: SuggestedChangeState;
  readonly processing: SuggestedChangeProcessing | null;
  readonly contextOpen: boolean;
}

export const suggestedChangeVisualCases: readonly SuggestedChangeVisualCase[] = [
  { name: 'comparison-pending-light', appearance: 'light', viewport: 'desktop', layout: 'comparison', provenance: 'ai-suggested', state: 'pending', processing: null, contextOpen: false },
  { name: 'proposal-only-generated-dark', appearance: 'dark', viewport: 'desktop', layout: 'proposal-only', provenance: 'ai-generated', state: 'pending', processing: null, contextOpen: true },
  { name: 'comparison-accepting-mobile', appearance: 'light', viewport: 'mobile', layout: 'comparison', provenance: 'human-modified-from-ai', state: 'pending', processing: 'accept', contextOpen: false },
  { name: 'proposal-rejecting-dark-mobile', appearance: 'dark', viewport: 'mobile', layout: 'proposal-only', provenance: 'ai-suggested', state: 'pending', processing: 'reject', contextOpen: true },
  { name: 'accepted-light', appearance: 'light', viewport: 'desktop', layout: 'comparison', provenance: 'ai-suggested', state: 'accepted', processing: null, contextOpen: false },
  { name: 'rejected-dark', appearance: 'dark', viewport: 'desktop', layout: 'comparison', provenance: 'ai-generated', state: 'rejected', processing: null, contextOpen: false },
];

describe('suggested change visual coverage', () => {
  it('covers layouts, provenance, decisions, processing, disclosure, appearances, and widths', () => {
    expect(new Set(suggestedChangeVisualCases.map((item) => item.layout))).toEqual(new Set(['comparison', 'proposal-only']));
    expect(new Set(suggestedChangeVisualCases.map((item) => item.provenance))).toEqual(new Set(['ai-suggested', 'ai-generated', 'human-modified-from-ai']));
    expect(new Set(suggestedChangeVisualCases.map((item) => item.state))).toEqual(new Set(['pending', 'accepted', 'rejected']));
    expect(new Set(suggestedChangeVisualCases.map((item) => item.processing).filter(Boolean))).toEqual(new Set(['accept', 'reject']));
    expect(new Set(suggestedChangeVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(suggestedChangeVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(suggestedChangeVisualCases.some((item) => item.contextOpen)).toBeTrue();
  });
});
