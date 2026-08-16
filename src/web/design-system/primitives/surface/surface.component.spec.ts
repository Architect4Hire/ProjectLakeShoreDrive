import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { elevationTokens } from '../../tokens/elevation';
import { radiusTokens } from '../../tokens/radius';
import { spacingTokens } from '../../tokens/spacing';
import { SurfaceComponent, type SurfaceAccessibility, type SurfaceTone } from './surface.component';

@Component({
  standalone: true,
  imports: [SurfaceComponent],
  template: `
    <lsd-surface
      [accessibility]="accessibility"
      elevation="raised"
      padding="comfortable"
      radius="prominent"
      [tone]="tone">
      Projected panel content
    </lsd-surface>
  `,
})
class SurfaceTestHostComponent {
  accessibility: SurfaceAccessibility = { role: 'none' };
  tone: SurfaceTone = 'panel';
}

describe('SurfaceComponent', () => {
  let fixture: ComponentFixture<SurfaceTestHostComponent>;
  let host: SurfaceTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SurfaceTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SurfaceTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const surface = (): HTMLElement => fixture.debugElement.query(By.css('.lsd-surface')).nativeElement;

  it('projects content and consumes spacing, radius, and elevation contracts', () => {
    expect(surface().textContent).toContain('Projected panel content');
    expect(surface().style.padding).toBe(spacingTokens['panel-inset-comfortable']);
    expect(surface().style.borderRadius).toBe(radiusTokens['panel-prominent']);
    expect(surface().style.boxShadow).toBe(elevationTokens.raised);
  });

  it('uses semantic surface colors for either appearance', () => {
    expect(surface().classList).toContain('bg-surface-panel');
    host.tone = 'raised';
    fixture.detectChanges();
    expect(surface().classList).toContain('bg-surface-raised');
  });

  it('adds a named region only when explicitly requested', () => {
    expect(surface().getAttribute('role')).toBeNull();
    host.accessibility = { role: 'region', label: 'Architecture summary' };
    fixture.detectChanges();
    expect(surface().getAttribute('role')).toBe('region');
    expect(surface().getAttribute('aria-label')).toBe('Architecture summary');
  });

  it('does not enter keyboard focus', () => {
    expect(surface().hasAttribute('tabindex')).toBeFalse();
  });
});
