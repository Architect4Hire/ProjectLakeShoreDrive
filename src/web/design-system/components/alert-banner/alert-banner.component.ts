import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export type AlertAnnouncement = 'polite' | 'assertive' | 'off';
export type AlertSeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'lsd-alert-banner',
  standalone: true,
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBannerComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly severity = input<AlertSeverity>('neutral');
  readonly announcement = input<AlertAnnouncement>('polite');
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Dismiss message');
  readonly visible = model(true);

  readonly dismissed = output<void>();

  protected readonly titleId = computed(() => `${this.id()}-title`);
  protected readonly bodyId = computed(() => `${this.id()}-body`);
  protected readonly role = computed(() =>
    this.announcement() === 'assertive' ? 'alert' : this.announcement() === 'polite' ? 'status' : 'group',
  );
  protected readonly live = computed(() =>
    this.announcement() === 'off' ? 'off' : this.announcement(),
  );
  protected readonly classes = computed(() =>
    ['lsd-alert-banner border', this.severityClasses[this.severity()]].join(' '),
  );
  protected readonly symbol = computed(() => this.symbols[this.severity()]);

  protected dismiss(): void {
    if (!this.dismissible()) return;
    this.visible.set(false);
    this.dismissed.emit();
  }

  private readonly severityClasses: Record<AlertSeverity, string> = {
    neutral: 'border-border-default bg-surface-raised text-text-primary',
    info: 'border-status-info bg-status-info/10 text-text-primary',
    success: 'border-status-success bg-status-success/10 text-text-primary',
    warning: 'border-status-warning bg-status-warning/10 text-text-primary',
    danger: 'border-status-danger bg-status-danger/10 text-text-primary',
  };

  private readonly symbols: Record<AlertSeverity, string> = {
    neutral: '•',
    info: 'i',
    success: '✓',
    warning: '!',
    danger: '!',
  };
}
