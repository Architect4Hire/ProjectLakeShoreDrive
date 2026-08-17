import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'engagements',
        loadChildren: () => import('./features/engagements/engagements.routes').then((m) => m.ENGAGEMENTS_ROUTES),
      },
      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.routes').then((m) => m.GALLERY_ROUTES),
      },
      {
        path: '',
        redirectTo: 'engagements',
        pathMatch: 'full',
      },
    ],
  },
];
