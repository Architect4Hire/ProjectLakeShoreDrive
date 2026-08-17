import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'lsd-engagement-phase-placeholder',
  standalone: true,
  template: `
    <p class="text-sm text-text-secondary">{{ phaseLabel() }} is not yet implemented.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementPhasePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly phaseLabel = toSignal(
    this.route.data.pipe(map((data) => (data['phaseLabel'] as string | undefined) ?? 'This phase')),
    { initialValue: (this.route.snapshot.data['phaseLabel'] as string | undefined) ?? 'This phase' },
  );
}
