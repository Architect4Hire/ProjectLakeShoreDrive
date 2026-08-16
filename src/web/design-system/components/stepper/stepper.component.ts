import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type StepState = 'incomplete' | 'complete' | 'error';

export interface StepperStep<T> {
  readonly identity: T;
  readonly label: string;
  readonly description?: string;
  readonly state?: StepState;
  /** Caller-owned eligibility; no workflow rules are inferred by the component. */
  readonly disabled?: boolean;
}

export type StepperCompareWith<T> = (left: T, right: T) => boolean;

@Component({
  selector: 'lsd-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent<T = string> {
  readonly label = input.required<string>();
  readonly steps = input.required<readonly StepperStep<T>[]>();
  readonly active = input.required<T>();
  readonly interactive = input(true);
  readonly compareWith = input<StepperCompareWith<T>>((left, right) => Object.is(left, right));

  readonly stepActivated = output<T>();

  protected readonly activeIndex = computed(() =>
    this.steps().findIndex((step) => this.compareWith()(step.identity, this.active())),
  );

  protected activate(step: StepperStep<T>): void {
    if (this.interactive() && !step.disabled) {
      this.stepActivated.emit(step.identity);
    }
  }

  protected isActive(index: number): boolean {
    return this.activeIndex() === index;
  }

  protected stateClass(step: StepperStep<T>, index: number): string {
    if (this.isActive(index)) {
      return 'lsd-stepper__marker--current border-accent-primary bg-accent-primary text-text-on-accent';
    }
    if (step.state === 'complete') {
      return 'lsd-stepper__marker--complete border-status-success bg-status-success text-text-on-success';
    }
    if (step.state === 'error') {
      return 'lsd-stepper__marker--error border-status-danger bg-status-danger text-text-on-danger';
    }
    return 'border-border-default bg-surface-raised text-text-muted';
  }

  protected stateLabel(step: StepperStep<T>, index: number): string {
    if (this.isActive(index)) return 'Current step';
    if (step.state === 'complete') return 'Completed';
    if (step.state === 'error') return 'Needs attention';
    return 'Not started';
  }
}
