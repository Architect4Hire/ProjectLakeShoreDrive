import { StateFeedbackKind } from './state-feedback.component';

interface StateFeedbackVisualCase {
  readonly name: string;
  readonly kind: StateFeedbackKind;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly detailsOpen?: boolean;
}

export const stateFeedbackVisualCases: readonly StateFeedbackVisualCase[] = [
  { name: 'empty-light-desktop', kind: 'empty', appearance: 'light', viewport: 'desktop' },
  { name: 'loading-dark-desktop', kind: 'loading', appearance: 'dark', viewport: 'desktop' },
  { name: 'skeleton-light-mobile', kind: 'skeleton', appearance: 'light', viewport: 'mobile' },
  { name: 'recoverable-error-dark-mobile', kind: 'recoverable-error', appearance: 'dark', viewport: 'mobile' },
  { name: 'terminal-error-light-desktop', kind: 'terminal-error', appearance: 'light', viewport: 'desktop', detailsOpen: true },
];

describe('state feedback visual coverage', () => {
  it('covers every standardized state, both appearances, responsive layouts, and expanded details', () => {
    expect(new Set(stateFeedbackVisualCases.map((item) => item.kind)).size).toBe(5);
    expect(new Set(stateFeedbackVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(stateFeedbackVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(stateFeedbackVisualCases.some((item) => item.detailsOpen)).toBeTrue();
  });
});
