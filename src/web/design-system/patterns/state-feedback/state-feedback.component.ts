import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AlertBannerComponent, AlertSeverity } from '../../components/alert-banner/alert-banner.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';

export type StateFeedbackKind = 'empty' | 'loading' | 'skeleton' | 'recoverable-error' | 'terminal-error';

@Component({
  selector: 'lsd-state-feedback',
  standalone: true,
  imports: [AlertBannerComponent, SurfaceComponent],
  templateUrl: './state-feedback.component.html',
  styleUrl: './state-feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFeedbackComponent {
  readonly id = input.required<string>();
  readonly kind = input.required<StateFeedbackKind>();
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly skeletonLines = input(3);

  protected readonly titleId = computed(() => `${this.id()}-title`);
  protected readonly descriptionId = computed(() => `${this.id()}-description`);
  protected readonly labelledBy = computed(() =>
    this.isError() ? `${this.id()}-alert-title` : this.titleId(),
  );
  protected readonly role = computed(() =>
    this.kind() === 'recoverable-error' || this.kind() === 'terminal-error' ? 'alert' : 'status',
  );
  protected readonly live = computed(() =>
    this.kind() === 'terminal-error' ? 'assertive' : 'polite',
  );
  protected readonly busy = computed(() =>
    this.kind() === 'loading' || this.kind() === 'skeleton' ? 'true' : null,
  );
  protected readonly errorSeverity = computed<AlertSeverity>(() =>
    this.kind() === 'terminal-error' ? 'danger' : 'warning',
  );
  protected readonly lines = computed(() =>
    Array.from({ length: Math.max(1, Math.min(10, Math.floor(this.skeletonLines()))) }),
  );
  protected readonly isError = computed(() =>
    this.kind() === 'recoverable-error' || this.kind() === 'terminal-error',
  );
}
