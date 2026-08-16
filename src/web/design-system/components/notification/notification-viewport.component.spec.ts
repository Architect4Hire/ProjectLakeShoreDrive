import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotificationService } from './notification.service';
import { NotificationViewportComponent } from './notification-viewport.component';

describe('NotificationViewportComponent', () => {
  let fixture: ComponentFixture<NotificationViewportComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NotificationViewportComponent] }).compileComponents();
    service = TestBed.inject(NotificationService);
    service.clear();
    fixture = TestBed.createComponent(NotificationViewportComponent);
  });

  it('renders assertive notifications with atomic accessible associations', () => {
    service.notify({ title: 'Save failed', message: 'Try again.', severity: 'danger', announcement: 'assertive' });
    fixture.detectChanges();
    const notification = fixture.debugElement.query(By.css('[role="alert"]')).nativeElement as HTMLElement;
    expect(notification.getAttribute('aria-live')).toBe('assertive');
    expect(notification.getAttribute('aria-atomic')).toBe('true');
    expect(notification.getAttribute('aria-labelledby')).toContain('-title');
    expect(notification.className).toContain('border-status-danger');
  });

  it('invokes a typed action and dismisses by default', () => {
    const action = jasmine.createSpy('action');
    service.notify({ title: 'Draft ready', message: 'Review it.', action: { label: 'Review', invoke: action } });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.lsd-notification__action')).nativeElement.click(); fixture.detectChanges();
    expect(action).toHaveBeenCalled();
    expect(service.notifications()).toEqual([]);
  });

  it('provides a named dismiss control', () => {
    service.notify({ title: 'Saved', message: 'All changes saved.' }); fixture.detectChanges();
    const dismiss = fixture.debugElement.query(By.css('.lsd-notification__dismiss')).nativeElement as HTMLButtonElement;
    expect(dismiss.getAttribute('aria-label')).toBe('Dismiss Saved');
    dismiss.click(); fixture.detectChanges();
    expect(service.notifications()).toEqual([]);
  });
});
