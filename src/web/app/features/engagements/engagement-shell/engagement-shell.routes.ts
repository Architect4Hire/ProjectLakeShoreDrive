import { Routes } from '@angular/router';
import { ENGAGEMENT_PHASE_DEFINITIONS } from '../data/engagement-phases';

export const ENGAGEMENT_PHASE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  ...ENGAGEMENT_PHASE_DEFINITIONS.map(({ id, label }) => ({
    path: id,
    data: { phaseLabel: label },
    loadComponent:
      id === 'overview'
        ? () => import('../engagement-overview/engagement-overview.component').then((m) => m.EngagementOverviewComponent)
        : () => import('./engagement-phase-placeholder.component').then((m) => m.EngagementPhasePlaceholderComponent),
  })),
];
