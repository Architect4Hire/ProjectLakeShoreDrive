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
    [rowLabel]="rowLabel" [actions]="actions" responsiveMode="cards" [loading]="loading" [error]="error"
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
});
