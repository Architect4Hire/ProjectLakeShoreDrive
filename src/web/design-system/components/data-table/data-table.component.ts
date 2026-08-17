import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export type DataTableAlignment = 'start' | 'center' | 'end';
export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableResponsiveMode = 'scroll' | 'cards';
export type DataTableColumnKind = 'text' | 'identity' | 'chips';
export type DataTableActionsDisplay = 'inline' | 'menu';

export interface DataTableIdentity {
  readonly primary: string;
  readonly secondary?: string;
  readonly initials?: string;
}

export interface DataTableColumn<T> {
  readonly id: string;
  readonly header: string;
  readonly value: (row: T) => string | number | null | undefined;
  readonly align?: DataTableAlignment;
  /** Defaults to 'text'. 'identity' and 'chips' require the matching `identity`/`chips` accessor below. */
  readonly kind?: DataTableColumnKind;
  readonly identity?: (row: T) => DataTableIdentity;
  readonly chips?: (row: T) => readonly string[];
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
  /** 'inline' (default) renders every action as its own visible button; 'menu' collapses them into one popover trigger per row. */
  readonly actionsDisplay = input<DataTableActionsDisplay>('inline');
  readonly density = input<DataTableDensity>('comfortable');
  readonly responsiveMode = input<DataTableResponsiveMode>('scroll');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading data');
  readonly emptyMessage = input('No data available');
  readonly error = input<string | undefined>(undefined);

  /** Row selection is opt-in. `selectedRows` holds row keys (see `rowKey`), not row objects, so it survives row identity changes. */
  readonly selectable = input(false);
  readonly selectedRows = model<ReadonlySet<string | number>>(new Set());

  /**
   * Pagination is opt-in and supports both modes: omit `totalCount` for
   * client-side slicing of the full `rows()` array; provide it when the
   * caller already fetched only the current page, and this component will
   * render `rows()` as-is while still driving the footer UI from `page()`/
   * `pageSize()`/`totalCount()`.
   */
  readonly paginated = input(false);
  readonly page = model(1);
  readonly pageSize = model(10);
  readonly pageSizeOptions = input<readonly number[]>([10, 20, 50]);
  readonly totalCount = input<number | undefined>(undefined);

  readonly rowAction = output<DataTableActionEvent<T, TAction>>();

  /** Guarantees the current pageSize always has a matching <option>, even if the caller didn't include it in pageSizeOptions. */
  protected readonly effectivePageSizeOptions = computed(() => {
    const options = this.pageSizeOptions();
    return options.includes(this.pageSize()) ? options : [...options, this.pageSize()].sort((a, b) => a - b);
  });

  protected readonly totalItems = computed(() => this.totalCount() ?? this.rows().length);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  protected readonly isServerPaginated = computed(() => this.totalCount() !== undefined);

  protected readonly visibleRows = computed<readonly T[]>(() => {
    if (!this.paginated() || this.isServerPaginated()) return this.rows();
    const start = (this.page() - 1) * this.pageSize();
    return this.rows().slice(start, start + this.pageSize());
  });

  protected readonly pageRangeLabel = computed(() => {
    const total = this.totalItems();
    if (total === 0) return `0 of ${total}`;
    const start = (this.page() - 1) * this.pageSize() + 1;
    const end = Math.min(start + this.pageSize() - 1, total);
    return `${start}-${end} of ${total}`;
  });

  protected readonly allSelected = computed(
    () => this.rows().length > 0 && this.rows().every((row, index) => this.selectedRows().has(this.keyFor(row, index))),
  );
  protected readonly someSelected = computed(
    () => !this.allSelected() && this.rows().some((row, index) => this.selectedRows().has(this.keyFor(row, index))),
  );

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

  protected isRowSelected(row: T, index: number): boolean {
    return this.selectedRows().has(this.keyFor(row, index));
  }

  protected toggleRow(row: T, index: number): void {
    const key = this.keyFor(row, index);
    const next = new Set(this.selectedRows());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.selectedRows.set(next);
  }

  protected toggleAll(): void {
    this.selectedRows.set(this.allSelected() ? new Set() : new Set(this.rows().map((row, index) => this.keyFor(row, index))));
  }

  protected goToPage(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  protected onPageSizeChange(rawValue: string): void {
    const size = Number(rawValue);
    if (Number.isFinite(size) && size > 0) {
      this.pageSize.set(size);
      this.page.set(1);
    }
  }

  /**
   * Plain `[popover]` elements have no built-in anchoring, so without this
   * they render at the browser's default position (viewport top-left)
   * instead of near the trigger that opened them. `beforetoggle` fires
   * before the popover paints, so setting position here avoids a visible
   * jump. Uses viewport-relative coordinates because top-layer elements
   * position against the viewport regardless of DOM nesting.
   */
  protected positionActionsMenu(event: ToggleEvent, trigger: HTMLButtonElement): void {
    if (event.newState !== 'open') return;
    const menu = event.target as HTMLElement;
    const anchor = trigger.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.insetBlockStart = `${anchor.bottom + 4}px`;
    menu.style.insetInlineStart = `${anchor.left}px`;
  }

  protected identityFor(column: DataTableColumn<T>, row: T): DataTableIdentity | undefined {
    return column.identity?.(row);
  }

  protected chipsFor(column: DataTableColumn<T>, row: T): readonly string[] {
    return column.chips?.(row) ?? [];
  }

  protected initialsFor(identity: DataTableIdentity): string {
    return identity.initials ?? identity.primary.trim().charAt(0).toUpperCase();
  }
}
