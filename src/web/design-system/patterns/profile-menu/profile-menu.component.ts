import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AppearanceService } from '../../foundations/appearance.service';
import { accentColorNames, type AccentColor } from '../../tokens/semantic-colors';

@Component({
  selector: 'lsd-profile-menu',
  standalone: true,
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly email = input<string | undefined>(undefined);
  readonly directionControlEnabled = input(true);

  protected readonly appearanceService = inject(AppearanceService);
  protected readonly accentColorNames = accentColorNames;

  protected initialFor(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  protected accentSwatchColor(color: AccentColor): string {
    return this.appearanceService.previewColorFor(color);
  }

  protected accentLabel(color: AccentColor): string {
    return color.charAt(0).toUpperCase() + color.slice(1);
  }

  /** See DataTableComponent.positionActionsMenu for why plain [popover] elements need this. */
  protected positionPanel(event: ToggleEvent, trigger: HTMLButtonElement): void {
    if (event.newState !== 'open') return;
    const panel = event.target as HTMLElement;
    const anchor = trigger.getBoundingClientRect();
    panel.style.position = 'fixed';
    panel.style.insetBlockStart = `${anchor.bottom + 4}px`;
    panel.style.insetInlineEnd = `${window.innerWidth - anchor.right}px`;
    panel.style.insetInlineStart = 'auto';
    panel.style.insetBlockEnd = 'auto';
  }
}
