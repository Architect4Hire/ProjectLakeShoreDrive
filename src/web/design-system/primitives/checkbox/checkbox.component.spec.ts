import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CheckboxComponent } from './checkbox.component';

@Component({
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <lsd-checkbox
      id="include-evidence"
      label="Include supporting evidence"
      description="Adds cited evidence to the output."
      [disabled]="disabled"
      [error]="error"
      [(checked)]="checked"
      [(indeterminate)]="indeterminate" />
  `,
})
class CheckboxTestHostComponent {
  checked = false;
  disabled = false;
  error: string | undefined;
  indeterminate = true;
}

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxTestHostComponent>;
  let host: CheckboxTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(CheckboxTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const control = (): HTMLInputElement => fixture.debugElement.query(By.css('input')).nativeElement;

  it('uses an associated native checkbox and help text', () => {
    expect(control().type).toBe('checkbox');
    expect(fixture.debugElement.query(By.css('label')).nativeElement.htmlFor).toBe('include-evidence');
    expect(control().getAttribute('aria-describedby')).toBe('include-evidence-description');
  });

  it('exposes mixed state and clears it after a native change', () => {
    expect(control().indeterminate).toBeTrue();
    expect(control().getAttribute('aria-checked')).toBe('mixed');
    control().checked = true;
    control().dispatchEvent(new Event('change'));
    expect(host.checked).toBeTrue();
    expect(host.indeterminate).toBeFalse();
  });

  it('retains native keyboard focus and disabled behavior', () => {
    expect(control().hasAttribute('tabindex')).toBeFalse();
    host.disabled = true;
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('associates and announces an accessible error', () => {
    host.error = 'Choose whether to include evidence.';
    fixture.detectChanges();
    expect(control().getAttribute('aria-invalid')).toBe('true');
    expect(control().getAttribute('aria-errormessage')).toBe('include-evidence-error');
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain(
      'Choose whether to include evidence.',
    );
  });
});
