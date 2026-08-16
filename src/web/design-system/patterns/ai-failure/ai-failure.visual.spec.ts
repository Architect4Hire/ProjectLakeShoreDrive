import { AiFailureAction, AiFailureKind, CorrelationCopyState } from './ai-failure.component';

interface AiFailureVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly kind: AiFailureKind;
  readonly detailsOpen: boolean;
  readonly correlationVisible: boolean;
  readonly reportAvailable: boolean;
  readonly processing: AiFailureAction | null;
  readonly copyState: CorrelationCopyState;
}

export const aiFailureVisualCases: readonly AiFailureVisualCase[] = [
  { name: 'recoverable-light', appearance: 'light', viewport: 'desktop', kind: 'recoverable', detailsOpen: false, correlationVisible: false, reportAvailable: false, processing: null, copyState: 'idle' },
  { name: 'recoverable-authorized-details-dark', appearance: 'dark', viewport: 'desktop', kind: 'recoverable', detailsOpen: true, correlationVisible: true, reportAvailable: true, processing: null, copyState: 'copied' },
  { name: 'retrying-mobile-light', appearance: 'light', viewport: 'mobile', kind: 'recoverable', detailsOpen: false, correlationVisible: true, reportAvailable: true, processing: 'retry', copyState: 'idle' },
  { name: 'terminal-mobile-dark', appearance: 'dark', viewport: 'mobile', kind: 'terminal', detailsOpen: false, correlationVisible: false, reportAvailable: true, processing: null, copyState: 'idle' },
  { name: 'terminal-reporting-light', appearance: 'light', viewport: 'desktop', kind: 'terminal', detailsOpen: true, correlationVisible: true, reportAvailable: true, processing: 'report', copyState: 'failed' },
];

describe('AI failure visual coverage', () => {
  it('covers kinds, authorization boundaries, appearances, widths, processing, and copy feedback', () => {
    expect(new Set(aiFailureVisualCases.map((item) => item.kind))).toEqual(new Set(['recoverable', 'terminal']));
    expect(new Set(aiFailureVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(aiFailureVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(aiFailureVisualCases.some((item) => item.detailsOpen && item.correlationVisible)).toBeTrue();
    expect(aiFailureVisualCases.some((item) => !item.correlationVisible)).toBeTrue();
    expect(aiFailureVisualCases.some((item) => item.reportAvailable)).toBeTrue();
    expect(aiFailureVisualCases.some((item) => item.processing !== null)).toBeTrue();
    expect(new Set(aiFailureVisualCases.map((item) => item.copyState))).toEqual(new Set(['idle', 'copied', 'failed']));
  });
});
