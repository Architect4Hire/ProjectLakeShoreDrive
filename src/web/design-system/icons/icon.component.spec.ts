import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconComponent, type IconAccessibility, type IconTone } from './icon.component';

@Component({
  standalone: true,
  imports: [IconComponent],
  template: `<lsd-icon name="info" [accessibility]="accessibility" [tone]="tone" />`,
})
class IconTestHostComponent {
  accessibility: IconAccessibility = { mode: 'decorative' };
  tone: IconTone = 'muted';
}

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconTestHostComponent>;
  let host: IconTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IconTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(IconTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const svg = (): SVGElement => fixture.debugElement.query(By.css('svg')).nativeElement as SVGElement;

  it('hides decorative icons from assistive technology and keyboard focus', () => {
    expect(svg().getAttribute('aria-hidden')).toBe('true');
    expect(svg().getAttribute('role')).toBeNull();
    expect(svg().getAttribute('focusable')).toBe('false');
    expect(svg().hasAttribute('tabindex')).toBeFalse();
  });

  it('gives informative icons an image role and accessible name', () => {
    host.accessibility = { mode: 'informative', label: 'More information' };
    fixture.detectChanges();
    expect(svg().getAttribute('aria-hidden')).toBeNull();
    expect(svg().getAttribute('role')).toBe('img');
    expect(svg().getAttribute('aria-label')).toBe('More information');
  });

  it('renders registered geometry and a semantic appearance-safe tone', () => {
    expect(svg().querySelector('path')?.getAttribute('d')).toBeTruthy();
    expect(svg().classList).toContain('text-text-muted');
  });
});
