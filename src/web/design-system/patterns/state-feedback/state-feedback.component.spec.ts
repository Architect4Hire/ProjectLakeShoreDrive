import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from '../../primitives/button/button.component';
import { StateFeedbackComponent, StateFeedbackKind } from './state-feedback.component';
import { StateFeedbackDetailsComponent } from './state-feedback-details.component';

@Component({
  standalone: true,
  imports: [ButtonComponent, StateFeedbackComponent, StateFeedbackDetailsComponent],
  template: `
    <lsd-state-feedback
      id="results-state"
      [kind]="kind"
      title="Results unavailable"
      description="Try the request again.">
      <p>Caller-owned supporting content.</p>
      <lsd-button lsdStateActions (activated)="retries++">Retry</lsd-button>
      <lsd-state-details lsdStateDetails label="Technical details">Request timed out</lsd-state-details>
    </lsd-state-feedback>
  `,
})
class StateFeedbackTestHostComponent {
  kind: StateFeedbackKind = 'recoverable-error';
  retries = 0;
}

describe('StateFeedbackComponent', () => {
  let fixture: ComponentFixture<StateFeedbackTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StateFeedbackTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(StateFeedbackTestHostComponent);
    fixture.detectChanges();
  });

  it('composes the alert and caller-owned recovery action for recoverable errors', () => {
    const region = fixture.debugElement.query(By.css('#results-state')).nativeElement as HTMLElement;
    expect(region.getAttribute('role')).toBe('alert');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.querySelector('lsd-alert-banner')).not.toBeNull();
    (region.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.retries).toBe(1);
  });

  it('keeps optional diagnostics collapsed until the user expands them', () => {
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    (details.querySelector('summary') as HTMLElement).click();
    fixture.detectChanges();
    expect(details.open).toBeTrue();
  });

  it('announces loading and skeleton states as busy without exposing skeleton decoration', () => {
    fixture.componentInstance.kind = 'skeleton';
    fixture.detectChanges();
    const region = fixture.debugElement.query(By.css('#results-state')).nativeElement as HTMLElement;
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.querySelector('.lsd-state-feedback__skeleton')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses an assertive announcement only for terminal errors', () => {
    fixture.componentInstance.kind = 'terminal-error';
    fixture.detectChanges();
    const region = fixture.debugElement.query(By.css('#results-state')).nativeElement as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('assertive');
  });
});
