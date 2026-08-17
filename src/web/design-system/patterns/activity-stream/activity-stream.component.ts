import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input } from '@angular/core';

import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';
import { StateFeedbackComponent } from '../state-feedback/state-feedback.component';
import { ActivityStreamDetailsDirective } from './activity-stream-details.directive';

export type ActivityAttribution =
  | 'human-authored'
  | 'ai-suggested'
  | 'ai-generated'
  | 'human-modified-from-ai'
  | 'human-approved'
  | 'system';

export interface ActivityStreamItem<T> {
  readonly identity: T;
  readonly actor: string;
  /** Machine-readable ISO 8601 timestamp for the native time element. */
  readonly occurredAt: string;
  /** Caller-localized timestamp visible to people. */
  readonly timestampLabel: string;
  readonly action: string;
  readonly attribution: ActivityAttribution;
  readonly source?: string;
  readonly hasDetails?: boolean;
}

@Component({
  selector: 'lsd-activity-stream',
  standalone: true,
  imports: [BadgeComponent, NgTemplateOutlet, StateFeedbackComponent, SurfaceComponent, ActivityStreamDetailsDirective],
  templateUrl: './activity-stream.component.html',
  styleUrl: './activity-stream.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityStreamComponent<T = string> {
  readonly id = input.required<string>();
  readonly accessibleName = input('Activity history');
  readonly items = input.required<readonly ActivityStreamItem<T>[]>();
  readonly detailsLabel = input('Show details');
  readonly emptyTitle = input('No activity yet');
  readonly emptyDescription = input('Significant changes will appear here.');

  protected readonly detailsTemplate = contentChild(ActivityStreamDetailsDirective<T>);

  protected attributionLabel(attribution: ActivityAttribution): string {
    return this.attributionPresentation[attribution].label;
  }

  protected attributionVariant(attribution: ActivityAttribution): BadgeVariant {
    return this.attributionPresentation[attribution].variant;
  }

  private readonly attributionPresentation: Record<ActivityAttribution, Readonly<{ label: string; variant: BadgeVariant }>> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' },
    'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated', variant: 'ai-draft' },
    'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
    system: { label: 'System', variant: 'neutral' },
  };
}
