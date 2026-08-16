import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonImpact = 'bold' | 'light' | 'minimal';
export type ButtonShape = 'square' | 'rounded' | 'pill';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonTone = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'lsd-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly impact = input<ButtonImpact>('bold');
  readonly shape = input<ButtonShape>('rounded');
  readonly size = input<ButtonSize>('medium');
  readonly tone = input<ButtonTone>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly pressed = input<boolean | undefined>(undefined);

  readonly activated = output<void>();

  protected readonly classes = computed(() =>
    [
      'inline-flex items-center justify-center font-semibold',
      this.sizeClasses[this.size()],
      this.shapeClasses[this.shape()],
      this.impactClasses[this.tone()][this.impact()],
      this.fullWidth() ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  private readonly sizeClasses: Record<ButtonSize, string> = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-5 py-2 text-sm',
    large: 'px-7 py-2.5 text-lg',
  };

  private readonly shapeClasses: Record<ButtonShape, string> = {
    square: 'rounded-none',
    rounded: 'rounded-lg',
    pill: 'rounded-full',
  };

  private readonly impactClasses: Record<ButtonTone, Record<ButtonImpact, string>> = {
    primary: {
      bold: 'bg-accent-primary text-text-on-accent hover:bg-accent-primary/90',
      light: 'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30',
      minimal: 'bg-transparent text-accent-primary hover:bg-accent-primary/10',
    },
    danger: {
      bold: 'bg-status-danger text-text-on-danger hover:bg-status-danger/90',
      light: 'bg-status-danger/20 text-status-danger hover:bg-status-danger/30',
      minimal: 'bg-transparent text-status-danger hover:bg-status-danger/10',
    },
    success: {
      bold: 'bg-status-success text-text-on-success hover:bg-status-success/90',
      light: 'bg-status-success/20 text-status-success hover:bg-status-success/30',
      minimal: 'bg-transparent text-status-success hover:bg-status-success/10',
    },
    warning: {
      bold: 'bg-status-warning text-text-on-warning hover:bg-status-warning/90',
      light: 'bg-status-warning/20 text-status-warning hover:bg-status-warning/30',
      minimal: 'bg-transparent text-status-warning hover:bg-status-warning/10',
    },
    info: {
      bold: 'bg-status-info text-text-on-info hover:bg-status-info/90',
      light: 'bg-status-info/20 text-status-info hover:bg-status-info/30',
      minimal: 'bg-transparent text-status-info hover:bg-status-info/10',
    },
    neutral: {
      bold: 'bg-surface-raised text-text-primary hover:bg-surface-raised/90',
      light: 'bg-surface-raised/40 text-text-primary hover:bg-surface-raised/60',
      minimal: 'bg-transparent text-text-muted hover:bg-surface-raised/40',
    },
  };
}
