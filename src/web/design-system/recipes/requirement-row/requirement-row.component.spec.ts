import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RequirementRowComponent, type RequirementRowViewModel } from './requirement-row.component';

@Component({
  standalone: true,
  imports: [RequirementRowComponent],
  template: `
    <lsd-requirement-row [requirement]="requirement" [headingLevel]="2">
      <a lsdRequirementTraceability href="/adrs/12">ADR-012</a>
      <button lsdRequirementEvidence type="button">Open passage</button>
      <button lsdRequirementActions type="button">Review</button>
    </lsd-requirement-row>
  `,
})
class RequirementRowTestHostComponent {
  requirement: RequirementRowViewModel = {
    id: 'REQ-042',
    title: 'All generated claims must retain source evidence',
    status: { label: 'In review', variant: 'warning' },
    priority: 'high',
    traceability: [{ id: 'DISC-018', label: 'Discovery answer' }],
    evidence: [{ id: 'SRC-203', label: 'Architecture brief' }],
  };
}

describe('RequirementRowComponent', () => {
  let fixture: ComponentFixture<RequirementRowTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RequirementRowTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(RequirementRowTestHostComponent);
    fixture.detectChanges();
  });

  it('renders a labeled requirement region with configurable heading hierarchy', () => {
    const region = fixture.debugElement.query(By.css('[role="region"]')).nativeElement as HTMLElement;
    expect(region.getAttribute('aria-label')).toBe('REQ-042: All generated claims must retain source evidence');
    expect(fixture.debugElement.query(By.css('h1'))).toBeNull();
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent)
      .toContain('All generated claims must retain source evidence');
  });

  it('communicates status and priority in visible text', () => {
    const state = fixture.debugElement.query(By.css('.lsd-requirement-row__state')).nativeElement as HTMLElement;
    expect(state.textContent).toContain('In review');
    expect(state.textContent).toContain('High priority');
  });

  it('shows stable traceability and evidence identifiers and projects richer controls', () => {
    const sections = fixture.debugElement.queryAll(By.css('.lsd-requirement-row__references'));
    expect(sections[0].nativeElement.textContent).toContain('Discovery answer · DISC-018');
    expect(sections[0].nativeElement.textContent).toContain('ADR-012');
    expect(sections[1].nativeElement.textContent).toContain('Architecture brief · SRC-203');
    expect(sections[1].nativeElement.textContent).toContain('Open passage');
  });

  it('provides a requirement-specific accessible name for projected actions', () => {
    const actions = fixture.debugElement.query(By.css('[role="group"]')).nativeElement as HTMLElement;
    expect(actions.getAttribute('aria-label')).toBe('Requirement actions for REQ-042');
    expect(actions.textContent).toContain('Review');
  });
});
