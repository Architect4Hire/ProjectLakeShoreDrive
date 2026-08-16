import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DataTableDensity = 'comfortable' | 'compact';

@Component({
  selector: 'lsd-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  readonly accessibleName = input.required<string>();
  readonly density = input<DataTableDensity>('comfortable');
}
