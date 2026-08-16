import { ReviewDecision, ReviewProcessingAction, ReviewProvenance } from './review-approval.component';

interface ReviewApprovalVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly provenance: ReviewProvenance;
  readonly decision: ReviewDecision;
  readonly processing: ReviewProcessingAction | null;
}

export const reviewApprovalVisualCases: readonly ReviewApprovalVisualCase[] = [
  { name: 'ai-suggested-pending-light', appearance: 'light', viewport: 'desktop', provenance: 'ai-suggested', decision: 'pending', processing: null },
  { name: 'ai-generated-approving-dark', appearance: 'dark', viewport: 'desktop', provenance: 'ai-generated', decision: 'pending', processing: 'approve' },
  { name: 'human-modified-rejecting-mobile', appearance: 'light', viewport: 'mobile', provenance: 'human-modified-from-ai', decision: 'pending', processing: 'reject' },
  { name: 'human-approved-dark-mobile', appearance: 'dark', viewport: 'mobile', provenance: 'human-approved', decision: 'approved', processing: null },
  { name: 'human-authored-rejected-light', appearance: 'light', viewport: 'desktop', provenance: 'human-authored', decision: 'rejected', processing: null },
];

describe('review/approval visual coverage', () => {
  it('covers every provenance, decision outcomes, processing actions, appearances, and widths', () => {
    expect(new Set(reviewApprovalVisualCases.map((item) => item.provenance)).size).toBe(5);
    expect(new Set(reviewApprovalVisualCases.map((item) => item.decision))).toEqual(new Set(['pending', 'approved', 'rejected']));
    expect(new Set(reviewApprovalVisualCases.map((item) => item.processing).filter(Boolean))).toEqual(new Set(['approve', 'reject']));
    expect(new Set(reviewApprovalVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(reviewApprovalVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
  });
});
