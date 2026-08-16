import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SuggestedChangeComponent, SuggestedChangeLayout, SuggestedChangeProcessing, SuggestedChangeState } from './suggested-change.component';

@Component({
  standalone: true,
  imports: [SuggestedChangeComponent],
  template: `
    <lsd-suggested-change
      id="queue-change"
      title="Review resilience recommendation"
      [layout]="layout"
      [state]="state"
      [processing]="processing"
      [acceptDisabled]="acceptDisabled"
      (accepted)="accepts++"
      (rejected)="rejects++">
      <p lsdSuggestedChangeProvenance>Suggested from ADR 0004.</p>
      <p lsdSuggestedChangeBefore>Retry twice.</p>
      <p lsdSuggestedChangeProposed>Retry with exponential backoff.</p>
      <p lsdSuggestedChangeContext>Source confidence and queue metadata.</p>
    </lsd-suggested-change>
  `,
})
class SuggestedChangeTestHostComponent {
  layout: SuggestedChangeLayout = 'comparison';
  state: SuggestedChangeState = 'pending';
  processing: SuggestedChangeProcessing | null = null;
  acceptDisabled = false;
  accepts = 0;
  rejects = 0;
}

describe('SuggestedChangeComponent', () => {
  let fixture: ComponentFixture<SuggestedChangeTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SuggestedChangeTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SuggestedChangeTestHostComponent);
    fixture.detectChanges();
  });

  it('keeps AI attribution and review status explicit beside before and proposed content', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('AI suggested');
    expect(text).toContain('Awaiting review');
    expect(text).toContain('Not architect approved');
    expect(text).toContain('Retry twice.');
    expect(text).toContain('Retry with exponential backoff.');
    expect(fixture.debugElement.queryAll(By.css('[role="region"]')).length).toBeGreaterThanOrEqual(3);
  });

  it('supports proposal-only presentation without silently adding a before pane', () => {
    fixture.componentInstance.layout = 'proposal-only';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Retry twice.');
    expect(fixture.nativeElement.textContent).toContain('Retry with exponential backoff.');
    expect(fixture.debugElement.query(By.css('.lsd-suggested-change__content--comparison'))).toBeNull();
  });

  it('emits accept and reject intent without changing queue state', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.lsd-suggested-change__decision-actions button'));
    (buttons[0].nativeElement as HTMLButtonElement).click();
    (buttons[1].nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.rejects).toBe(1);
    expect(fixture.componentInstance.accepts).toBe(1);
    expect(fixture.componentInstance.state).toBe('pending');
  });

  it('supports caller-owned accept eligibility while keeping rejection available', () => {
    fixture.componentInstance.acceptDisabled = true;
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('.lsd-suggested-change__decision-actions button'));
    expect((buttons[0].nativeElement as HTMLButtonElement).disabled).toBeFalse();
    expect((buttons[1].nativeElement as HTMLButtonElement).disabled).toBeTrue();
  });

  it('locks decisions during processing and after queue resolution', () => {
    fixture.componentInstance.processing = 'accept';
    fixture.detectChanges();
    let buttons = fixture.debugElement.queryAll(By.css('.lsd-suggested-change__decision-actions button'));
    expect(buttons.every((item) => (item.nativeElement as HTMLButtonElement).disabled)).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Accepting suggestion');

    fixture.componentInstance.processing = null;
    fixture.componentInstance.state = 'accepted';
    fixture.detectChanges();
    buttons = fixture.debugElement.queryAll(By.css('.lsd-suggested-change__decision-actions button'));
    expect(buttons.every((item) => (item.nativeElement as HTMLButtonElement).disabled)).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Suggestion accepted');
    expect(fixture.nativeElement.textContent).toContain('Not architect approved');
  });

  it('uses native disclosure semantics for optional context', () => {
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    expect(details.textContent).toContain('Source confidence and queue metadata.');
  });
});
