import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { BadgeComponent, type BadgeVariant, ButtonComponent } from '../../primitives';
import { StructuredEditorComponent, StructuredEditorSectionActionsDirective, StructuredEditorSectionContentDirective, type StructuredEditorSaveState, type StructuredEditorSection } from '../../layouts';
import type { ReviewProvenance } from '../../patterns';

export type DocumentSectionApprovalState = 'draft' | 'in-review' | 'approved' | 'locked';
export interface DocumentSectionEditorViewModel { readonly id: string; readonly title: string; readonly description?: string; readonly provenance: ReviewProvenance; readonly approval: DocumentSectionApprovalState; readonly versionLabel?: string; }

@Component({ selector: 'lsd-document-section-editor', standalone: true,
  imports: [BadgeComponent, ButtonComponent, StructuredEditorComponent, StructuredEditorSectionActionsDirective, StructuredEditorSectionContentDirective],
  templateUrl: './document-section-editor.component.html', styleUrl: './document-section-editor.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class DocumentSectionEditorComponent {
  readonly id = input.required<string>(); readonly section = input.required<DocumentSectionEditorViewModel>();
  readonly saveState = input<StructuredEditorSaveState>('saved'); readonly saveError = input<string | undefined>(undefined);
  readonly contextAvailable = input(false); readonly splitViewOpen = model(false); readonly actionsDisabled = input(false);
  readonly historyRequested = output<string>();
  protected readonly sections = computed<readonly StructuredEditorSection<string>[]>(() => [{ identity: this.section().id, title: this.section().title, description: this.section().description }]);
  protected readonly provenance = computed(() => this.provenanceMap[this.section().provenance]);
  protected readonly approval = computed(() => this.approvalMap[this.section().approval]);
  protected requestHistory(): void { if (!this.actionsDisabled()) this.historyRequested.emit(this.section().id); }
  private readonly provenanceMap: Record<ReviewProvenance, { label: string; variant: BadgeVariant }> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' }, 'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated · Not approved', variant: 'ai-draft' }, 'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
  };
  private readonly approvalMap: Record<DocumentSectionApprovalState, { label: string; variant: BadgeVariant }> = {
    draft: { label: 'Draft', variant: 'neutral' }, 'in-review': { label: 'In review', variant: 'warning' }, approved: { label: 'Approved', variant: 'approved' }, locked: { label: 'Locked', variant: 'info' },
  };
}
