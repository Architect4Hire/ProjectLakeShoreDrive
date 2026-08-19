import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  ButtonComponent,
  CheckboxComponent,
  DataTableActionEvent,
  DataTableColumn,
  DataTableComponent,
  DialogComponent,
  FilterActionBarComponent,
  InputComponent,
  SelectComponent,
  SelectOption,
} from '../../../design-system/public-api';
import { ApiError } from '../../core/http/api-error';
import { EngagementApiClient } from './data/engagement-api.client';
import { EngagementListItem, EngagementListQuery, EngagementStatus, SearchEngagementsQuery } from './data/engagement.models';
import { ENGAGEMENT_STATUS_LABELS } from './data/engagement-status';

type EngagementRowAction = 'open' | 'archive';

@Component({
  selector: 'lsd-engagements-list',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    DataTableComponent,
    DialogComponent,
    FilterActionBarComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './engagements-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementsListComponent {
  private readonly api = inject(EngagementApiClient);
  private readonly router = inject(Router);

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<EngagementStatus | null>(null);
  protected readonly includeArchived = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(25);

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly statusOptions: readonly SelectOption<EngagementStatus | null>[] = [
    { value: null, label: 'All statuses' },
    ...(Object.entries(ENGAGEMENT_STATUS_LABELS) as [EngagementStatus, string][]).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  private readonly requestParams = computed(() => {
    const searchText = this.debouncedSearchTerm().trim();
    const status = this.statusFilter() ?? undefined;
    const includeArchived = this.includeArchived();
    const page = this.page();
    const pageSize = this.pageSize();

    return searchText.length > 0
      ? ({ mode: 'search', searchText, status, includeArchived, page, pageSize } as const)
      : ({ mode: 'list', status, includeArchived, page, pageSize } as const);
  });

  protected readonly engagements = rxResource({
    params: () => this.requestParams(),
    stream: ({ params: { mode, ...query } }) =>
      mode === 'search' ? this.api.search(query as SearchEngagementsQuery) : this.api.list(query as EngagementListQuery),
  });

  // Resource.value() throws while the resource is in an error state, so every template read
  // goes through these guarded computeds instead of calling engagements.value() directly.
  protected readonly rows = computed(() => (this.engagements.hasValue() ? this.engagements.value().items : []));
  protected readonly totalCount = computed(() => (this.engagements.hasValue() ? this.engagements.value().totalCount : 0));

  protected readonly archiveTarget = signal<EngagementListItem | null>(null);
  protected readonly archiving = signal(false);
  protected readonly archiveErrorMessage = signal<string | undefined>(undefined);

  protected readonly columns: readonly DataTableColumn<EngagementListItem>[] = [
    {
      id: 'name',
      header: 'Engagement',
      kind: 'identity',
      value: (row) => row.name,
      identity: (row) => ({ primary: row.name, secondary: row.clientName }),
    },
    { id: 'type', header: 'Type', value: (row) => row.type },
    { id: 'status', header: 'Status', value: (row) => ENGAGEMENT_STATUS_LABELS[row.status] },
    { id: 'createdAtUtc', header: 'Created', value: (row) => new Date(row.createdAtUtc).toLocaleDateString() },
  ];

  protected readonly rowActions = [
    { identity: 'open' as EngagementRowAction, label: 'Open' },
    {
      identity: 'archive' as EngagementRowAction,
      label: 'Archive',
      disabled: (row: EngagementListItem) => row.status === 'Archived',
    },
  ];

  constructor() {
    // Debounced search resolving to a different result set should return to page 1; direct
    // filter changes reset page inline in their handlers below (a real event, not a derived
    // async value), so this effect covers only the async debounce case.
    effect(() => {
      this.debouncedSearchTerm();
      this.page.set(1);
    });
  }

  protected onStatusFilterChange(status: EngagementStatus | null): void {
    this.statusFilter.set(status);
    this.page.set(1);
  }

  protected onIncludeArchivedChange(value: boolean): void {
    this.includeArchived.set(value);
    this.page.set(1);
  }

  protected rowKey(row: EngagementListItem): string {
    return row.id;
  }

  protected rowLabel(row: EngagementListItem): string {
    return row.name;
  }

  protected onRowAction(event: DataTableActionEvent<EngagementListItem, EngagementRowAction>): void {
    if (event.action === 'open') {
      void this.router.navigate(['/engagements', event.row.id]);
      return;
    }

    this.archiveErrorMessage.set(undefined);
    this.archiveTarget.set(event.row);
  }

  protected createEngagement(): void {
    void this.router.navigate(['/engagements', 'new']);
  }

  protected cancelArchive(): void {
    this.archiveTarget.set(null);
  }

  protected confirmArchive(): void {
    const target = this.archiveTarget();
    if (!target) {
      return;
    }

    this.archiving.set(true);
    this.api.archive(target.id, { engagementId: target.id, performedBy: '' }).subscribe({
      next: () => {
        this.archiving.set(false);
        this.archiveTarget.set(null);
        this.engagements.reload();
      },
      error: (error: ApiError) => {
        this.archiving.set(false);
        this.archiveErrorMessage.set(error.message);
      },
    });
  }
}
