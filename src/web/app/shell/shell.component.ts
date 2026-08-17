import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import {
  AppearanceService,
  BadgeComponent,
  ButtonComponent,
  CommandPaletteComponent,
  type CommandPaletteGroup,
  InputComponent,
  NotificationService,
  NotificationViewportComponent,
  WorkbenchShellRecipeComponent,
} from '../../design-system/public-api';

interface PrimaryNavItem {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'lsd-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    BadgeComponent,
    ButtonComponent,
    CommandPaletteComponent,
    InputComponent,
    NotificationViewportComponent,
    WorkbenchShellRecipeComponent,
  ],
  template: `
    <lsd-notification-viewport />

    <lsd-workbench-shell-recipe
      id="app-shell"
      navigationTitle="Lake Shore Drive"
      contentLabel="Workbench content"
      [(navigationOpen)]="navigationOpen">
      <nav lsdWorkbenchNavigation aria-label="Primary" class="flex flex-col gap-1 p-2">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-surface-raised text-accent-primary font-semibold"
            (click)="navigationOpen.set(false)"
            class="rounded-md px-3 py-2 text-sm text-text-primary hover:bg-surface-raised">
            {{ item.label }}
          </a>
        }
      </nav>

      <div lsdWorkbenchEngagement class="flex items-center gap-2">
        <lsd-badge variant="neutral">No active engagement</lsd-badge>
        <lsd-button
          size="small"
          impact="minimal"
          tone="neutral"
          accessibleLabel="Switch engagement"
          (activated)="announceUnavailable('Engagement switching')">
          Switch
        </lsd-button>
      </div>

      <lsd-input
        lsdWorkbenchSearch
        id="app-shell-search"
        label="Search"
        type="search"
        placeholder="Search Lake Shore Drive"
        [(value)]="searchQuery"
        (keydown.enter)="submitSearch()" />

      <lsd-button
        lsdWorkbenchCommandPalette
        size="small"
        impact="minimal"
        tone="neutral"
        accessibleLabel="Open command palette"
        [controls]="'app-shell-command-palette'"
        [expanded]="commandPaletteOpen()"
        (activated)="commandPaletteOpen.set(true)">
        Commands
      </lsd-button>

      <div lsdWorkbenchNotifications>
        <lsd-button
          size="small"
          impact="minimal"
          tone="neutral"
          [accessibleLabel]="'Notifications, ' + notifications.notifications().length + ' active'"
          (activated)="notifications.clear()">
          Notifications
          @if (notifications.notifications().length > 0) {
            <lsd-badge variant="info">{{ notifications.notifications().length }}</lsd-badge>
          }
        </lsd-button>
      </div>

      <div lsdWorkbenchTasks>
        <lsd-button
          size="small"
          impact="minimal"
          tone="neutral"
          accessibleLabel="Tasks"
          (activated)="announceUnavailable('Task tracking')">
          Tasks
        </lsd-button>
      </div>

      <div lsdWorkbenchUserMenu>
        <lsd-button
          size="small"
          impact="minimal"
          tone="neutral"
          accessibleLabel="Account menu"
          (activated)="announceUnavailable('Account menu')">
          Guest
        </lsd-button>
      </div>

      <router-outlet />
    </lsd-workbench-shell-recipe>

    <lsd-command-palette
      id="app-shell-command-palette"
      title="Command palette"
      placeholder="Search commands"
      [groups]="commandGroups()"
      [(open)]="commandPaletteOpen"
      [(query)]="commandPaletteQuery"
      (commandSelected)="selectCommand($event)" />
  `,
  styles: [],
})
export class ShellComponent {
  private readonly router = inject(Router);

  protected readonly appearance = inject(AppearanceService);
  protected readonly notifications = inject(NotificationService);

  protected readonly navItems: readonly PrimaryNavItem[] = [
    { path: '/engagements', label: 'Engagements' },
    { path: '/gallery', label: 'Design System Gallery' },
  ];

  protected readonly navigationOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly commandPaletteOpen = signal(false);
  protected readonly commandPaletteQuery = signal('');

  protected readonly commandGroups = computed<readonly CommandPaletteGroup<string>[]>(() => [
    {
      id: 'navigate',
      label: 'Navigate',
      commands: this.navItems.map((item) => ({
        id: item.path,
        identity: item.path,
        label: item.label,
        description: `Go to ${item.label}`,
      })),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      commands: [
        {
          id: 'toggle-appearance',
          identity: 'toggle-appearance',
          label:
            this.appearance.appearance() === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance',
          description: 'Toggle the Lake Shore Drive appearance theme',
        },
      ],
    },
  ]);

  protected submitSearch(): void {
    this.commandPaletteQuery.set(this.searchQuery());
    this.commandPaletteOpen.set(true);
  }

  protected selectCommand(identity: string): void {
    if (identity === 'toggle-appearance') {
      this.appearance.toggleAppearance();
      return;
    }
    this.router.navigateByUrl(identity);
  }

  protected announceUnavailable(feature: string): void {
    this.notifications.notify({
      title: feature,
      message: `${feature} is not yet available.`,
      severity: 'info',
    });
  }
}
