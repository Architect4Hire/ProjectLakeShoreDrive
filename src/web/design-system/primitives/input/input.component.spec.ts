import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputComponent } from './input.component';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `
    <lsd-input
      id="engagement-name"
      label="Engagement name"
      description="Use the client-facing name."
      [disabled]="disabled"
      [error]="error"
      [readonly]="isReadonly"
      required
      [(value)]="value">
      <span lsdInputPrefix>Prefix</span>
      <span lsdInputSuffix>Suffix</span>
    </lsd-input>
  `,
})
class InputTestHostComponent {
  disabled = false;
  error: string | undefined;
  isReadonly = false;
  value = 'Initial';
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputTestHostComponent>;
  let host: InputTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const control = (): HTMLInputElement => fixture.debugElement.query(By.css('input')).nativeElement;

  it('associates the native input with its visible label and description', () => {
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    expect(label.htmlFor).toBe('engagement-name');
    expect(control().required).toBeTrue();
    expect(control().getAttribute('aria-describedby')).toBe('engagement-name-description');
  });

  it('updates model signal state from native keyboard-compatible input events', () => {
    control().value = 'Updated';
    control().dispatchEvent(new Event('input'));
    expect(host.value).toBe('Updated');
    expect(control().hasAttribute('tabindex')).toBeFalse();
  });

  it('forwards disabled and readonly native states', () => {
    host.disabled = true;
    host.isReadonly = true;
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    expect(control().readOnly).toBeTrue();
  });

  it('associates and announces an accessible error', () => {
    host.error = 'An engagement name is required.';
    fixture.detectChanges();
    expect(control().getAttribute('aria-invalid')).toBe('true');
    expect(control().getAttribute('aria-errormessage')).toBe('engagement-name-error');
    expect(control().getAttribute('aria-describedby')).toBe(
      'engagement-name-description engagement-name-error',
    );
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain(
      'An engagement name is required.',
    );
  });

  it('projects decorative prefix and suffix content', () => {
    const decorations = fixture.debugElement.queryAll(By.css('[aria-hidden="true"]'));
    expect(decorations.some((item) => item.nativeElement.textContent.includes('Prefix'))).toBeTrue();
    expect(decorations.some((item) => item.nativeElement.textContent.includes('Suffix'))).toBeTrue();
  });
});
