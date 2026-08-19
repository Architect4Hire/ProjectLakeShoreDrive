import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ButtonComponent, DialogComponent, TextareaComponent } from '../../../../design-system/public-api';
import { ApiErrorException } from '../../../core/http/api-error';
import { EngagementApiClient } from '../data/engagement-api.client';
import { LIFECYCLE_SEQUENCE, allowedTransitionsFrom, blockedTransitionReason } from '../data/engagement-status';
import { EngagementDetail, EngagementStatus } from '../data/engagement.models';

interface TransitionOption {
  readonly status: EngagementStatus;
  readonly allowed: boolean;
  readonly reason: string | undefined;
}

// Mounted in the overview's "Current phase" card. Mirrors the server's lifecycle policy for
// instant UI feedback (BR-022) but never decides on its own: the confirm handler is the only
// path that calls the API, and a 422 response re-derives what's actually allowed from the
// server, not from this component's own guess.
@Component({
  selector: 'lsd-engagement-phase-transition',
  standalone: true,
  imports: [ButtonComponent, DialogComponent, TextareaComponent],
  templateUrl: './engagement-phase-transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementPhaseTransitionComponent {
  private readonly api = inject(EngagementApiClient);

  readonly engagement = input.required<EngagementDetail>();
  readonly transitioned = output<EngagementDetail>();

  protected readonly pendingTarget = signal<EngagementStatus | null>(null);
  protected readonly reason = signal('');
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly concurrencyConflict = signal(false);

  // Re-synced from the server's 422 response when it disagrees with this local derivation.
  private readonly serverAllowedOverride = signal<readonly EngagementStatus[] | undefined>(undefined);

  protected readonly transitionOptions = computed<readonly TransitionOption[]>(() => {
    const current = this.engagement().status;
    const allowed = this.serverAllowedOverride() ?? allowedTransitionsFrom(current);

    return LIFECYCLE_SEQUENCE.filter((status) => status !== current).map((status) => ({
      status,
      allowed: allowed.includes(status),
      reason: allowed.includes(status) ? undefined : blockedTransitionReason(current, status),
    }));
  });

  protected readonly dialogOpen = computed(() => this.pendingTarget() !== null);
  protected readonly isArchiveTarget = computed(() => this.pendingTarget() === 'Archived');

  protected requestTransition(target: EngagementStatus): void {
    this.errorMessage.set(undefined);
    this.concurrencyConflict.set(false);
    this.reason.set('');
    this.pendingTarget.set(target);
  }

  protected cancel(): void {
    if (this.submitting()) {
      return;
    }
    this.pendingTarget.set(null);
  }

  // The ONLY code path allowed to call the API: no effect, resource, or automatic trigger may
  // invoke transitionPhase/archive (restriction: no AI/automatic phase transitions).
  protected confirm(): void {
    const target = this.pendingTarget();
    if (!target) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(undefined);
    this.concurrencyConflict.set(false);

    const engagementId = this.engagement().id;
    const reason = this.reason().trim() || undefined;

    const request$ =
      target === 'Archived'
        ? this.api.archive(engagementId, { engagementId, performedBy: '', reason })
        : this.api.transitionPhase(engagementId, { engagementId, targetStatus: target, performedBy: '', reason });

    request$.subscribe({
      next: (detail) => {
        this.submitting.set(false);
        this.pendingTarget.set(null);
        this.serverAllowedOverride.set(undefined);
        this.transitioned.emit(detail);
      },
      error: (error: ApiErrorException) => this.handleError(error),
    });
  }

  private handleError(error: ApiErrorException): void {
    this.submitting.set(false);

    if (error.kind === 'lifecycleConflict') {
      this.serverAllowedOverride.set(error.allowedTransitions as readonly EngagementStatus[] | undefined);
      this.errorMessage.set(error.message);
      return;
    }

    if (error.kind === 'concurrencyConflict') {
      this.concurrencyConflict.set(true);
      this.errorMessage.set(error.message);
      return;
    }

    if (error.kind === 'forbidden') {
      this.errorMessage.set("You don't have permission to change this engagement's phase.");
      return;
    }

    this.errorMessage.set(error.message);
  }
}
