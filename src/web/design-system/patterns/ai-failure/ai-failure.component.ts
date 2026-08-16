import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { BadgeComponent } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';

export type AiFailureKind = 'recoverable' | 'terminal';
export type AiFailureAction = 'retry' | 'report' | 'copy-correlation';
export type CorrelationCopyState = 'idle' | 'copied' | 'failed';

export interface AiFailureReportReference {
  readonly kind: AiFailureKind;
  readonly correlationId?: string;
}

@Component({
  selector: 'lsd-ai-failure',
  standalone: true,
  imports: [AlertBannerComponent, BadgeComponent, ButtonComponent],
  templateUrl: './ai-failure.component.html',
  styleUrl: './ai-failure.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiFailureComponent {
  readonly id = input.required<string>();
  readonly kind = input<AiFailureKind>('recoverable');
  readonly message = input.required<string>();
  readonly retryAvailable = input(true);
  readonly detailsAvailable = input(false);
  readonly correlationVisible = input(false);
  readonly correlationId = input<string | undefined>(undefined);
  readonly copyCorrelationAvailable = input(false);
  readonly reportAvailable = input(false);
  readonly processing = input<AiFailureAction | null>(null);
  readonly copyState = input<CorrelationCopyState>('idle');

  readonly retryRequested = output<void>();
  readonly detailsToggled = output<boolean>();
  readonly reportRequested = output<AiFailureReportReference>();
  readonly correlationCopyRequested = output<string>();

  protected readonly title = computed(() =>
    this.kind() === 'terminal' ? 'AI operation could not complete' : 'AI operation encountered a problem',
  );
  protected readonly actionUnavailable = computed(() => this.processing() !== null);
  protected readonly canCopyCorrelation = computed(() =>
    this.correlationVisible() && this.copyCorrelationAvailable() && Boolean(this.correlationId()),
  );
  protected readonly copyAnnouncement = computed(() => {
    if (this.copyState() === 'copied') return 'Correlation identifier copied';
    if (this.copyState() === 'failed') return 'Correlation identifier was not copied';
    return null;
  });

  protected retry(): void {
    if (this.kind() === 'recoverable' && this.retryAvailable() && !this.actionUnavailable()) {
      this.retryRequested.emit();
    }
  }

  protected report(): void {
    if (this.reportAvailable() && !this.actionUnavailable()) {
      const correlationId = this.correlationVisible() ? this.correlationId() : undefined;
      this.reportRequested.emit({
        kind: this.kind(),
        ...(correlationId ? { correlationId } : {}),
      });
    }
  }

  protected copyCorrelation(): void {
    const correlationId = this.correlationId();
    if (this.canCopyCorrelation() && correlationId && !this.actionUnavailable()) {
      this.correlationCopyRequested.emit(correlationId);
    }
  }

  protected toggleDetails(event: Event): void {
    this.detailsToggled.emit((event.currentTarget as HTMLDetailsElement).open);
  }
}
