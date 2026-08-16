import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SelectComponent, type SelectOption } from './select.component';

@Component({
  standalone: true,
  imports: [SelectComponent],
  template: `
    <lsd-select
      id="page-size"
      label="Page size"
      description="Choose the number of rows."
      [disabled]="disabled"
      [error]="error"
      [options]="options"
      required
      [(value)]="value" />
  `,
})
class SelectTestHostComponent {
  disabled = false;
  error: string | undefined;
  readonly options: readonly SelectOption<number>[] = [
    { value: 10, label: 'Ten' },
    { value: 20, label: 'Twenty' },
    { value: 50, label: 'Fifty', disabled: true },
  ];
  value: number | null = 10;
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectTestHostComponent>;
  let host: SelectTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SelectTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const control = (): HTMLSelectElement =>
    fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;

  it('associates the native select with its label and help text', () => {
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    expect(label.htmlFor).toBe('page-size');
    expect(control().required).toBeTrue();
    expect(control().getAttribute('aria-describedby')).toBe('page-size-description');
  });

  it('preserves typed option values through native change events', () => {
    control().value = '1';
    control().dispatchEvent(new Event('change'));
    expect(host.value).toBe(20);
    expect(typeof host.value).toBe('number');
  });

  it('retains native keyboard focus and disabled option semantics', () => {
    expect(control().hasAttribute('tabindex')).toBeFalse();
    expect(control().options.item(3)?.disabled).toBeTrue();
    host.disabled = true;
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('associates and announces an accessible error', () => {
    host.error = 'Select a page size.';
    fixture.detectChanges();
    expect(control().getAttribute('aria-invalid')).toBe('true');
    expect(control().getAttribute('aria-errormessage')).toBe('page-size-error');
    expect(control().getAttribute('aria-describedby')).toBe('page-size-description page-size-error');
    expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.textContent).toContain(
      'Select a page size.',
    );
  });
});
