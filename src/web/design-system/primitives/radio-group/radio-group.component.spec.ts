import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RadioGroupComponent, type RadioOption } from './radio-group.component';

@Component({
  standalone: true,
  imports: [RadioGroupComponent],
  template: `
    <lsd-radio-group
      id="review-depth"
      name="review-depth"
      label="Review depth"
      description="Choose one review level."
      [disabled]="disabled"
      [error]="error"
      [options]="options"
      required
      [(value)]="value" />
  `,
})
class RadioGroupTestHostComponent {
  disabled = false;
  error: string | undefined;
  readonly options: readonly RadioOption<number>[] = [
    { value: 1, label: 'Focused' },
    { value: 2, label: 'Standard' },
    { value: 3, label: 'Comprehensive', disabled: true },
  ];
  value: number | null = 1;
}

describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<RadioGroupTestHostComponent>;
  let host: RadioGroupTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadioGroupTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(RadioGroupTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const controls = (): HTMLInputElement[] =>
    fixture.debugElement.queryAll(By.css('input')).map((item) => item.nativeElement as HTMLInputElement);

  it('groups native radios with a fieldset and legend', () => {
    expect(fixture.debugElement.query(By.css('fieldset'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('legend')).nativeElement.textContent).toContain('Review depth');
    expect(controls().every((control) => control.name === 'review-depth')).toBeTrue();
  });

  it('preserves a typed value after native radio selection', () => {
    controls()[1].checked = true;
    controls()[1].dispatchEvent(new Event('change'));
    expect(host.value).toBe(2);
    expect(typeof host.value).toBe('number');
  });

  it('retains native keyboard grouping and option disabled state', () => {
    expect(controls().every((control) => !control.hasAttribute('tabindex'))).toBeTrue();
    expect(controls()[2].disabled).toBeTrue();
    host.disabled = true;
    fixture.detectChanges();
    expect((fixture.debugElement.query(By.css('fieldset')).nativeElement as HTMLFieldSetElement).disabled).toBeTrue();
  });

  it('associates group help and an announced error', () => {
    host.error = 'Select a review depth.';
    fixture.detectChanges();
    const group = fixture.debugElement.query(By.css('fieldset')).nativeElement as HTMLFieldSetElement;
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-errormessage')).toBe('review-depth-error');
    expect(group.getAttribute('aria-describedby')).toBe('review-depth-description review-depth-error');
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain(
      'Select a review depth.',
    );
  });
});
