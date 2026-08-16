import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ReviewApprovalComponent, ReviewDecision, ReviewProcessingAction } from './review-approval.component';

@Component({
  standalone: true,
  imports: [ReviewApprovalComponent],
  template: `
    <lsd-review-approval
      id="proposal-review"
      title="Review proposed change"
      provenance="ai-suggested"
      [decision]="decision"
      [processing]="processing"
      [approvalDisabled]="approvalDisabled"
      (approved)="approvals++"
      (rejected)="rejections++">
      <p lsdReviewProvenance>Suggested from two governed sources.</p>
      <article lsdReviewCurrent>Current content</article>
      <article lsdReviewProposed>Proposed content</article>
      <button lsdReviewActions type="button">Inspect sources</button>
    </lsd-review-approval>
  `,
})
class ReviewApprovalTestHostComponent {
  decision: ReviewDecision = 'pending';
  processing: ReviewProcessingAction | null = null;
  approvalDisabled = false;
  approvals = 0;
  rejections = 0;
}

describe('ReviewApprovalComponent', () => {
  let fixture: ComponentFixture<ReviewApprovalTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReviewApprovalTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(ReviewApprovalTestHostComponent);
    fixture.detectChanges();
  });

  it('presents current, proposed, provenance, and pending attribution distinctly', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Current content');
    expect(text).toContain('Proposed content');
    expect(text).toContain('Suggested from two governed sources');
    expect(text).toContain('AI suggested');
    expect(text).toContain('Proposal awaiting review');
  });

  it('emits explicit approve and reject intent without mutating caller state', () => {
    const decisions = fixture.debugElement.queryAll(By.css('.lsd-review-approval__decision-actions button'));
    (decisions[0].nativeElement as HTMLButtonElement).click();
    (decisions[1].nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.rejections).toBe(1);
    expect(fixture.componentInstance.approvals).toBe(1);
    expect(fixture.componentInstance.decision).toBe('pending');
  });

  it('can require external validation before explicit approval while retaining rejection', () => {
    fixture.componentInstance.approvalDisabled = true;
    fixture.detectChanges();
    const decisions = fixture.debugElement.queryAll(By.css('.lsd-review-approval__decision-actions button'));
    expect((decisions[0].nativeElement as HTMLButtonElement).disabled).toBeFalse();
    expect((decisions[1].nativeElement as HTMLButtonElement).disabled).toBeTrue();
  });

  it('locks both decisions while one audited transition is processing', () => {
    fixture.componentInstance.processing = 'approve';
    fixture.detectChanges();
    const decisions = fixture.debugElement.queryAll(By.css('.lsd-review-approval__decision-actions button'));
    expect(decisions.every((item) => (item.nativeElement as HTMLButtonElement).disabled)).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Recording approval');
  });

  it('prevents repeated actions after a decision and announces the result', () => {
    fixture.componentInstance.decision = 'approved';
    fixture.detectChanges();
    const decisions = fixture.debugElement.queryAll(By.css('.lsd-review-approval__decision-actions button'));
    expect(decisions.every((item) => (item.nativeElement as HTMLButtonElement).disabled)).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Proposal approved');
  });
});
