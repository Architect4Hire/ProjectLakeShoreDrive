import { AiConfidenceLevel } from './ai-confidence.component';

interface AiConfidenceVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly level: AiConfidenceLevel;
  readonly detailsOpen: boolean;
  readonly actions: boolean;
}

export const aiConfidenceVisualCases: readonly AiConfidenceVisualCase[] = [
  { name: 'unknown-light', appearance: 'light', viewport: 'desktop', level: 'unknown', detailsOpen: false, actions: false },
  { name: 'limited-dark-details', appearance: 'dark', viewport: 'desktop', level: 'limited', detailsOpen: true, actions: true },
  { name: 'moderate-mobile-light', appearance: 'light', viewport: 'mobile', level: 'moderate', detailsOpen: false, actions: true },
  { name: 'strong-mobile-dark', appearance: 'dark', viewport: 'mobile', level: 'strong', detailsOpen: true, actions: false },
];

describe('AI confidence visual coverage', () => {
  it('covers every semantic level, appearance, width, disclosure, and action composition', () => {
    expect(new Set(aiConfidenceVisualCases.map((item) => item.level))).toEqual(new Set(['unknown', 'limited', 'moderate', 'strong']));
    expect(new Set(aiConfidenceVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(aiConfidenceVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(aiConfidenceVisualCases.some((item) => item.detailsOpen)).toBeTrue();
    expect(aiConfidenceVisualCases.some((item) => item.actions)).toBeTrue();
  });
});
