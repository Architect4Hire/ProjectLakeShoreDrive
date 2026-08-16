import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { iconPaths, type IconName } from './internal/icon-paths';

export type IconAccessibility =
  | Readonly<{ mode: 'decorative' }>
  | Readonly<{ mode: 'informative'; label: string }>;
export type IconSize = 'small' | 'medium' | 'large';
export type IconTone = 'current' | 'primary' | 'muted' | 'success' | 'warning' | 'danger' | 'info';

const decorativeIcon: IconAccessibility = { mode: 'decorative' };

@Component({
  selector: 'lsd-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<IconSize>('medium');
  readonly tone = input<IconTone>('current');
  readonly accessibility = input<IconAccessibility>(decorativeIcon);

  protected readonly path = computed(() => iconPaths[this.name()]);
  protected readonly informative = computed(() => this.accessibility().mode === 'informative');
  protected readonly label = computed(() => {
    const accessibility = this.accessibility();
    return accessibility.mode === 'informative' ? accessibility.label : null;
  });
  protected readonly classes = computed(() =>
    ['lsd-icon', this.sizeClasses[this.size()], this.toneClasses[this.tone()]].join(' '),
  );

  private readonly sizeClasses: Record<IconSize, string> = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };

  private readonly toneClasses: Record<IconTone, string> = {
    current: 'text-current',
    primary: 'text-accent-primary',
    muted: 'text-text-muted',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
    info: 'text-status-info',
  };
}
