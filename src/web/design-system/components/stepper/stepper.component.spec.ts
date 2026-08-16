import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StepperComponent, StepperStep } from './stepper.component';

type Stage = 'start' | 'review' | 'finish';

@Component({
  standalone: true,
  imports: [StepperComponent],
  template: `<lsd-stepper label="Setup progress" [steps]="steps" [active]="active"
    (stepActivated)="active = $event" />`,
})
class StepperTestHostComponent {
  readonly steps: readonly StepperStep<Stage>[] = [
    { identity: 'start', label: 'Start', description: 'Initial information', state: 'complete' },
    { identity: 'review', label: 'Review', description: 'Review details' },
    { identity: 'finish', label: 'Finish', state: 'error', disabled: true },
  ];
  active: Stage = 'review';
}

describe('StepperComponent', () => {
  let fixture: ComponentFixture<StepperTestHostComponent>;
  let host: StepperTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepperTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(StepperTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes progress as labeled navigation with a current step', () => {
    expect(fixture.debugElement.query(By.css('nav')).attributes['aria-label']).toBe('Setup progress');
    const controls = fixture.debugElement.queryAll(By.css('button'));
    expect(controls[1].attributes['aria-current']).toBe('step');
    expect(controls[0].nativeElement.textContent).toContain('Completed');
  });

  it('preserves typed identity for caller-owned navigation', () => {
    const controls = fixture.debugElement.queryAll(By.css('button'));
    controls[0].nativeElement.click(); fixture.detectChanges();
    expect(host.active).toBe('start');
  });

  it('honors caller-provided disabled navigation state', () => {
    const controls = fixture.debugElement.queryAll(By.css('button'));
    expect(controls[2].nativeElement.disabled).toBeTrue();
    controls[2].nativeElement.click();
    expect(host.active).toBe('review');
  });

  it('uses semantic styles for current, complete, and error states', () => {
    const markers = fixture.debugElement.queryAll(By.css('.lsd-stepper__marker'));
    expect(markers[0].nativeElement.className).toContain('bg-status-success');
    expect(markers[1].nativeElement.className).toContain('bg-accent-primary');
    expect(markers[2].nativeElement.className).toContain('bg-status-danger');
  });
});
