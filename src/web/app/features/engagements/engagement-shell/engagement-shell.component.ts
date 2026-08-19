import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import {
  type EngagementPhase,
  type EngagementPhaseState,
  type EngagementPhaseStates,
  EngagementHeaderComponent,
  PhaseNavigationComponent,
} from '../../../../design-system/public-api';
import { EngagementWorkspaceStore } from '../data/engagement-workspace.store';
import { ENGAGEMENT_PHASE_IDS } from '../data/engagement-phases';
import { ENGAGEMENT_STATUS_TO_LIFECYCLE_STATUS, LIFECYCLE_SEQUENCE } from '../data/engagement-status';

// Only phases with a direct analog in the backend lifecycle sequence (BR-022) get a
// completed/active derivation; the rest (requirements/adrs/raid/documents/ai) are concurrent
// workstreams rather than sequential stages, so they stay 'available' unless the URL is
// currently on them.
const PHASE_TO_LIFECYCLE_INDEX: Readonly<Partial<Record<EngagementPhase, number>>> = {
  overview: 0,
  discovery: 1,
  architecture: 3,
  estimates: 4,
};

@Component({
  selector: 'lsd-engagement-shell',
  standalone: true,
  imports: [RouterOutlet, PhaseNavigationComponent, EngagementHeaderComponent],
  providers: [EngagementWorkspaceStore],
  templateUrl: './engagement-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(EngagementWorkspaceStore);

  protected readonly engagementId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  private readonly activePhase = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.phaseFromUrl()),
    ),
    { initialValue: this.phaseFromUrl() },
  );

  protected readonly headerViewModel = computed(() => {
    const detail = this.store.detail();
    if (!detail) {
      return undefined;
    }

    return {
      id: detail.id,
      name: detail.name,
      clientName: detail.clientName,
      engagementType: detail.type,
      status: ENGAGEMENT_STATUS_TO_LIFECYCLE_STATUS[detail.status],
    };
  });

  protected readonly phaseStates = computed<EngagementPhaseStates>(() => {
    const status = this.store.detail()?.status;
    const currentIndex = status ? LIFECYCLE_SEQUENCE.indexOf(status) : -1;
    const states: Partial<Record<EngagementPhase, EngagementPhaseState>> = {};

    if (currentIndex >= 0) {
      for (const phase of ENGAGEMENT_PHASE_IDS) {
        const lifecycleIndex = PHASE_TO_LIFECYCLE_INDEX[phase];
        if (lifecycleIndex === undefined) {
          continue;
        }

        states[phase] = currentIndex > lifecycleIndex ? 'completed' : currentIndex === lifecycleIndex ? 'active' : 'available';
      }
    }

    const urlPhase = this.activePhase();
    if (urlPhase) {
      states[urlPhase] = 'active';
    }

    return states;
  });

  protected navigateToPhase(phase: EngagementPhase): void {
    this.router.navigate([phase], { relativeTo: this.route });
  }

  private phaseFromUrl(): EngagementPhase | undefined {
    const segments = this.router.url.split('/');
    return ENGAGEMENT_PHASE_IDS.find((phase) => segments.includes(phase));
  }
}
