import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TextareaComponent, type TextareaDensity, type TextareaResize } from './textarea.component';

@Component({
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <lsd-textarea
      id="architecture-notes"
      label="Architecture notes"
      description="Record decisions, constraints, and open questions."
      [density]="density"
      [disabled]="disabled"
      [error]="error"
      [readonly]="isReadonly"
      [resize]="resize"
      required
      [(value)]="value" />
  `,
})
class TextareaTestHostComponent {
  density: TextareaDensity = 'default';
  disabled = false;
  error: string | undefined;
  isReadonly = false;
  resize: TextareaResize = 'vertical';
  value = 'Initial notes';
}

describe('TextareaComponent', () => {
  let fixture: ComponentFixture<TextareaTestHostComponent>;
  let host: TextareaTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TextareaTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TextareaTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const control = (): HTMLTextAreaElement =>
    fixture.debugElement.query(By.css('textarea')).nativeElement as HTMLTextAreaElement;

  it('associates the native textarea with its label and description', () => {
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    expect(label.htmlFor).toBe('architecture-notes');
    expect(control().required).toBeTrue();
    expect(control().getAttribute('aria-describedby')).toBe('architecture-notes-description');
  });

  it('preserves multiline native keyboard input through model state', () => {
    control().value = 'Decision one\nDecision two';
    control().dispatchEvent(new Event('input'));
    expect(host.value).toBe('Decision one\nDecision two');
    expect(control().hasAttribute('tabindex')).toBeFalse();
  });

  it('applies typed density and resize behavior', () => {
    expect(control().classList).toContain('min-h-36');
    expect(control().classList).toContain('resize-y');
    host.density = 'comfortable';
    host.resize = 'none';
    fixture.detectChanges();
    expect(control().classList).toContain('min-h-56');
    expect(control().classList).toContain('resize-none');
  });

  it('forwards disabled and readonly native states', () => {
    host.disabled = true;
    host.isReadonly = true;
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    expect(control().readOnly).toBeTrue();
  });

  it('associates and announces an accessible error', () => {
    host.error = 'Architecture notes are required.';
    fixture.detectChanges();
    expect(control().getAttribute('aria-invalid')).toBe('true');
    expect(control().getAttribute('aria-errormessage')).toBe('architecture-notes-error');
    expect(control().getAttribute('aria-describedby')).toBe(
      'architecture-notes-description architecture-notes-error',
    );
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain(
      'Architecture notes are required.',
    );
  });
});
