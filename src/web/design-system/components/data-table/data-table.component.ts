import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type DataTableAlignment = 'start' | 'center' | 'end';
export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableResponsiveMode = 'scroll' | 'cards';

export interface DataTableColumn<T> {
  readonly id: string;
  readonly header: string;
  readonly value: (row: T) => string | number | null | undefined;
  readonly align?: DataTableAlignment;
}

export interface DataTableRowAction<T, TAction = string> {
  readonly identity: TAction;
  readonly label: string;
  readonly disabled?: (row: T) => boolean;
}

export interface DataTableActionEvent<T, TAction = string> {
  readonly action: TAction;
  readonly row: T;
}

@Component({
  selector: 'lsd-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T, TAction = string> {
  readonly accessibleName = input.required<string>();
  readonly rows = input.required<readonly T[]>();
  readonly columns = input.required<readonly DataTableColumn<T>[]>();
  readonly rowKey = input.required<(row: T, index: number) => string | number>();
  readonly rowLabel = input.required<(row: T) => string>();
  readonly actions = input<readonly DataTableRowAction<T, TAction>[]>([]);
  readonly actionsLabel = input('Actions');
  readonly density = input<DataTableDensity>('comfortable');
  readonly responsiveMode = input<DataTableResponsiveMode>('scroll');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading data');
  readonly emptyMessage = input('No data available');
  readonly error = input<string | undefined>(undefined);

  readonly rowAction = output<DataTableActionEvent<T, TAction>>();

  protected keyFor(row: T, index: number): string | number { return this.rowKey()(row, index); }
  protected alignment(value: DataTableAlignment | undefined): string {
    return value === 'center' ? 'text-center' : value === 'end' ? 'text-right' : 'text-left';
  }
  protected actionDisabled(action: DataTableRowAction<T, TAction>, row: T): boolean {
    return action.disabled?.(row) ?? false;
  }
  protected activate(action: DataTableRowAction<T, TAction>, row: T): void {
    if (!this.actionDisabled(action, row)) this.rowAction.emit({ action: action.identity, row });
  }
}
