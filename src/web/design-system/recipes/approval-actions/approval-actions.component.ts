import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AlertBannerComponent } from '../../components';
import { BadgeComponent, type BadgeVariant, ButtonComponent, SurfaceComponent } from '../../primitives';
import type { ReviewProvenance } from '../../patterns';
import { globalLayers } from '../../tokens/layers';

export type ApprovalReviewStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';
export type ApprovalProcessingAction = 'approve' | 'reject' | 'request-change';
export type ApprovalActionsMode = 'contained' | 'sticky';

@Component({ selector: 'lsd-approval-actions', standalone: true,
  imports: [AlertBannerComponent, BadgeComponent, ButtonComponent, SurfaceComponent],
  templateUrl: './approval-actions.component.html', styleUrl: './approval-actions.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class ApprovalActionsComponent {
  readonly id = input.required<string>(); readonly label = input('Review decision');
  readonly status = input<ApprovalReviewStatus>('pending'); readonly provenance = input.required<ReviewProvenance>();
  readonly warnings = input<readonly string[]>([]); readonly mode = input<ApprovalActionsMode>('contained');
  readonly processing = input<ApprovalProcessingAction | null>(null); readonly approveDisabled = input(false);
  readonly rejectDisabled = input(false); readonly requestChangeDisabled = input(false);
  readonly approved = output<void>(); readonly rejected = output<void>(); readonly changeRequested = output<void>();
  protected readonly stickyLayer = globalLayers.sticky;
  protected readonly pending = computed(() => this.status() === 'pending');
  protected readonly statusView = computed(() => this.statusMap[this.status()]);
  protected readonly provenanceView = computed(() => this.provenanceMap[this.provenance()]);
  protected unavailable(disabled: boolean): boolean { return disabled || !this.pending() || this.processing() !== null; }
  private readonly statusMap: Record<ApprovalReviewStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Awaiting review', variant: 'warning' }, approved: { label: 'Approved', variant: 'approved' },
    rejected: { label: 'Rejected', variant: 'danger' }, 'changes-requested': { label: 'Changes requested', variant: 'info' },
  };
  private readonly provenanceMap: Record<ReviewProvenance, { label: string; variant: BadgeVariant }> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' }, 'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated · Not approved', variant: 'ai-draft' }, 'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
  };
}
