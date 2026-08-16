import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdrSummaryComponent, type AdrProvenance, type AdrSummaryViewModel } from './adr-summary.component';

@Component({ standalone: true, imports: [AdrSummaryComponent], template: `
  <lsd-adr-summary [adr]="adr" [headingLevel]="2">
    <a lsdAdrRequirements href="/requirements/42">Open requirement</a>
    <button lsdAdrPatterns type="button">Preview pattern</button>
    <span lsdAdrContext>Updated yesterday</span>
    <button lsdAdrActions type="button">Review ADR</button>
  </lsd-adr-summary>` })
class HostComponent {
  adr: AdrSummaryViewModel = {
    number: 'ADR-012', title: 'Use asynchronous integration',
    status: { label: 'In review', variant: 'warning' },
    decision: 'Use a message broker for cross-boundary events.',
    rationaleSummary: 'Decouples bounded contexts and supports recoverable delivery.',
    provenance: 'ai-generated',
    linkedRequirements: [{ id: 'REQ-042', label: 'Recoverability' }],
    linkedPatterns: [{ id: 'PAT-007', label: 'Competing consumers' }],
  };
}

describe('AdrSummaryComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent); fixture.detectChanges();
  });

  it('renders a labeled region, heading, decision, and rationale', () => {
    expect(fixture.debugElement.query(By.css('[role="region"]')).nativeElement.getAttribute('aria-label'))
      .toBe('ADR-012: Use asynchronous integration');
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Use asynchronous integration');
    expect(fixture.nativeElement.textContent).toContain('Use a message broker');
    expect(fixture.nativeElement.textContent).toContain('Decouples bounded contexts');
  });

  it('keeps AI-generated provenance visibly distinct from approval', () => {
    const badges = fixture.debugElement.query(By.css('.lsd-adr-summary__badges')).nativeElement.textContent;
    expect(badges).toContain('AI generated · Not approved');
    expect(badges).not.toContain('Human approved');
  });

  it('renders stable linked IDs and projected reference controls', () => {
    expect(fixture.nativeElement.textContent).toContain('Recoverability · REQ-042');
    expect(fixture.nativeElement.textContent).toContain('Competing consumers · PAT-007');
    expect(fixture.nativeElement.textContent).toContain('Open requirement');
    expect(fixture.nativeElement.textContent).toContain('Preview pattern');
  });

  it('maps every governance provenance category to visible text', () => {
    const provenance: readonly AdrProvenance[] = ['human-authored', 'ai-suggested', 'ai-generated', 'human-modified-from-ai', 'human-approved'];
    for (const value of provenance) {
      fixture.componentInstance.adr = { ...fixture.componentInstance.adr, provenance: value }; fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.lsd-adr-summary__badges lsd-badge'))[1].nativeElement.textContent.trim()).not.toBe('');
    }
  });

  it('labels projected actions with the ADR number', () => {
    expect(fixture.debugElement.query(By.css('[role="group"]')).nativeElement.getAttribute('aria-label')).toBe('ADR actions for ADR-012');
  });
});
