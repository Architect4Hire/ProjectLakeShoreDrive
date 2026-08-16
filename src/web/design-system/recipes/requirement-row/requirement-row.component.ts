import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeComponent, type BadgeVariant, SurfaceComponent } from '../../primitives';

export type RequirementPriority = 'critical' | 'high' | 'medium' | 'low';

export interface RequirementStatusPresentation {
  readonly label: string;
  readonly variant: BadgeVariant;
}

export interface RequirementReference {
  readonly id: string;
  readonly label: string;
}

export interface RequirementRowViewModel {
  readonly id: string;
  readonly title: string;
  readonly status: RequirementStatusPresentation;
  readonly priority: RequirementPriority;
  readonly traceability?: readonly RequirementReference[];
  readonly evidence?: readonly RequirementReference[];
}

interface PriorityPresentation {
  readonly label: string;
  readonly variant: BadgeVariant;
}

@Component({
  selector: 'lsd-requirement-row',
  standalone: true,
  imports: [BadgeComponent, SurfaceComponent],
  templateUrl: './requirement-row.component.html',
  styleUrl: './requirement-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequirementRowComponent {
  readonly requirement = input.required<RequirementRowViewModel>();
  readonly headingLevel = input<2 | 3 | 4>(3);
  readonly actionsLabel = input('Requirement actions');

  protected readonly headingId = computed(() => `requirement-${this.requirement().id}-title`);
  protected readonly priorityPresentation = computed(() => this.priorityPresentations[this.requirement().priority]);

  private readonly priorityPresentations: Record<RequirementPriority, PriorityPresentation> = {
    critical: { label: 'Critical priority', variant: 'danger' },
    high: { label: 'High priority', variant: 'warning' },
    medium: { label: 'Medium priority', variant: 'info' },
    low: { label: 'Low priority', variant: 'neutral' },
  };
}
