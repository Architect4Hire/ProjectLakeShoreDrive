import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ActivityStreamComponent,
  ActivityStreamItem,
  BadgeComponent,
  StateFeedbackComponent,
  SurfaceComponent,
} from '../../../../design-system/public-api';
import { ENGAGEMENT_PHASE_DEFINITIONS } from '../data/engagement-phases';
import { ENGAGEMENT_STATUS_BADGE_VARIANT, ENGAGEMENT_STATUS_LABELS, LIFECYCLE_SEQUENCE } from '../data/engagement-status';
import { EngagementWorkspaceStore } from '../data/engagement-workspace.store';
import { EngagementPhaseTransitionComponent } from './engagement-phase-transition.component';

@Component({
  selector: 'lsd-engagement-overview',
  standalone: true,
  imports: [
    ActivityStreamComponent,
    BadgeComponent,
    EngagementPhaseTransitionComponent,
    RouterLink,
    StateFeedbackComponent,
    SurfaceComponent,
  ],
  templateUrl: './engagement-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementOverviewComponent {
  protected readonly store = inject(EngagementWorkspaceStore);

  protected onTransitioned(): void {
    this.store.reload();
  }

  protected readonly statusLabels = ENGAGEMENT_STATUS_LABELS;
  protected readonly statusBadgeVariant = ENGAGEMENT_STATUS_BADGE_VARIANT;

  // Every phase except 'overview' itself gets a not-yet-built placeholder card linking to its
  // own route; those phases are implemented by later prompts, not this one.
  protected readonly remainingPhases = ENGAGEMENT_PHASE_DEFINITIONS.filter((phase) => phase.id !== 'overview');

  protected readonly phaseProgress = computed(() => {
    const status = this.store.detail()?.status;
    const index = status ? LIFECYCLE_SEQUENCE.indexOf(status) : -1;
    return index >= 0 ? `Phase ${index + 1} of ${LIFECYCLE_SEQUENCE.length}` : undefined;
  });

  protected readonly activityItems = computed<readonly ActivityStreamItem<string>[]>(() => {
    const detail = this.store.detail();
    if (!detail) {
      return [];
    }

    return detail.lifecycleHistory.map((transition, index) => ({
      identity: `${index}-${transition.occurredAtUtc}`,
      actor: transition.performedBy,
      occurredAt: transition.occurredAtUtc,
      timestampLabel: new Date(transition.occurredAtUtc).toLocaleString(),
      action:
        `Moved from ${this.statusLabels[transition.fromStatus]} to ${this.statusLabels[transition.toStatus]}` +
        (transition.reason ? `: ${transition.reason}` : ''),
      attribution: 'human-authored' as const,
    }));
  });
}
