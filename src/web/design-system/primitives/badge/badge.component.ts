import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeSize = 'small' | 'medium';
export type BadgeVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ai-draft'
  | 'suggested'
  | 'approved'
  | 'deprecated'
  | 'archived';

@Component({
  selector: 'lsd-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly size = input<BadgeSize>('medium');
  /** Opt in only when a changing status must be announced immediately. */
  readonly announce = input(false);
  readonly accessibleLabel = input<string | undefined>(undefined);

  protected readonly classes = computed(() =>
    [
      'inline-flex max-w-full items-center gap-1.5 rounded-pill border font-semibold leading-none',
      this.sizeClasses[this.size()],
      this.variantClasses[this.variant()],
    ].join(' '),
  );

  private readonly sizeClasses: Record<BadgeSize, string> = {
    small: 'min-h-5 px-2 py-0.5 text-xs',
    medium: 'min-h-6 px-2.5 py-1 text-sm',
  };

  private readonly variantClasses: Record<BadgeVariant, string> = {
    neutral: 'border-border-default bg-surface-raised text-text-primary',
    info: 'border-status-info/40 bg-status-info/10 text-status-info',
    success: 'border-status-success/40 bg-status-success/10 text-status-success',
    warning: 'border-status-warning/40 bg-status-warning/10 text-status-warning',
    danger: 'border-status-danger/40 bg-status-danger/10 text-status-danger',
    'ai-draft': 'border-ai-draft-border bg-ai-draft-surface text-ai-draft-text',
    suggested: 'border-status-info/40 bg-status-info/10 text-status-info',
    approved: 'border-ai-approved-border bg-ai-approved-surface text-ai-approved-text',
    deprecated: 'border-status-danger/40 bg-status-danger/10 text-status-danger line-through',
    archived: 'border-border-default bg-surface-raised text-text-muted border-dashed',
  };
}
