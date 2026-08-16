import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FilterActionBarComponent } from './filter-action-bar.component';

@Component({
  standalone: true,
  imports: [FilterActionBarComponent],
  template: `
    <lsd-filter-action-bar id="catalog-tools" accessibleName="Catalog tools" [activeFilterCount]="2">
      <label lsdFilterBarSearch>Search <input type="search" /></label>
      <div lsdFilterBarFilters><label>Status <select><option>Any</option></select></label></div>
      <div lsdFilterBarActions><button type="button">Create</button></div>
    </lsd-filter-action-bar>
  `,
})
class FilterActionBarTestHostComponent {}

describe('FilterActionBarComponent', () => {
  let fixture: ComponentFixture<FilterActionBarTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FilterActionBarTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(FilterActionBarTestHostComponent);
    fixture.detectChanges();
  });

  it('projects search, filters, and actions in keyboard-efficient order', () => {
    const section = fixture.debugElement.query(By.css('section')).nativeElement as HTMLElement;
    expect(section.getAttribute('aria-label')).toBe('Catalog tools');
    expect(section.querySelector('input[type="search"]')).not.toBeNull();
    expect(section.querySelector('select')).not.toBeNull();
    expect(section.querySelector('.lsd-filter-action-bar__actions button')?.textContent).toContain('Create');
  });

  it('exposes an associated native filter disclosure and active count', () => {
    const toggle = fixture.debugElement.query(By.css('.lsd-filter-action-bar__toggle')).nativeElement as HTMLButtonElement;
    expect(toggle.getAttribute('aria-controls')).toBe('catalog-tools-filters');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.textContent).toContain('2 active');
    toggle.click(); fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('returns focus to the disclosure when collapsing from a filter', () => {
    const toggle = fixture.debugElement.query(By.css('.lsd-filter-action-bar__toggle')).nativeElement as HTMLButtonElement;
    toggle.click(); fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    select.focus(); toggle.click(); fixture.detectChanges();
    expect(document.activeElement).toBe(toggle);
  });
});
