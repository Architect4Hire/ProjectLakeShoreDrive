import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import {
  type EngagementPhase,
  type EngagementPhaseStates,
  PhaseNavigationComponent,
} from '../../../../design-system/public-api';

const canonicalPhaseIds: readonly EngagementPhase[] = [
  'overview',
  'discovery',
  'requirements',
  'architecture',
  'adrs',
  'raid',
  'estimates',
  'documents',
  'ai',
];

@Component({
  selector: 'lsd-engagement-shell',
  standalone: true,
  imports: [RouterOutlet, PhaseNavigationComponent],
  template: `
    <div class="flex flex-col gap-4">
      <lsd-phase-navigation
        [label]="'Engagement ' + engagementId() + ' phases'"
        [states]="phaseStates()"
        (phaseRequested)="navigateToPhase($event)" />

      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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

  protected readonly phaseStates = computed<EngagementPhaseStates>(() => {
    const active = this.activePhase();
    return active ? { [active]: 'active' } : {};
  });

  protected navigateToPhase(phase: EngagementPhase): void {
    this.router.navigate([phase], { relativeTo: this.route });
  }

  private phaseFromUrl(): EngagementPhase | undefined {
    const segments = this.router.url.split('/');
    return canonicalPhaseIds.find((phase) => segments.includes(phase));
  }
}
