import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';

export type AiGenerationState = 'generating' | 'cancelling' | 'cancelled' | 'completed' | 'failed';
export type AiProgressMode = 'indeterminate' | 'determinate';

@Component({
  selector: 'lsd-ai-generation-progress',
  standalone: true,
  imports: [AlertBannerComponent, BadgeComponent, ButtonComponent, SurfaceComponent],
  templateUrl: './ai-generation-progress.component.html',
  styleUrl: './ai-generation-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiGenerationProgressComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly state = input<AiGenerationState>('generating');
  readonly mode = input<AiProgressMode>('indeterminate');
  readonly value = input(0);
  readonly max = input(100);
  readonly progressLabel = input('Generating AI draft');
  /** Caller-controlled milestone text. Update sparingly to avoid excessive announcements. */
  readonly announcement = input<string | null>(null);
  readonly cancellable = input(true);
  readonly cancelLabel = input('Cancel generation');
  readonly failureMessage = input('Generation did not complete. Existing approved content is unchanged.');

  readonly cancelRequested = output<void>();

  protected readonly active = computed(() => this.state() === 'generating' || this.state() === 'cancelling');
  protected readonly normalizedMax = computed(() => Math.max(1, this.finite(this.max(), 100)));
  protected readonly normalizedValue = computed(() =>
    Math.min(this.normalizedMax(), Math.max(0, this.finite(this.value(), 0))),
  );
  protected readonly percentage = computed(() =>
    Math.round((this.normalizedValue() / this.normalizedMax()) * 100),
  );
  protected readonly statePresentation = computed(() => this.presentations[this.state()]);
  protected readonly statusText = computed(() => {
    if (this.mode() === 'determinate' && this.state() === 'generating') {
      return `${this.progressLabel()}: ${this.percentage()}%`;
    }
    return this.statePresentation().status;
  });

  protected requestCancel(): void {
    if (this.cancellable() && this.state() === 'generating') this.cancelRequested.emit();
  }

  private finite(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
  }

  private readonly presentations: Record<AiGenerationState, Readonly<{ badge: string; status: string; variant: BadgeVariant }>> = {
    generating: { badge: 'AI generating', status: 'Generating AI draft', variant: 'ai-draft' },
    cancelling: { badge: 'Cancelling', status: 'Cancelling AI generation', variant: 'warning' },
    cancelled: { badge: 'Cancelled', status: 'AI generation cancelled', variant: 'neutral' },
    completed: { badge: 'Generated', status: 'AI draft generated; review required', variant: 'ai-draft' },
    failed: { badge: 'Failed', status: 'AI generation failed', variant: 'danger' },
  };
}
