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
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
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
      bold: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
      light: 'bg-primary/20 text-primary hover:bg-primary/30 focus-visible:ring-primary',
      minimal: 'bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-primary',
    },
    danger: {
      bold: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      light: 'bg-destructive/20 text-destructive hover:bg-destructive/30 focus-visible:ring-destructive',
      minimal: 'bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive',
    },
    success: {
      bold: 'bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success',
      light: 'bg-success/20 text-success hover:bg-success/30 focus-visible:ring-success',
      minimal: 'bg-transparent text-success hover:bg-success/10 focus-visible:ring-success',
    },
    warning: {
      bold: 'bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning',
      light: 'bg-warning/20 text-warning hover:bg-warning/30 focus-visible:ring-warning',
      minimal: 'bg-transparent text-warning hover:bg-warning/10 focus-visible:ring-warning',
    },
    info: {
      bold: 'bg-info text-info-foreground hover:bg-info/90 focus-visible:ring-info',
      light: 'bg-info/20 text-info hover:bg-info/30 focus-visible:ring-info',
      minimal: 'bg-transparent text-info hover:bg-info/10 focus-visible:ring-info',
    },
    neutral: {
      bold: 'bg-muted text-foreground hover:bg-muted/90 focus-visible:ring-muted',
      light: 'bg-muted/40 text-foreground hover:bg-muted/60 focus-visible:ring-muted',
      minimal: 'bg-transparent text-muted-foreground hover:bg-muted/40 focus-visible:ring-muted',
    },
  };
}
