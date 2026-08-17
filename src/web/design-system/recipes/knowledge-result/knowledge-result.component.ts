import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CitationChipComponent, type CitationReference } from '../../components';
import { BadgeComponent, type BadgeVariant, ButtonComponent, SurfaceComponent } from '../../primitives';

export type KnowledgeApprovalState = 'approved' | 'unapproved' | 'deprecated';
export type KnowledgeConfidentiality = 'public' | 'internal' | 'confidential' | 'restricted';
export interface KnowledgeScope { readonly engagementLabel?: string; readonly clientLabel?: string; }
export interface KnowledgeSearchResult {
  readonly sourceId: string; readonly title: string; readonly section?: string; readonly artifactType: string;
  readonly scope: KnowledgeScope; readonly excerpt: string; readonly tags: readonly string[];
  readonly approval: KnowledgeApprovalState; readonly confidentiality: KnowledgeConfidentiality;
}

@Component({ selector: 'lsd-knowledge-result', standalone: true, imports: [BadgeComponent, ButtonComponent, CitationChipComponent, SurfaceComponent], templateUrl: './knowledge-result.component.html', styleUrl: './knowledge-result.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class KnowledgeResultComponent {
  readonly result = input.required<KnowledgeSearchResult>(); readonly previewId = input.required<string>();
  readonly previewOpen = input(false); readonly selected = input(false); readonly actionsDisabled = input(false);
  readonly previewRequested = output<KnowledgeSearchResult>(); readonly openSourceRequested = output<KnowledgeSearchResult>(); readonly selectionRequested = output<KnowledgeSearchResult>();
  protected readonly citation = computed<CitationReference>(() => {
    const result = this.result();
    return { sourceId: result.sourceId, sourceTitle: result.title, ...(result.section !== undefined ? { sourceSection: result.section } : {}) };
  });
  protected readonly approvalView = computed(() => this.approvalMap[this.result().approval]);
  protected readonly confidentialityView = computed(() => this.confidentialityMap[this.result().confidentiality]);
  private readonly approvalMap: Record<KnowledgeApprovalState, { label:string; variant:BadgeVariant }> = { approved:{label:'Approved knowledge',variant:'approved'}, unapproved:{label:'Not approved',variant:'warning'}, deprecated:{label:'Deprecated',variant:'deprecated'} };
  private readonly confidentialityMap: Record<KnowledgeConfidentiality, { label:string; variant:BadgeVariant }> = { public:{label:'Public',variant:'neutral'}, internal:{label:'Internal',variant:'info'}, confidential:{label:'Confidential',variant:'warning'}, restricted:{label:'Restricted',variant:'danger'} };
}
