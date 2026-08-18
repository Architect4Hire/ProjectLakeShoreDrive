import { ChangeDetectionStrategy, Component, HostListener, input, model } from '@angular/core';

import { ButtonComponent, SurfaceComponent } from '../../primitives';
import { globalLayers } from '../../tokens/layers';
import { panelSizes } from '../../tokens/sizing';

@Component({
  selector: 'lsd-workbench-shell-recipe',
  standalone: true,
  imports: [ButtonComponent, SurfaceComponent],
  templateUrl: './workbench-shell.component.html',
  styleUrl: './workbench-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchShellRecipeComponent {
  readonly id = input.required<string>();
  readonly navigationLabel = input('Primary navigation');
  readonly navigationTitle = input('Lake Shore Drive navigation');
  readonly contentLabel = input('Workbench content');
  readonly navigationOpen = model(false);
  /** Persistent desktop icon-rail state; bridges a composed `lsd-nav-menu`'s own `collapsed` model to this shell's sidebar width. */
  readonly navigationCollapsed = model(false);

  protected readonly stickyLayer = globalLayers.sticky;
  protected readonly overlayLayer = globalLayers.overlay;
  protected readonly scrimLayer = globalLayers.popover;
  protected readonly skipLayer = globalLayers.notification;
  protected readonly navigationCollapsedWidth = panelSizes['navigation-collapsed'];

  protected contentId(): string { return `${this.id()}-content`; }
  protected navigationId(): string { return `${this.id()}-navigation`; }

  protected openNavigation(): void { this.navigationOpen.set(true); }
  protected closeNavigation(): void { this.navigationOpen.set(false); }

  @HostListener('document:keydown.escape')
  protected closeNavigationFromKeyboard(): void {
    if (this.navigationOpen()) this.closeNavigation();
  }
}
