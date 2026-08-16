import type { AiGenerationState } from '../../patterns';
interface Case { readonly name: string; readonly appearance: 'light' | 'dark'; readonly viewport: 'desktop' | 'mobile'; readonly state: AiGenerationState; }
export const aiGenerationDrawerVisualCases: readonly Case[] = [
  { name: 'generating-light-desktop', appearance: 'light', viewport: 'desktop', state: 'generating' },
  { name: 'cancelling-dark-desktop', appearance: 'dark', viewport: 'desktop', state: 'cancelling' },
  { name: 'completed-light-desktop', appearance: 'light', viewport: 'desktop', state: 'completed' },
  { name: 'failed-dark-mobile', appearance: 'dark', viewport: 'mobile', state: 'failed' },
  { name: 'cancelled-light-mobile', appearance: 'light', viewport: 'mobile', state: 'cancelled' },
];
describe('AI generation drawer visual coverage', () => {
  it('covers appearances, widths, and generation states', () => {
    expect(new Set(aiGenerationDrawerVisualCases.map(x => x.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(aiGenerationDrawerVisualCases.map(x => x.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(aiGenerationDrawerVisualCases.map(x => x.state))).toEqual(new Set(['generating', 'cancelling', 'completed', 'failed', 'cancelled']));
  });
});
