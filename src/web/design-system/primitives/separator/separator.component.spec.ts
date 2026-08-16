import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { spacingTokens } from '../../tokens/spacing';
import { SeparatorComponent, type SeparatorOrientation } from './separator.component';

@Component({
  standalone: true,
  imports: [SeparatorComponent],
  template: `<lsd-separator [decorative]="decorative" [orientation]="orientation" spacing="section" />`,
})
class SeparatorTestHostComponent {
  decorative = false;
  orientation: SeparatorOrientation = 'horizontal';
}

describe('SeparatorComponent', () => {
  let fixture: ComponentFixture<SeparatorTestHostComponent>;
  let host: SeparatorTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SeparatorTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SeparatorTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses a native horizontal rule with semantic spacing', () => {
    const rule = fixture.debugElement.query(By.css('hr')).nativeElement as HTMLHRElement;
    expect(rule.style.marginBlock).toBe(spacingTokens['stack-section']);
    expect(rule.hasAttribute('tabindex')).toBeFalse();
  });

  it('provides vertical separator semantics without keyboard focus', () => {
    host.orientation = 'vertical';
    fixture.detectChanges();
    const rule = fixture.debugElement.query(By.css('[role="separator"]')).nativeElement as HTMLElement;
    expect(rule.getAttribute('aria-orientation')).toBe('vertical');
    expect(rule.hasAttribute('tabindex')).toBeFalse();
  });

  it('removes decorative separators from the accessibility tree', () => {
    host.decorative = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('hr')).attributes['role']).toBe('presentation');
  });
});
