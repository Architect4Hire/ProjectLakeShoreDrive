import { DocumentVersionAuthorship, DocumentVersionStatus } from './version-comparison.component';

interface VersionComparisonVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly baseStatus: DocumentVersionStatus;
  readonly comparedStatus: DocumentVersionStatus;
  readonly comparedAuthorship: DocumentVersionAuthorship;
  readonly historyOpen: boolean;
  readonly regenerating: boolean;
}

export const versionComparisonVisualCases: readonly VersionComparisonVisualCase[] = [
  { name: 'approved-to-ai-draft-light', appearance: 'light', viewport: 'desktop', baseStatus: 'approved', comparedStatus: 'draft', comparedAuthorship: 'ai', historyOpen: false, regenerating: false },
  { name: 'current-to-human-modified-dark', appearance: 'dark', viewport: 'desktop', baseStatus: 'current', comparedStatus: 'draft', comparedAuthorship: 'human-modified-ai', historyOpen: true, regenerating: false },
  { name: 'draft-regenerating-mobile', appearance: 'light', viewport: 'mobile', baseStatus: 'current', comparedStatus: 'draft', comparedAuthorship: 'ai', historyOpen: false, regenerating: true },
  { name: 'approved-versions-dark-mobile', appearance: 'dark', viewport: 'mobile', baseStatus: 'approved', comparedStatus: 'approved', comparedAuthorship: 'human', historyOpen: true, regenerating: false },
];

describe('version comparison visual coverage', () => {
  it('covers lifecycle distinctions, authorship, appearances, widths, history, and regeneration', () => {
    const statuses = versionComparisonVisualCases.flatMap((item) => [item.baseStatus, item.comparedStatus]);
    expect(new Set(statuses)).toEqual(new Set(['current', 'draft', 'approved']));
    expect(new Set(versionComparisonVisualCases.map((item) => item.comparedAuthorship))).toEqual(new Set(['ai', 'human-modified-ai', 'human']));
    expect(new Set(versionComparisonVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(versionComparisonVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(versionComparisonVisualCases.some((item) => item.historyOpen)).toBeTrue();
    expect(versionComparisonVisualCases.some((item) => item.regenerating)).toBeTrue();
  });
});
