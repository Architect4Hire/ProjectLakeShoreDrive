import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';

export type SuggestedChangeLayout = 'comparison' | 'proposal-only';
export type SuggestedChangeState = 'pending' | 'accepted' | 'rejected';
export type SuggestedChangeProcessing = 'accept' | 'reject';
export type SuggestedChangeProvenance = 'ai-suggested' | 'ai-generated' | 'human-modified-from-ai';

@Component({
  selector: 'lsd-suggested-change',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, SurfaceComponent],
  templateUrl: './suggested-change.component.html',
  styleUrl: './suggested-change.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedChangeComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly provenance = input<SuggestedChangeProvenance>('ai-suggested');
  readonly layout = input<SuggestedChangeLayout>('comparison');
  readonly state = input<SuggestedChangeState>('pending');
  readonly processing = input<SuggestedChangeProcessing | null>(null);
  readonly acceptDisabled = input(false);
  readonly actionsDisabled = input(false);
  readonly currentLabel = input('Before');
  readonly proposedLabel = input('Proposed');
  readonly acceptLabel = input('Accept suggestion');
  readonly rejectLabel = input('Reject suggestion');

  readonly accepted = output<void>();
  readonly rejected = output<void>();

  protected readonly pending = computed(() => this.state() === 'pending');
  protected readonly unavailable = computed(() => !this.pending() || this.processing() !== null || this.actionsDisabled());
  protected readonly provenancePresentation = computed(() => this.provenanceMap[this.provenance()]);
  protected readonly statePresentation = computed(() => {
    if (this.processing() === 'accept') return { label: 'Accepting suggestion', variant: 'warning' as BadgeVariant };
    if (this.processing() === 'reject') return { label: 'Rejecting suggestion', variant: 'warning' as BadgeVariant };
    return this.stateMap[this.state()];
  });

  protected accept(): void {
    if (!this.unavailable() && !this.acceptDisabled()) this.accepted.emit();
  }

  protected reject(): void {
    if (!this.unavailable()) this.rejected.emit();
  }

  private readonly provenanceMap: Record<SuggestedChangeProvenance, Readonly<{ label: string; variant: BadgeVariant }>> = {
    'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated', variant: 'ai-draft' },
    'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
  };

  private readonly stateMap: Record<SuggestedChangeState, Readonly<{ label: string; variant: BadgeVariant }>> = {
    pending: { label: 'Awaiting review', variant: 'warning' },
    accepted: { label: 'Suggestion accepted', variant: 'info' },
    rejected: { label: 'Suggestion rejected', variant: 'danger' },
  };
}
