import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MasterDetailComponent } from './master-detail.component';
import { MasterDetailTriggerDirective } from './master-detail-trigger.directive';

@Component({
  standalone: true,
  imports: [MasterDetailComponent, MasterDetailTriggerDirective],
  template: `
    <lsd-master-detail
      #layout
      id="record-browser"
      masterLabel="Architecture records"
      detailLabel="Selected record"
      [(view)]="view">
      <nav lsdMasterDetailMaster>
        <button lsdMasterDetailTrigger type="button" (detailRequested)="layout.openDetail($event)">Record one</button>
      </nav>
      <article lsdMasterDetailDetail>Record detail</article>
    </lsd-master-detail>
  `,
})
class MasterDetailTestHostComponent {
  view: 'master' | 'detail' = 'master';
}

describe('MasterDetailComponent', () => {
  let fixture: ComponentFixture<MasterDetailTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MasterDetailTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(MasterDetailTestHostComponent);
    fixture.detectChanges();
  });

  it('projects labeled master and detail regions in desktop order', () => {
    const regions = fixture.debugElement.queryAll(By.css('[role="region"]'));
    expect(regions.map((item) => item.nativeElement.getAttribute('aria-label')))
      .toEqual(['Architecture records', 'Selected record']);
    expect(regions[0].nativeElement.textContent).toContain('Record one');
    expect(regions[1].nativeElement.textContent).toContain('Record detail');
  });

  it('opens the focused detail view and moves focus from its trigger', fakeAsync(() => {
    const trigger = fixture.debugElement.query(By.directive(MasterDetailTriggerDirective)).nativeElement as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    tick();
    const shell = fixture.debugElement.query(By.css('.lsd-master-detail')).nativeElement as HTMLElement;
    const detail = fixture.debugElement.query(By.css('.lsd-master-detail__detail')).nativeElement as HTMLElement;
    expect(shell.dataset['view']).toBe('detail');
    expect(document.activeElement).toBe(detail);
  }));

  it('returns to the master view and restores the originating trigger', fakeAsync(() => {
    const trigger = fixture.debugElement.query(By.directive(MasterDetailTriggerDirective)).nativeElement as HTMLButtonElement;
    trigger.click(); fixture.detectChanges(); tick();
    const back = fixture.debugElement.query(By.css('.lsd-master-detail__back button')).nativeElement as HTMLButtonElement;
    back.click(); fixture.detectChanges(); tick();
    expect(fixture.componentInstance.view).toBe('master');
    expect(document.activeElement).toBe(trigger);
  }));
});
