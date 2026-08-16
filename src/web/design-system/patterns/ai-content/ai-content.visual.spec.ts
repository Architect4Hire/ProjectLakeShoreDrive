import { AiConfidence, AiContentAction, AiContentState } from './ai-content.component';
import { ReviewProvenance } from '../review-approval/review-approval.component';

interface AiContentVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly state: AiContentState;
  readonly provenance: ReviewProvenance;
  readonly confidence: AiConfidence;
  readonly citations: boolean;
  readonly inspector: boolean;
  readonly processing: AiContentAction | null;
}

export const aiContentVisualCases: readonly AiContentVisualCase[] = [
  { name: 'draft-with-citations-light', appearance: 'light', viewport: 'desktop', state: 'draft', provenance: 'ai-generated', confidence: 'medium', citations: true, inspector: false, processing: null },
  { name: 'generating-dark', appearance: 'dark', viewport: 'desktop', state: 'generating', provenance: 'ai-generated', confidence: 'none', citations: false, inspector: false, processing: null },
  { name: 'suggested-inspector-mobile', appearance: 'light', viewport: 'mobile', state: 'suggested', provenance: 'ai-suggested', confidence: 'low', citations: true, inspector: true, processing: null },
  { name: 'failure-regenerating-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'failed', provenance: 'ai-generated', confidence: 'none', citations: false, inspector: false, processing: 'regenerate' },
  { name: 'human-modified-ready-light', appearance: 'light', viewport: 'desktop', state: 'ready', provenance: 'human-modified-from-ai', confidence: 'high', citations: true, inspector: false, processing: 'accept' },
  { name: 'human-approved-dark', appearance: 'dark', viewport: 'desktop', state: 'ready', provenance: 'human-approved', confidence: 'none', citations: true, inspector: false, processing: null },
];

describe('AI content visual coverage', () => {
  it('covers attribution boundaries, states, appearances, widths, sources, caution, inspector, and processing', () => {
    expect(new Set(aiContentVisualCases.map((item) => item.state))).toEqual(new Set(['draft', 'generating', 'suggested', 'failed', 'ready']));
    expect(new Set(aiContentVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(aiContentVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(aiContentVisualCases.some((item) => item.provenance === 'human-approved')).toBeTrue();
    expect(aiContentVisualCases.some((item) => item.provenance === 'ai-generated')).toBeTrue();
    expect(aiContentVisualCases.some((item) => item.citations && item.inspector)).toBeTrue();
    expect(aiContentVisualCases.some((item) => item.confidence !== 'none')).toBeTrue();
    expect(aiContentVisualCases.some((item) => item.processing !== null)).toBeTrue();
  });
});
