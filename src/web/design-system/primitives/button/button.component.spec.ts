import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent, type ButtonShadow, type ButtonTone } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <lsd-button
      [disabled]="disabled"
      [loading]="loading"
      [type]="type"
      [tone]="tone"
      [shadow]="shadow"
      accessibleLabel="Save document"
      controls="save-details"
      [expanded]="expanded"
      (activated)="activations++">
      <svg lsdButtonLeadingIcon aria-label="ignored icon label"></svg>
      Save
      <svg lsdButtonTrailingIcon></svg>
    </lsd-button>
  `,
})
class ButtonTestHostComponent {
  disabled = false;
  loading = false;
  type: 'button' | 'submit' | 'reset' = 'button';
  tone: ButtonTone = 'primary';
  shadow: ButtonShadow = 'none';
  activations = 0;
  expanded = false;
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonTestHostComponent>;
  let host: ButtonTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(ButtonTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const nativeButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

  it('uses native button semantics and defaults to a non-submitting type', () => {
    expect(nativeButton().tagName).toBe('BUTTON');
    expect(nativeButton().type).toBe('button');
    expect(nativeButton().getAttribute('aria-label')).toBe('Save document');
    expect(nativeButton().getAttribute('aria-controls')).toBe('save-details');
    expect(nativeButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('emits activation for an enabled native click', () => {
    nativeButton().click();
    expect(host.activations).toBe(1);
  });

  it('prevents activation when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    nativeButton().click();
    expect(nativeButton().disabled).toBeTrue();
    expect(host.activations).toBe(0);
  });

  it('exposes loading state and an assertive-free status announcement', () => {
    host.loading = true;
    fixture.detectChanges();
    expect(nativeButton().disabled).toBeTrue();
    expect(nativeButton().getAttribute('aria-busy')).toBe('true');
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Loading');
  });

  it('projects leading and trailing icons as decorative content', () => {
    const icons = fixture.debugElement.queryAll(By.css('.lsd-button__icon'));
    expect(icons).toHaveSize(2);
    expect(icons.every((icon) => icon.attributes['aria-hidden'] === 'true')).toBeTrue();
  });

  it('exposes tone as a data attribute so the global focus ring can resolve a tone-matched color', () => {
    host.tone = 'danger';
    fixture.detectChanges();
    expect(nativeButton().getAttribute('data-tone')).toBe('danger');
  });

  it('applies a token-backed shadow class for each shadow variant, and no class for none', () => {
    expect(nativeButton().className).not.toContain('shadow-');

    host.shadow = 'small';
    fixture.detectChanges();
    expect(nativeButton().className).toContain('shadow-raised');

    host.shadow = 'medium';
    fixture.detectChanges();
    expect(nativeButton().className).toContain('shadow-popover');

    host.shadow = 'large';
    fixture.detectChanges();
    expect(nativeButton().className).toContain('shadow-overlay');
  });
});
