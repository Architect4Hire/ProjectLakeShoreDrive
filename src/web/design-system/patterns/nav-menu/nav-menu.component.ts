import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IconComponent, type IconName } from '../../icons';
import { TooltipComponent } from '../../primitives/tooltip/tooltip.component';
import { TooltipTriggerDirective } from '../../primitives/tooltip/tooltip-trigger.directive';

export interface NavMenuItem {
  readonly id: string;
  readonly label: string;
  readonly routerLink: string | readonly string[];
  /** Falls back to the label's first letter when collapsed and no icon is supplied. */
  readonly iconName?: IconName;
  readonly children?: readonly NavMenuItem[];
}

export interface NavMenuGroup {
  readonly id: string;
  readonly label?: string;
  readonly items: readonly NavMenuItem[];
}

@Component({
  selector: 'lsd-nav-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, TooltipComponent, TooltipTriggerDirective],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  readonly accessibleName = input.required<string>();
  readonly groups = input.required<readonly NavMenuGroup[]>();
  /**
   * Persistent narrow icon-rail mode: labels hide (available via tooltip and
   * an sr-only span), icons/initials stay visible. Distinct from
   * workbench-shell's mobile open/closed overlay, which this component does
   * not know about - a consumer composes both independently.
   */
  readonly collapsed = model(false);
  readonly collapseToggleLabel = input('Collapse navigation');
  readonly expandToggleLabel = input('Expand navigation');
  readonly itemActivated = output<NavMenuItem>();

  protected readonly expandedItems = signal<ReadonlySet<string>>(new Set());

  protected isExpanded(item: NavMenuItem): boolean {
    return this.expandedItems().has(item.id);
  }

  protected toggleExpanded(item: NavMenuItem): void {
    const next = new Set(this.expandedItems());
    if (next.has(item.id)) next.delete(item.id);
    else next.add(item.id);
    this.expandedItems.set(next);
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }

  protected initialFor(item: NavMenuItem): string {
    return item.label.trim().charAt(0).toUpperCase();
  }

  protected activate(item: NavMenuItem): void {
    this.itemActivated.emit(item);
  }

  protected readonly toggleLabel = computed(() => (this.collapsed() ? this.expandToggleLabel() : this.collapseToggleLabel()));
}
