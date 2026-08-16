import type { StructuredEditorSaveState } from '../../layouts';
import type { DocumentSectionApprovalState } from './document-section-editor.component';
interface Case { readonly name: string; readonly appearance: 'light' | 'dark'; readonly viewport: 'desktop' | 'mobile'; readonly save: StructuredEditorSaveState; readonly approval: DocumentSectionApprovalState; readonly context: boolean; }
export const documentSectionEditorVisualCases: readonly Case[] = [
  { name: 'saved-draft-light-desktop', appearance: 'light', viewport: 'desktop', save: 'saved', approval: 'draft', context: false },
  { name: 'saving-review-dark-desktop', appearance: 'dark', viewport: 'desktop', save: 'saving', approval: 'in-review', context: true },
  { name: 'dirty-approved-light-mobile', appearance: 'light', viewport: 'mobile', save: 'dirty', approval: 'approved', context: false },
  { name: 'error-locked-dark-mobile', appearance: 'dark', viewport: 'mobile', save: 'error', approval: 'locked', context: true },
];
describe('document section editor visual coverage', () => {
  it('covers appearance, widths, save, approval, and context states', () => {
    expect(new Set(documentSectionEditorVisualCases.map(x => x.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(documentSectionEditorVisualCases.map(x => x.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(documentSectionEditorVisualCases.map(x => x.save))).toEqual(new Set(['saved', 'saving', 'dirty', 'error']));
    expect(new Set(documentSectionEditorVisualCases.map(x => x.approval))).toEqual(new Set(['draft', 'in-review', 'approved', 'locked']));
    expect(new Set(documentSectionEditorVisualCases.map(x => x.context))).toEqual(new Set([true, false]));
  });
});
