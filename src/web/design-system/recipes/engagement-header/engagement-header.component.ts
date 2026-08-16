import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeComponent, type BadgeVariant, SeparatorComponent, SurfaceComponent } from '../../primitives';

export type EngagementLifecycleStatus =
  | 'draft'
  | 'discovery'
  | 'analysis'
  | 'architecture'
  | 'estimation'
  | 'package-generation'
  | 'review'
  | 'approved'
  | 'delivery'
  | 'closed'
  | 'archived';

export interface EngagementClientMetadata {
  readonly label: string;
  readonly value: string;
}

export interface EngagementHeaderViewModel {
  readonly id: string;
  readonly name: string;
  readonly clientName: string;
  readonly engagementType?: string;
  readonly status: EngagementLifecycleStatus;
  readonly clientMetadata?: readonly EngagementClientMetadata[];
}

interface StatusPresentation {
  readonly label: string;
  readonly variant: BadgeVariant;
}

@Component({
  selector: 'lsd-engagement-header',
  standalone: true,
  imports: [BadgeComponent, SeparatorComponent, SurfaceComponent],
  templateUrl: './engagement-header.component.html',
  styleUrl: './engagement-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementHeaderComponent {
  readonly engagement = input.required<EngagementHeaderViewModel>();
  readonly headingLevel = input<1 | 2>(1);
  readonly actionsLabel = input('Engagement actions');
  readonly contextSwitcherLabel = input('Switch engagement context');
  readonly announceStatus = input(false);

  protected readonly headingId = computed(() => `engagement-${this.engagement().id}-title`);
  protected readonly statusPresentation = computed(() => this.statusPresentations[this.engagement().status]);

  private readonly statusPresentations: Record<EngagementLifecycleStatus, StatusPresentation> = {
    draft: { label: 'Draft', variant: 'neutral' },
    discovery: { label: 'Discovery', variant: 'info' },
    analysis: { label: 'Analysis', variant: 'info' },
    architecture: { label: 'Architecture', variant: 'info' },
    estimation: { label: 'Estimation', variant: 'info' },
    'package-generation': { label: 'Package generation', variant: 'warning' },
    review: { label: 'In review', variant: 'warning' },
    approved: { label: 'Approved', variant: 'approved' },
    delivery: { label: 'Delivery', variant: 'success' },
    closed: { label: 'Closed', variant: 'neutral' },
    archived: { label: 'Archived', variant: 'archived' },
  };
}
