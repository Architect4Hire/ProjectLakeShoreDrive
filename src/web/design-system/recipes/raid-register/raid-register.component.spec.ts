import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RaidRegisterComponent, type RaidRegisterItem } from './raid-register.component';

@Component({ standalone: true, imports: [RaidRegisterComponent], template: `
  <lsd-raid-register accessibleName="Northwind RAID register" [items]="items" [actions]="actions"
    (itemAction)="selected = $event.action" />` })
class HostComponent {
  items: readonly RaidRegisterItem[] = [{
    id: 'RISK-007', type: 'risk', description: 'Vendor cutover may exceed the migration window',
    owner: 'Platform lead', severity: 'high', probability: 'medium', impact: 'critical', status: 'Open',
  }];
  actions = [{ identity: 'inspect' as const, label: 'Inspect' }];
  selected: 'inspect' | undefined;
}

describe('RaidRegisterComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent); fixture.detectChanges();
  });

  it('renders every required RAID field in a labeled compact table', () => {
    const headers = fixture.debugElement.queryAll(By.css('th')).map(x => x.nativeElement.textContent.trim());
    expect(headers).toEqual(['ID', 'Type', 'Description', 'Owner', 'Severity', 'Probability', 'Impact', 'Status', 'Actions']);
    const row = fixture.debugElement.query(By.css('tbody tr')).nativeElement.textContent;
    expect(row).toContain('RISK-007'); expect(row).toContain('Risk'); expect(row).toContain('Platform lead');
    expect(row).toContain('High'); expect(row).toContain('Medium'); expect(row).toContain('Critical'); expect(row).toContain('Open');
    expect(fixture.debugElement.query(By.css('table')).nativeElement.dataset.density).toBe('compact');
  });

  it('configures card adaptation for narrow screens', () => {
    const scroll = fixture.debugElement.query(By.css('.lsd-data-table__scroll')).nativeElement as HTMLElement;
    expect(scroll.dataset['responsive']).toBe('cards');
    expect(fixture.debugElement.query(By.css('.lsd-data-table__cards')).nativeElement.textContent).toContain('Vendor cutover');
  });

  it('forwards typed row actions with an item-specific accessible label', () => {
    const action = fixture.debugElement.query(By.css('tbody .lsd-data-table__actions button')).nativeElement as HTMLButtonElement;
    expect(action.getAttribute('aria-label')).toBe('Inspect: RISK-007: Vendor cutover may exceed the migration window');
    action.click(); fixture.detectChanges(); expect(fixture.componentInstance.selected).toBe('inspect');
  });
});
