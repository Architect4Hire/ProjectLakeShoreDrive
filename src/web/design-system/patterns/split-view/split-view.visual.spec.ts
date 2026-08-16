import { SplitViewPane, SplitViewRatio } from './split-view.component';

interface SplitViewVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly ratio: SplitViewRatio;
  readonly compactPane: SplitViewPane;
}

export const splitViewVisualCases: readonly SplitViewVisualCase[] = [
  { name: 'balanced-light-desktop', appearance: 'light', viewport: 'desktop', ratio: 'balanced', compactPane: 'output' },
  { name: 'context-wide-dark-desktop', appearance: 'dark', viewport: 'desktop', ratio: 'context-wide', compactPane: 'context' },
  { name: 'output-wide-light-desktop', appearance: 'light', viewport: 'desktop', ratio: 'output-wide', compactPane: 'output' },
  { name: 'context-dark-tablet', appearance: 'dark', viewport: 'tablet', ratio: 'balanced', compactPane: 'context' },
  { name: 'output-light-mobile', appearance: 'light', viewport: 'mobile', ratio: 'balanced', compactPane: 'output' },
];

describe('split-view visual coverage', () => {
  it('covers ratios, focused panes, appearances, and responsive widths', () => {
    expect(new Set(splitViewVisualCases.map((item) => item.ratio)).size).toBe(3);
    expect(new Set(splitViewVisualCases.map((item) => item.compactPane))).toEqual(new Set(['context', 'output']));
    expect(new Set(splitViewVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(splitViewVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
  });
});
