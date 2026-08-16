import { Component } from '@angular/core'; import { TestBed } from '@angular/core/testing'; import { By } from '@angular/platform-browser';
import { ApprovalActionsComponent } from './approval-actions.component';
@Component({ standalone: true, imports: [ApprovalActionsComponent], template: `<lsd-approval-actions id="review" provenance="ai-generated" [warnings]="['Citation missing']" (approved)="decision='approved'" (rejected)="decision='rejected'" (changeRequested)="decision='changes'"><span lsdApprovalContext>ADR-012</span></lsd-approval-actions>` }) class Host { decision?: string; }
describe('ApprovalActionsComponent', () => { it('renders attribution, warnings, labeled actions, and emits intents', async () => {
  await TestBed.configureTestingModule({ imports: [Host] }).compileComponents(); const fixture = TestBed.createComponent(Host); fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('AI generated · Not approved'); expect(fixture.nativeElement.textContent).toContain('Citation missing');
  expect(fixture.debugElement.query(By.css('[role="group"]')).nativeElement.getAttribute('aria-label')).toBe('Review decision actions');
  const buttons = fixture.debugElement.queryAll(By.css('.lsd-approval-actions__buttons lsd-button button'));
  buttons[2].nativeElement.click(); fixture.detectChanges(); expect(fixture.componentInstance.decision).toBe('approved');
}); });
