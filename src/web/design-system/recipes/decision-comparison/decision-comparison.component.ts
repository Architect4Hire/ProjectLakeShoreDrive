import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { BadgeComponent, type BadgeVariant, SurfaceComponent } from '../../primitives';
import { SplitViewComponent, type SplitViewPane, type SplitViewRatio } from '../../patterns';

export type DecisionComparisonKind = 'current-proposed' | 'historical-new';
export interface DecisionComparisonPane { readonly id: string; readonly label: string; readonly status?: { readonly label: string; readonly variant: BadgeVariant }; readonly changedBy?: string; readonly changedAt?: string; }
export interface DecisionComparisonViewModel { readonly title: string; readonly kind: DecisionComparisonKind; readonly left: DecisionComparisonPane; readonly right: DecisionComparisonPane; }

@Component({ selector: 'lsd-decision-comparison', standalone: true, imports: [BadgeComponent, SplitViewComponent, SurfaceComponent], templateUrl: './decision-comparison.component.html', styleUrl: './decision-comparison.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class DecisionComparisonComponent {
  readonly id = input.required<string>(); readonly comparison = input.required<DecisionComparisonViewModel>();
  readonly ratio = input<SplitViewRatio>('balanced'); readonly compactPane = model<SplitViewPane>('output');
}
