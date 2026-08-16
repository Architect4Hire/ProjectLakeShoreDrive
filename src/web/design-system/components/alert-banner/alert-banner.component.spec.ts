import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlertAnnouncement, AlertBannerComponent } from './alert-banner.component';

@Component({
  standalone: true,
  imports: [AlertBannerComponent],
  template: `
    <lsd-alert-banner id="save-error" title="Changes were not saved" severity="danger"
      [announcement]="announcement" dismissible (dismissed)="dismissCount += 1">
      Retry the operation when the connection returns.
      <div lsdAlertActions><button type="button">Retry</button></div>
    </lsd-alert-banner>
  `,
})
class AlertBannerTestHostComponent {
  announcement: AlertAnnouncement = 'assertive';
  dismissCount = 0;
}

describe('AlertBannerComponent', () => {
  let fixture: ComponentFixture<AlertBannerTestHostComponent>;
  let host: AlertBannerTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertBannerTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AlertBannerTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('announces urgent content with associated title and body', () => {
    const banner = fixture.debugElement.query(By.css('[role="alert"]')).nativeElement as HTMLElement;
    expect(banner.getAttribute('aria-live')).toBe('assertive');
    expect(banner.getAttribute('aria-labelledby')).toBe('save-error-title');
    expect(banner.getAttribute('aria-describedby')).toBe('save-error-body');
  });

  it('projects body and action composition', () => {
    expect(fixture.debugElement.query(By.css('.lsd-alert-banner__body')).nativeElement.textContent).toContain('Retry the operation');
    expect(fixture.debugElement.query(By.css('.lsd-alert-banner__actions button')).nativeElement.textContent).toContain('Retry');
  });

  it('supports polite status and non-announcing group semantics', () => {
    host.announcement = 'polite'; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).attributes['aria-live']).toBe('polite');
    host.announcement = 'off'; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="group"]')).attributes['aria-live']).toBe('off');
  });

  it('dismisses only through the named native control and emits once', () => {
    const dismiss = fixture.debugElement.query(By.css('.lsd-alert-banner__dismiss')).nativeElement as HTMLButtonElement;
    expect(dismiss.getAttribute('aria-label')).toBe('Dismiss message');
    dismiss.click(); fixture.detectChanges();
    expect(host.dismissCount).toBe(1);
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).toBeNull();
  });

  it('uses semantic danger styling without relying on the symbol alone', () => {
    const banner = fixture.debugElement.query(By.css('[role="alert"]')).nativeElement as HTMLElement;
    expect(banner.className).toContain('border-status-danger');
    expect(banner.className).toContain('bg-status-danger/10');
    expect(banner.textContent).toContain('Changes were not saved');
  });
});
