import { Routes } from '@angular/router';
import { EngagementsListComponent } from './engagements-list.component';
import { ENGAGEMENT_PHASE_ROUTES } from './engagement-shell/engagement-shell.routes';

export const ENGAGEMENTS_ROUTES: Routes = [
  {
    path: '',
    component: EngagementsListComponent,
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./engagement-create/engagement-create.component').then((m) => m.EngagementCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./engagement-shell/engagement-shell.component').then((m) => m.EngagementShellComponent),
    children: ENGAGEMENT_PHASE_ROUTES,
  },
];
