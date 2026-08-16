import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabItem, TabsComponent } from './tabs.component';
import { TabPanelDirective } from './tab-panel.directive';

type TestTab = 'overview' | 'sources' | 'history';

@Component({
  standalone: true,
  imports: [TabsComponent, TabPanelDirective],
  template: `
    <lsd-tabs id="details" label="Detail sections" [tabs]="tabs" [selected]="selected"
      (selectionChange)="selected = $event">
      <ng-template lsdTabPanel="overview">Overview panel</ng-template>
      <ng-template lsdTabPanel="sources">Sources panel</ng-template>
      <ng-template lsdTabPanel="history">History panel</ng-template>
    </lsd-tabs>
  `,
})
class TabsTestHostComponent {
  readonly tabs: readonly TabItem<TestTab>[] = [
    { identity: 'overview', label: 'Overview' },
    { identity: 'sources', label: 'Sources', disabled: true },
    { identity: 'history', label: 'History' },
  ];
  selected: TestTab = 'overview';
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TabsTestHostComponent>;
  let host: TabsTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TabsTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TabsTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const buttons = (): HTMLButtonElement[] =>
    fixture.debugElement.queryAll(By.css('[role="tab"]')).map((item) => item.nativeElement);

  it('connects the selected tab and panel with one roving tab stop', () => {
    expect(buttons().map((button) => button.tabIndex)).toEqual([0, -1, -1]);
    const panel = fixture.debugElement.query(By.css('[role="tabpanel"]')).nativeElement as HTMLElement;
    expect(panel.id).toBe('details-panel-0');
    expect(panel.getAttribute('aria-labelledby')).toBe('details-tab-0');
    expect(panel.textContent).toContain('Overview panel');
  });

  it('preserves typed identity on pointer selection', () => {
    buttons()[2].click(); fixture.detectChanges();
    expect(host.selected).toBe('history');
    expect(fixture.debugElement.query(By.css('[role="tabpanel"]')).nativeElement.textContent).toContain('History panel');
  });

  it('uses arrow keys with wrapping and skips disabled tabs', async () => {
    buttons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges(); await fixture.whenStable();
    expect(host.selected).toBe('history');
    expect(document.activeElement).toBe(buttons()[2]);

    buttons()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges(); await fixture.whenStable();
    expect(host.selected).toBe('overview');
  });

  it('supports Home and End navigation', () => {
    buttons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); fixture.detectChanges();
    expect(host.selected).toBe('history');
    buttons()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); fixture.detectChanges();
    expect(host.selected).toBe('overview');
  });
});
