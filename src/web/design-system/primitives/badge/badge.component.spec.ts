import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BadgeComponent, type BadgeVariant } from './badge.component';

@Component({
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <lsd-badge
      [announce]="announce"
      [variant]="variant"
      accessibleLabel="Requirement status: AI draft">
      AI draft
    </lsd-badge>
  `,
})
class BadgeTestHostComponent {
  announce = false;
  variant: BadgeVariant = 'ai-draft';
}

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeTestHostComponent>;
  let host: BadgeTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(BadgeTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const badge = (): HTMLElement => fixture.debugElement.query(By.css('lsd-badge > span')).nativeElement;

  it('renders projected text with a supplied accessible label', () => {
    expect(badge().textContent).toContain('AI draft');
    expect(badge().getAttribute('aria-label')).toBe('Requirement status: AI draft');
  });

  it('keeps static badges out of the live region and keyboard order', () => {
    expect(badge().getAttribute('role')).toBeNull();
    expect(badge().hasAttribute('tabindex')).toBeFalse();
  });

  it('provides a polite status live region when announcement is requested', () => {
    host.announce = true;
    fixture.detectChanges();
    expect(badge().getAttribute('role')).toBe('status');
    expect(badge().getAttribute('aria-live')).toBe('polite');
  });

  it('keeps AI draft visually distinct from approved content', () => {
    expect(badge().classList).toContain('bg-ai-draft-surface');
    host.variant = 'approved';
    fixture.detectChanges();
    expect(badge().classList).toContain('bg-ai-approved-surface');
    expect(badge().classList).not.toContain('bg-ai-draft-surface');
  });

  it('renders every supported state through a semantic token class', () => {
    const expectedClass: Record<BadgeVariant, string> = {
      neutral: 'bg-surface-raised',
      info: 'bg-status-info/10',
      success: 'bg-status-success/10',
      warning: 'bg-status-warning/10',
      danger: 'bg-status-danger/10',
      'ai-draft': 'bg-ai-draft-surface',
      suggested: 'bg-status-info/10',
      approved: 'bg-ai-approved-surface',
      deprecated: 'bg-status-danger/10',
      archived: 'bg-surface-raised',
    };

    for (const [variant, semanticClass] of Object.entries(expectedClass)) {
      host.variant = variant as BadgeVariant;
      fixture.detectChanges();
      expect(badge().classList).withContext(variant).toContain(semanticClass);
    }
  });
});
