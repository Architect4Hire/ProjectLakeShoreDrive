import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormSectionComponent } from './form-section.component';

@Component({
  standalone: true,
  imports: [FormSectionComponent],
  template: `
    <lsd-form-section
      id="delivery-settings"
      title="Delivery settings"
      guidance="Configure the values needed for this decision."
      density="compact"
      errorTitle="Resolve this section"
      [disabled]="disabled"
      [hasDisclosure]="true"
      [(disclosureExpanded)]="expanded">
      <button lsdFormSectionActions type="button">Use defaults</button>
      <p lsdFormSectionErrors>A region is required.</p>
      <label>Region <input required /></label>
      <label lsdFormSectionDisclosure>Evidence <textarea></textarea></label>
    </lsd-form-section>
  `,
})
class FormSectionTestHostComponent {
  disabled = false;
  expanded = false;
}

describe('FormSectionComponent', () => {
  let fixture: ComponentFixture<FormSectionTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormSectionTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(FormSectionTestHostComponent);
    fixture.detectChanges();
  });

  it('uses native fieldset and legend semantics with associated guidance and errors', () => {
    const fieldset = fixture.debugElement.query(By.css('fieldset')).nativeElement as HTMLFieldSetElement;
    expect(fieldset.querySelector('legend')?.textContent).toContain('Delivery settings');
    expect(fieldset.getAttribute('aria-describedby')).toBe('delivery-settings-guidance delivery-settings-error-body');
    expect(fieldset.dataset['density']).toBe('compact');
  });

  it('composes projected actions, fields, and the standard error banner', () => {
    const section = fixture.nativeElement as HTMLElement;
    expect(section.querySelector('.lsd-form-section__actions button')?.textContent).toContain('Use defaults');
    expect(section.querySelector('.lsd-form-section__fields input')).not.toBeNull();
    expect(section.querySelector('lsd-alert-banner')?.textContent).toContain('A region is required');
  });

  it('keeps secondary fields collapsed and synchronizes native disclosure interaction', () => {
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    (details.querySelector('summary') as HTMLElement).click();
    fixture.detectChanges();
    expect(details.open).toBeTrue();
    expect(fixture.componentInstance.expanded).toBeTrue();
    expect(details.querySelector('textarea')).not.toBeNull();
  });

  it('disables the complete native field group when requested', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const fieldset = fixture.debugElement.query(By.css('fieldset')).nativeElement as HTMLFieldSetElement;
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(fieldset.disabled).toBeTrue();
    expect(input.matches(':disabled')).toBeTrue();
  });
});
