import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AiConfidenceComponent, AiConfidenceLevel } from './ai-confidence.component';

@Component({
  standalone: true,
  imports: [AiConfidenceComponent],
  template: `
    <lsd-ai-confidence
      id="confidence-treatment"
      [level]="level"
      summary="Source coverage is incomplete for the proposed recommendation."
      [showDetails]="showDetails">
      <p lsdAiConfidenceBasis>Three governed sources support part of the response.</p>
      <p lsdAiConfidenceLimitations>Operational constraints were not represented.</p>
      <button lsdAiConfidenceActions type="button">Inspect sources</button>
    </lsd-ai-confidence>
  `,
})
class AiConfidenceTestHostComponent {
  level: AiConfidenceLevel = 'limited';
  showDetails = false;
}

describe('AiConfidenceComponent', () => {
  let fixture: ComponentFixture<AiConfidenceTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AiConfidenceTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AiConfidenceTestHostComponent);
    fixture.detectChanges();
  });

  it('communicates semantic uncertainty and non-approval in visible text', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Limited confidence');
    expect(text).toContain('AI assessment');
    expect(text).toContain('Not architect approved');
    expect(text).toContain('Verify against cited sources before architect approval.');
    expect(fixture.debugElement.query(By.css('.lsd-ai-confidence')).attributes['data-confidence']).toBe('limited');
  });

  it('uses no numeric progress or meter semantics for a categorical assessment', () => {
    expect(fixture.debugElement.query(By.css('[role="progressbar"]'))).toBeNull();
    expect(fixture.debugElement.query(By.css('meter'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('%');
  });

  it('never turns stronger confidence into success or approval presentation', () => {
    fixture.componentInstance.level = 'strong';
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.lsd-alert-banner')).nativeElement as HTMLElement;
    const text = fixture.nativeElement.textContent as string;
    expect(banner.className).toContain('border-status-info');
    expect(banner.className).not.toContain('border-status-success');
    expect(text).toContain('Stronger confidence');
    expect(text).toContain('still requires verification');
    expect(text).toContain('Not architect approved');
  });

  it('supports unknown, limited, moderate, and strong semantic labels', () => {
    const expected: Readonly<Record<AiConfidenceLevel, string>> = {
      unknown: 'Confidence unknown',
      limited: 'Limited confidence',
      moderate: 'Moderate confidence',
      strong: 'Stronger confidence',
    };
    for (const [level, label] of Object.entries(expected)) {
      fixture.componentInstance.level = level as AiConfidenceLevel;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(label);
    }
  });

  it('keeps basis and limitations progressively disclosed and composes actions', () => {
    expect(fixture.debugElement.query(By.css('details'))).toBeNull();
    fixture.componentInstance.showDetails = true;
    fixture.detectChanges();
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    expect(details.textContent).toContain('Three governed sources');
    expect(details.textContent).toContain('Operational constraints');
    expect(fixture.debugElement.query(By.css('.lsd-alert-banner__actions button')).nativeElement.textContent).toContain('Inspect sources');
  });
});
