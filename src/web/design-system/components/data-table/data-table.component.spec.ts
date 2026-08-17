import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataTableColumn, DataTableComponent, DataTableRowAction } from './data-table.component';

interface Row { id: number; name: string; status: string; }
type Action = 'open' | 'remove';

@Component({
  standalone: true,
  imports: [DataTableComponent],
  template: `<lsd-data-table accessibleName="Items" [rows]="rows" [columns]="columns" [rowKey]="rowKey"
    [rowLabel]="rowLabel" [actions]="actions" [actionsDisplay]="actionsDisplay" responsiveMode="cards"
    [loading]="loading" [error]="error" [selectable]="selectable" [(selectedRows)]="selectedRows"
    [paginated]="paginated" [pageSize]="pageSize"
    (rowAction)="lastAction = $event.action" />`,
})
class DataTableTestHostComponent {
  rows: readonly Row[] = [{ id: 1, name: 'Alpha', status: 'Ready' }];
  readonly columns: readonly DataTableColumn<Row>[] = [
    { id: 'name', header: 'Name', value: (row) => row.name },
    { id: 'status', header: 'Status', value: (row) => row.status, align: 'end' },
  ];
  readonly actions: readonly DataTableRowAction<Row, Action>[] = [
    { identity: 'open', label: 'Open' },
    { identity: 'remove', label: 'Remove', disabled: (row) => row.status === 'Ready' },
  ];
  readonly rowKey = (row: Row) => row.id;
  readonly rowLabel = (row: Row) => row.name;
  loading = false;
  error: string | undefined;
  lastAction: Action | undefined;
  actionsDisplay: 'inline' | 'menu' = 'inline';
  selectable = false;
  selectedRows: ReadonlySet<string | number> = new Set();
  paginated = false;
  pageSize = 10;
}

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableTestHostComponent>;
  let host: DataTableTestHostComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DataTableTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DataTableTestHostComponent); host = fixture.componentInstance; fixture.detectChanges();
  });
  it('renders typed columns, values, caption, and column headers', () => {
    expect(fixture.debugElement.query(By.css('caption')).nativeElement.textContent).toContain('Items');
    expect(fixture.debugElement.queryAll(By.css('th[scope="col"]')).length).toBe(3);
    expect(fixture.debugElement.query(By.css('tbody')).nativeElement.textContent).toContain('Alpha');
  });
  it('emits typed native row actions with contextual names', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tbody button'));
    expect(buttons[0].nativeElement.getAttribute('aria-label')).toBe('Open: Alpha');
    buttons[0].nativeElement.click(); expect(host.lastAction).toBe('open');
    expect(buttons[1].nativeElement.disabled).toBeTrue();
  });
  it('prioritizes error, loading, and empty states', () => {
    host.loading = true; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Loading data');
    host.error = 'Network unavailable'; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain('Network unavailable');
    host.error = undefined; host.loading = false; host.rows = []; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('No data available');
  });
  it('provides focused scrolling and the card escape hatch', () => {
    const scroll = fixture.debugElement.query(By.css('.lsd-data-table__scroll')).nativeElement as HTMLElement;
    expect(scroll.tabIndex).toBe(0); expect(scroll.dataset['responsive']).toBe('cards');
    expect(fixture.debugElement.queryAll(By.css('.lsd-data-table__card')).length).toBe(1);
  });

  it('adds a selection column only when selectable, and toggles select-all', () => {
    expect(fixture.debugElement.queryAll(By.css('.lsd-data-table__select-column')).length).toBe(0);

    host.selectable = true;
    host.rows = [{ id: 1, name: 'Alpha', status: 'Ready' }, { id: 2, name: 'Beta', status: 'Ready' }];
    fixture.detectChanges();
    const headerCheckbox = fixture.debugElement.query(By.css('thead input[type="checkbox"]')).nativeElement as HTMLInputElement;
    expect(fixture.debugElement.queryAll(By.css('tbody input[type="checkbox"]')).length).toBe(2);

    headerCheckbox.click();
    fixture.detectChanges();
    expect(host.selectedRows.size).toBe(2);
    expect(host.selectedRows.has(1)).toBeTrue();
  });

  it('slices rows client-side when paginated, and drives the footer from page/pageSize', () => {
    host.rows = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}`, status: 'Ready' }));
    host.paginated = true;
    host.pageSize = 3;
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('tbody tr')).length).toBe(3);
    expect(fixture.debugElement.query(By.css('.lsd-data-table__page-range')).nativeElement.textContent).toContain('1-3 of 7');

    const nextButton = fixture.debugElement.query(By.css('[aria-label="Next page"]')).nativeElement as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('tbody')).nativeElement.textContent).toContain('Row 4');
    expect(fixture.debugElement.query(By.css('tbody')).nativeElement.textContent).not.toContain('Row 1');
  });

  it('collapses row actions into a popover trigger when actionsDisplay is menu', () => {
    host.actionsDisplay = 'menu';
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.lsd-data-table__actions-trigger')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('tbody > tr td.lsd-data-table__actions > button.rounded-control.text-sm')).length).toBe(0);
  });
});

interface IdentityRow { id: number; name: string; team: string; tags: readonly string[]; }

@Component({
  standalone: true,
  imports: [DataTableComponent],
  template: `<lsd-data-table accessibleName="People" [rows]="rows" [columns]="columns" [rowKey]="rowKey" [rowLabel]="rowLabel" />`,
})
class DataTableColumnKindHostComponent {
  rows: readonly IdentityRow[] = [{ id: 1, name: 'Jamie Ortiz', team: 'Architect Team', tags: ['approved', 'phase-2'] }];
  readonly columns: readonly DataTableColumn<IdentityRow>[] = [
    { id: 'name', header: 'Name', value: (row) => row.name, kind: 'identity', identity: (row) => ({ primary: row.name, secondary: row.team }) },
    { id: 'tags', header: 'Tags', value: (row) => row.tags.join(', '), kind: 'chips', chips: (row) => row.tags },
  ];
  readonly rowKey = (row: IdentityRow) => row.id;
  readonly rowLabel = (row: IdentityRow) => row.name;
}

describe('DataTableComponent column kinds', () => {
  let fixture: ComponentFixture<DataTableColumnKindHostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DataTableColumnKindHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DataTableColumnKindHostComponent);
    fixture.detectChanges();
  });

  it('renders an identity cell with initials derived from the primary name', () => {
    const avatar = fixture.debugElement.query(By.css('.lsd-data-table__identity-avatar'));
    expect(avatar.nativeElement.textContent.trim()).toBe('J');
    expect(fixture.debugElement.query(By.css('.lsd-data-table__identity-secondary')).nativeElement.textContent).toContain('Architect Team');
  });

  it('renders a chips cell with one chip per array entry', () => {
    expect(fixture.debugElement.queryAll(By.css('.lsd-data-table__chip')).length).toBe(2);
  });
});
