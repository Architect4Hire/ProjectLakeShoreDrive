import { Routes } from '@angular/router';

import type { EngagementPhase } from '../../../../design-system/public-api';

interface EngagementPhaseRouteDefinition {
  readonly path: EngagementPhase;
  readonly label: string;
}

const phaseRouteDefinitions: readonly EngagementPhaseRouteDefinition[] = [
  { path: 'overview', label: 'Overview' },
  { path: 'discovery', label: 'Discovery' },
  { path: 'requirements', label: 'Requirements' },
  { path: 'architecture', label: 'Architecture' },
  { path: 'adrs', label: 'ADRs' },
  { path: 'raid', label: 'RAID' },
  { path: 'estimates', label: 'Estimates' },
  { path: 'documents', label: 'Documents' },
  { path: 'ai', label: 'AI' },
];

export const ENGAGEMENT_PHASE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  ...phaseRouteDefinitions.map(({ path, label }) => ({
    path,
    data: { phaseLabel: label },
    loadComponent: () =>
      import('./engagement-phase-placeholder.component').then((m) => m.EngagementPhasePlaceholderComponent),
  })),
];
