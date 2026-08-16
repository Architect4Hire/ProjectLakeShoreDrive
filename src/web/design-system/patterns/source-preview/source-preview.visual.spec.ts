import { SourcePreviewState } from './source-preview.component';

interface SourcePreviewVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly placement: 'start' | 'end';
  readonly state: SourcePreviewState;
  readonly contextOpen: boolean;
  readonly completeMetadata: boolean;
}

export const sourcePreviewVisualCases: readonly SourcePreviewVisualCase[] = [
  { name: 'ready-end-light', appearance: 'light', viewport: 'desktop', placement: 'end', state: 'ready', contextOpen: false, completeMetadata: true },
  { name: 'ready-context-start-dark', appearance: 'dark', viewport: 'desktop', placement: 'start', state: 'ready', contextOpen: true, completeMetadata: true },
  { name: 'loading-mobile-light', appearance: 'light', viewport: 'mobile', placement: 'end', state: 'loading', contextOpen: false, completeMetadata: true },
  { name: 'unavailable-mobile-dark', appearance: 'dark', viewport: 'mobile', placement: 'end', state: 'unavailable', contextOpen: false, completeMetadata: false },
  { name: 'failed-desktop-light', appearance: 'light', viewport: 'desktop', placement: 'start', state: 'failed', contextOpen: false, completeMetadata: false },
];

describe('source preview visual coverage', () => {
  it('covers states, appearances, widths, placements, metadata density, and context disclosure', () => {
    expect(new Set(sourcePreviewVisualCases.map((item) => item.state))).toEqual(new Set(['ready', 'loading', 'unavailable', 'failed']));
    expect(new Set(sourcePreviewVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(sourcePreviewVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(sourcePreviewVisualCases.map((item) => item.placement))).toEqual(new Set(['start', 'end']));
    expect(sourcePreviewVisualCases.some((item) => item.contextOpen)).toBeTrue();
    expect(sourcePreviewVisualCases.some((item) => !item.completeMetadata)).toBeTrue();
  });
});
