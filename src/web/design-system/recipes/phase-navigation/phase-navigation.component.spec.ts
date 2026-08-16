import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  type EngagementPhase,
  type EngagementPhaseStates,
  PhaseNavigationComponent,
} from './phase-navigation.component';

@Component({
  standalone: true,
  imports: [PhaseNavigationComponent],
  template: `
    <lsd-phase-navigation
      label="Northwind engagement phases"
      [states]="states"
      (phaseRequested)="requested = $event" />
  `,
})
class PhaseNavigationTestHostComponent {
  states: EngagementPhaseStates = {
    overview: 'completed',
    discovery: 'active',
    requirements: 'attention',
  };
  requested: EngagementPhase | undefined;
}

describe('PhaseNavigationComponent', () => {
  let fixture: ComponentFixture<PhaseNavigationTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PhaseNavigationTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(PhaseNavigationTestHostComponent);
    fixture.detectChanges();
  });

  it('renders all canonical phases in the required order', () => {
    const labels = fixture.debugElement.queryAll(By.css('.lsd-phase-navigation__item lsd-button'))
      .map((item) => (item.nativeElement as HTMLElement).textContent?.trim().replace(/\s+/g, ' '));
    expect(labels).toEqual([
      'Overview Completed', 'Discovery Current', 'Requirements Needs attention',
      'Architecture', 'ADRs', 'RAID', 'Estimates', 'Documents', 'AI',
    ]);
  });

  it('exposes state meaning as text and marks only caller-designated current items', () => {
    const current = fixture.debugElement.queryAll(By.css('[aria-current="page"]'));
    expect(current.length).toBe(1);
    expect(current[0].nativeElement.textContent).toContain('Discovery');
    const buttons = fixture.debugElement.queryAll(By.css('lsd-button button'));
    expect(buttons[0].nativeElement.getAttribute('aria-label')).toBe('Overview, Completed');
    expect(buttons[1].nativeElement.getAttribute('aria-label')).toBe('Discovery, Current');
    expect(buttons[2].nativeElement.getAttribute('aria-label')).toBe('Requirements, Needs attention');
    expect(buttons[3].nativeElement.getAttribute('aria-label')).toBe('Architecture');
  });

  it('emits a typed navigation intent without changing phase state', () => {
    const architecture = fixture.debugElement.queryAll(By.css('lsd-button button'))[3].nativeElement as HTMLButtonElement;
    architecture.click(); fixture.detectChanges();
    expect(fixture.componentInstance.requested).toBe('architecture');
    expect(fixture.componentInstance.states['discovery']).toBe('active');
    expect(fixture.debugElement.query(By.css('[aria-current="page"]')).nativeElement.textContent).toContain('Discovery');
  });

  it('provides a labeled navigation landmark', () => {
    const navigation = fixture.debugElement.query(By.css('nav')).nativeElement as HTMLElement;
    expect(navigation.getAttribute('aria-label')).toBe('Northwind engagement phases');
  });
});
