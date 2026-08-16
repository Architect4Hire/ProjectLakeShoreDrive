interface CitationChipVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly section: boolean;
  readonly showSourceId: boolean;
  readonly previewOpen: boolean;
  readonly disabled: boolean;
  readonly longTitle: boolean;
}

export const citationChipVisualCases: readonly CitationChipVisualCase[] = [
  { name: 'source-section-light', appearance: 'light', viewport: 'desktop', section: true, showSourceId: true, previewOpen: false, disabled: false, longTitle: false },
  { name: 'preview-open-dark', appearance: 'dark', viewport: 'desktop', section: true, showSourceId: true, previewOpen: true, disabled: false, longTitle: false },
  { name: 'long-title-mobile', appearance: 'light', viewport: 'mobile', section: true, showSourceId: true, previewOpen: false, disabled: false, longTitle: true },
  { name: 'title-only-dark-mobile', appearance: 'dark', viewport: 'mobile', section: false, showSourceId: false, previewOpen: false, disabled: false, longTitle: false },
  { name: 'disabled-source-light', appearance: 'light', viewport: 'desktop', section: true, showSourceId: true, previewOpen: false, disabled: true, longTitle: false },
];

describe('citation chip visual coverage', () => {
  it('covers appearances, widths, metadata density, preview, truncation, and disabled state', () => {
    expect(new Set(citationChipVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(citationChipVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(citationChipVisualCases.some((item) => item.section && item.showSourceId)).toBeTrue();
    expect(citationChipVisualCases.some((item) => item.previewOpen)).toBeTrue();
    expect(citationChipVisualCases.some((item) => item.disabled)).toBeTrue();
    expect(citationChipVisualCases.some((item) => item.longTitle)).toBeTrue();
  });
});
