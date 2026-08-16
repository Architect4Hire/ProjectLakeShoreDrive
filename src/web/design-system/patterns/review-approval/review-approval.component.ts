import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';
import { SplitViewComponent } from '../split-view/split-view.component';

export type ReviewProvenance =
  | 'human-authored'
  | 'ai-suggested'
  | 'ai-generated'
  | 'human-modified-from-ai'
  | 'human-approved';
export type ReviewDecision = 'pending' | 'approved' | 'rejected';
export type ReviewProcessingAction = 'approve' | 'reject';

@Component({
  selector: 'lsd-review-approval',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, SplitViewComponent, SurfaceComponent],
  templateUrl: './review-approval.component.html',
  styleUrl: './review-approval.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewApprovalComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly provenance = input.required<ReviewProvenance>();
  readonly decision = input<ReviewDecision>('pending');
  readonly currentLabel = input('Current');
  readonly proposedLabel = input('Proposed');
  readonly approveLabel = input('Approve proposal');
  readonly rejectLabel = input('Reject proposal');
  readonly processing = input<ReviewProcessingAction | null>(null);
  readonly approvalDisabled = input(false);

  readonly approved = output<void>();
  readonly rejected = output<void>();

  protected readonly pending = computed(() => this.decision() === 'pending');
  protected readonly unavailable = computed(() => !this.pending() || this.processing() !== null);
  protected readonly statusText = computed(() => {
    if (this.processing() === 'approve') return 'Recording approval';
    if (this.processing() === 'reject') return 'Recording rejection';
    if (this.decision() === 'approved') return 'Proposal approved';
    if (this.decision() === 'rejected') return 'Proposal rejected';
    return 'Proposal awaiting review';
  });
  protected readonly decisionVariant = computed<BadgeVariant>(() =>
    this.decision() === 'approved' ? 'approved' : this.decision() === 'rejected' ? 'danger' : 'warning',
  );
  protected readonly provenancePresentation = computed(() => this.provenanceMap[this.provenance()]);

  protected approve(): void {
    if (!this.unavailable() && !this.approvalDisabled()) this.approved.emit();
  }

  protected reject(): void {
    if (!this.unavailable()) this.rejected.emit();
  }

  private readonly provenanceMap: Record<ReviewProvenance, Readonly<{ label: string; variant: BadgeVariant }>> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' },
    'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated', variant: 'ai-draft' },
    'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
  };
}
