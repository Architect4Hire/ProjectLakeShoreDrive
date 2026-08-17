import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ProfileMenuComponent } from '../../patterns/profile-menu/profile-menu.component';

export interface AppNavbarLink {
  readonly id: string;
  readonly label: string;
  readonly routerLink: string | readonly string[];
}

/**
 * Top-level, flat primary navigation only - no nested dropdown flyouts.
 * Grouped/nested secondary navigation belongs in NavMenuComponent's
 * sidebar, composed separately into WorkbenchShellComponent's
 * lsdWorkbenchNavigation slot. Splitting primary (navbar) from secondary
 * (sidebar) navigation this way avoids building two overlapping menu
 * interaction models (inline-expand vs. hover/click flyout) in one pass.
 */
@Component({
  selector: 'lsd-app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ProfileMenuComponent],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavbarComponent {
  readonly links = input<readonly AppNavbarLink[]>([]);
  readonly profileName = input.required<string>();
  readonly profileEmail = input<string | undefined>(undefined);
}
