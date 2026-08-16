import { AiGenerationState, AiProgressMode } from './ai-generation-progress.component';

interface AiGenerationProgressVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly state: AiGenerationState;
  readonly mode: AiProgressMode;
  readonly cancellable: boolean;
  readonly reducedMotion: boolean;
}

export const aiGenerationProgressVisualCases: readonly AiGenerationProgressVisualCase[] = [
  { name: 'determinate-generating-light', appearance: 'light', viewport: 'desktop', state: 'generating', mode: 'determinate', cancellable: true, reducedMotion: false },
  { name: 'indeterminate-generating-dark', appearance: 'dark', viewport: 'desktop', state: 'generating', mode: 'indeterminate', cancellable: true, reducedMotion: false },
  { name: 'cancelling-mobile-reduced-motion', appearance: 'light', viewport: 'mobile', state: 'cancelling', mode: 'indeterminate', cancellable: true, reducedMotion: true },
  { name: 'cancelled-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'cancelled', mode: 'determinate', cancellable: false, reducedMotion: false },
  { name: 'completed-light', appearance: 'light', viewport: 'desktop', state: 'completed', mode: 'determinate', cancellable: false, reducedMotion: false },
  { name: 'failed-dark', appearance: 'dark', viewport: 'desktop', state: 'failed', mode: 'indeterminate', cancellable: false, reducedMotion: false },
];

describe('AI generation progress visual coverage', () => {
  it('covers states, progress modes, appearances, widths, cancellation, and reduced motion', () => {
    expect(new Set(aiGenerationProgressVisualCases.map((item) => item.state))).toEqual(new Set(['generating', 'cancelling', 'cancelled', 'completed', 'failed']));
    expect(new Set(aiGenerationProgressVisualCases.map((item) => item.mode))).toEqual(new Set(['determinate', 'indeterminate']));
    expect(new Set(aiGenerationProgressVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(aiGenerationProgressVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(aiGenerationProgressVisualCases.some((item) => item.cancellable)).toBeTrue();
    expect(aiGenerationProgressVisualCases.some((item) => item.reducedMotion)).toBeTrue();
  });
});
