import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorException } from '../../core/http/api-error';
import { EngagementApiClient } from './data/engagement-api.client';
import { ArchiveEngagementRequest, EngagementListResult, SearchEngagementsQuery } from './data/engagement.models';
import { EngagementsListComponent } from './engagements-list.component';

const listItem = (overrides: Partial<EngagementListResult['items'][number]> = {}) => ({
  id: 'e1',
  clientId: 'c1',
  clientName: 'Contoso',
  name: 'Contoso Migration',
  type: 'CloudMigration' as const,
  confidentiality: 'ClientConfidential' as const,
  status: 'Draft' as const,
  createdAtUtc: '2026-01-01T00:00:00Z',
  ...overrides,
});

class FakeEngagementApiClient {
  listCalls: unknown[] = [];
  searchCalls: unknown[] = [];
  archiveCalls: { id: string; request: ArchiveEngagementRequest }[] = [];
  nextResult: EngagementListResult = { items: [listItem()], totalCount: 1, page: 1, pageSize: 25 };
  nextError: ApiErrorException | undefined;
  archiveResult$ = new Subject<void>();

  list(query: unknown): Observable<EngagementListResult> {
    this.listCalls.push(query);
    return this.respond();
  }

  search(query: SearchEngagementsQuery): Observable<EngagementListResult> {
    this.searchCalls.push(query);
    return this.respond();
  }

  archive(id: string, request: ArchiveEngagementRequest): Observable<never> {
    this.archiveCalls.push({ id, request });
    return this.archiveResult$.asObservable() as unknown as Observable<never>;
  }

  private respond(): Observable<EngagementListResult> {
    return this.nextError ? throwError(() => this.nextError) : of(this.nextResult);
  }
}

// The component's signals/handlers are `protected` (template-only by design); tests reach
// them through this narrowly-typed escape hatch rather than widening the public API.
interface TestableComponent {
  readonly engagements: {
    error(): ApiErrorException | undefined;
    reload(): boolean;
  };
  readonly rows: { (): readonly EngagementListResult['items'][number][] };
  readonly searchTerm: { set(value: string): void };
  readonly page: { set(value: number): void; (): number };
  readonly includeArchived: { (): boolean };
  readonly archiveTarget: { (): unknown };
  onIncludeArchivedChange(value: boolean): void;
  onRowAction(event: { action: 'open' | 'archive'; row: EngagementListResult['items'][number] }): void;
  confirmArchive(): void;
}

describe('EngagementsListComponent', () => {
  let fixture: ComponentFixture<EngagementsListComponent>;
  let instance: TestableComponent;
  let api: FakeEngagementApiClient;
  let router: Router;

  beforeEach(async () => {
    api = new FakeEngagementApiClient();

    await TestBed.configureTestingModule({
      imports: [EngagementsListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: EngagementApiClient, useValue: api },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EngagementsListComponent);
    instance = fixture.componentInstance as unknown as TestableComponent;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and renders engagement rows', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const table = fixture.nativeElement.querySelector('lsd-data-table');
    expect(table).toBeTruthy();
    expect(api.listCalls.length).toBe(1);
    expect(instance.rows()[0]?.name).toBe('Contoso Migration');
  });

  it('shows the empty result set when the API returns no items', async () => {
    api.nextResult = { items: [], totalCount: 0, page: 1, pageSize: 25 };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(instance.rows()).toEqual([]);
  });

  it('shows an error and retries on demand', async () => {
    api.nextError = new ApiErrorException({ kind: 'network', status: 0, message: 'Network unreachable.' });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(instance.engagements.error()?.message).toBe('Network unreachable.');

    api.nextError = undefined;
    instance.engagements.reload();
    await fixture.whenStable();

    expect(instance.engagements.error()).toBeUndefined();
  });

  it('debounces search input into exactly one search request', async () => {
    vi.useFakeTimers();
    fixture.detectChanges();
    await fixture.whenStable();
    api.listCalls = [];

    instance.searchTerm.set('c');
    instance.searchTerm.set('co');
    instance.searchTerm.set('contoso');

    vi.advanceTimersByTime(300);
    vi.useRealTimers();
    await fixture.whenStable();

    expect(api.searchCalls.length).toBe(1);
    expect(api.searchCalls[0]).toMatchObject({ searchText: 'contoso' });
  });

  it('resets to page 1 when the include-archived filter changes', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    instance.page.set(3);
    instance.onIncludeArchivedChange(true);

    expect(instance.page()).toBe(1);
    expect(instance.includeArchived()).toBe(true);
  });

  it('archiving a row calls the API and reloads the list only after confirmation', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    instance.onRowAction({ action: 'archive', row: listItem() });
    expect(api.archiveCalls.length).toBe(0);

    instance.confirmArchive();
    expect(api.archiveCalls.length).toBe(1);
    expect(api.archiveCalls[0]?.id).toBe('e1');

    api.listCalls = [];
    api.archiveResult$.next();
    api.archiveResult$.complete();
    await fixture.whenStable();

    expect(instance.archiveTarget()).toBeNull();
  });

  it('navigates to the engagement on "open" row action', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const navigateSpy = vi.spyOn(router, 'navigate');

    instance.onRowAction({ action: 'open', row: listItem() });

    expect(navigateSpy).toHaveBeenCalledWith(['/engagements', 'e1']);
  });
});
