import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AiGenerationProgressComponent, AiGenerationState, AiProgressMode } from './ai-generation-progress.component';

@Component({
  standalone: true,
  imports: [AiGenerationProgressComponent],
  template: `
    <lsd-ai-generation-progress
      id="section-generation"
      title="Generate architecture section"
      [state]="state"
      [mode]="mode"
      [value]="value"
      [max]="max"
      [announcement]="announcement"
      [cancellable]="cancellable"
      (cancelRequested)="cancellations++">
      <p>Approved content remains visible elsewhere.</p>
    </lsd-ai-generation-progress>
  `,
})
class AiGenerationProgressTestHostComponent {
  state: AiGenerationState = 'generating';
  mode: AiProgressMode = 'determinate';
  value = 25;
  max = 100;
  announcement: string | null = 'Draft outline complete';
  cancellable = true;
  cancellations = 0;
}

describe('AiGenerationProgressComponent', () => {
  let fixture: ComponentFixture<AiGenerationProgressTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AiGenerationProgressTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AiGenerationProgressTestHostComponent);
    fixture.detectChanges();
  });

  it('exposes determinate progress with persistent unapproved AI attribution', () => {
    const progress = fixture.debugElement.query(By.css('[role="progressbar"]')).nativeElement as HTMLElement;
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('100');
    expect(progress.getAttribute('aria-valuenow')).toBe('25');
    expect(progress.getAttribute('aria-valuetext')).toBe('25% complete');
    expect(fixture.nativeElement.textContent).toContain('AI-generated draft');
    expect(fixture.nativeElement.textContent).toContain('Not architect approved');
  });

  it('emits cancellation intent without mutating caller-owned state', () => {
    (fixture.debugElement.query(By.css('.lsd-ai-generation-progress__footer button')).nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.cancellations).toBe(1);
    expect(fixture.componentInstance.state).toBe('generating');
  });

  it('locks cancellation while cancellation is pending', () => {
    fixture.componentInstance.state = 'cancelling';
    fixture.detectChanges();
    const cancel = fixture.debugElement.query(By.css('.lsd-ai-generation-progress__footer button')).nativeElement as HTMLButtonElement;
    expect(cancel.disabled).toBeTrue();
    cancel.click();
    expect(fixture.componentInstance.cancellations).toBe(0);
  });

  it('supports indeterminate progress without exposing false numeric values', () => {
    fixture.componentInstance.mode = 'indeterminate';
    fixture.detectChanges();
    const progress = fixture.debugElement.query(By.css('[role="progressbar"]')).nativeElement as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBeNull();
    expect(progress.getAttribute('aria-valuemax')).toBeNull();
    expect(progress.getAttribute('aria-label')).toBe('Generating AI draft');
  });

  it('announces caller-owned milestones politely and failures assertively without duplicate live regions', () => {
    const status = fixture.debugElement.query(By.css('[role="status"]')).nativeElement as HTMLElement;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toContain('Draft outline complete');

    fixture.componentInstance.state = 'failed';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]'))).toBeNull();
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Existing approved content is unchanged');
  });

  it('normalizes invalid and out-of-range presentation values', () => {
    fixture.componentInstance.value = 150;
    fixture.componentInstance.max = 0;
    fixture.detectChanges();
    const progress = fixture.debugElement.query(By.css('[role="progressbar"]')).nativeElement as HTMLElement;
    expect(progress.getAttribute('aria-valuemax')).toBe('1');
    expect(progress.getAttribute('aria-valuenow')).toBe('1');
    expect(progress.getAttribute('aria-valuetext')).toBe('100% complete');
  });
});
