import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lsd-state-details',
  standalone: true,
  template: `
    <details class="lsd-state-details">
      <summary class="lsd-state-details__summary">{{ label() }}</summary>
      <div class="lsd-state-details__content"><ng-content /></div>
    </details>
  `,
  styles: `
    :host { display: block; inline-size: 100%; }
    .lsd-state-details { border-block-start: 0.0625rem solid var(--lsd-color-border-default); padding-block-start: 0.75rem; }
    .lsd-state-details__summary { color: var(--lsd-color-text-muted); cursor: pointer; font-weight: 600; }
    .lsd-state-details__content { color: var(--lsd-color-text-muted); margin-block-start: 0.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFeedbackDetailsComponent {
  readonly label = input('Show details');
}
