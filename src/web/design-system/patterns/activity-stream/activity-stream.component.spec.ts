import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActivityStreamComponent, ActivityStreamItem } from './activity-stream.component';
import { ActivityStreamDetailsDirective } from './activity-stream-details.directive';

@Component({
  standalone: true,
  imports: [ActivityStreamComponent, ActivityStreamDetailsDirective],
  template: `
    <lsd-activity-stream id="history" accessibleName="Record history" [items]="items">
      <ng-template lsdActivityDetails let-item let-index="index">
        Detail {{ index + 1 }} for {{ item.identity }}
      </ng-template>
    </lsd-activity-stream>
  `,
})
class ActivityStreamTestHostComponent {
  items: readonly ActivityStreamItem<number>[] = [
    {
      identity: 1,
      actor: 'Alex Morgan',
      occurredAt: '2026-08-16T14:30:00Z',
      timestampLabel: 'August 16, 2026 at 9:30 AM',
      action: 'updated the proposal',
      attribution: 'human-modified-from-ai',
      source: 'Architecture review',
      hasDetails: true,
    },
    {
      identity: 2,
      actor: 'Generation service',
      occurredAt: '2026-08-16T14:00:00Z',
      timestampLabel: 'August 16, 2026 at 9:00 AM',
      action: 'created a draft',
      attribution: 'ai-generated',
    },
  ];
}

describe('ActivityStreamComponent', () => {
  let fixture: ComponentFixture<ActivityStreamTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ActivityStreamTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(ActivityStreamTestHostComponent);
    fixture.detectChanges();
  });

  it('renders an ordered, labeled chronology with actors and actions', () => {
    const list = fixture.debugElement.query(By.css('ol')).nativeElement as HTMLOListElement;
    expect(list.getAttribute('aria-label')).toBe('Record history');
    const events = list.querySelectorAll('li');
    expect(events.length).toBe(2);
    expect(events[0].textContent).toContain('Alex Morgan updated the proposal');
    expect(events[1].textContent).toContain('Generation service created a draft');
  });

  it('preserves machine timestamps while showing caller-localized labels', () => {
    const time = fixture.debugElement.query(By.css('time')).nativeElement as HTMLTimeElement;
    expect(time.dateTime).toBe('2026-08-16T14:30:00Z');
    expect(time.textContent).toContain('August 16, 2026 at 9:30 AM');
  });

  it('distinguishes AI/source attribution with semantic badges and source text', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Human modified from AI');
    expect(text).toContain('AI generated');
    expect(text).toContain('Architecture review');
  });

  it('keeps typed details collapsed until explicitly expanded', () => {
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    (details.querySelector('summary') as HTMLElement).click();
    fixture.detectChanges();
    expect(details.open).toBeTrue();
    expect(details.textContent).toContain('Detail 1 for 1');
  });

  it('composes the standard empty-state pattern', () => {
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lsd-state-feedback'))).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No activity yet');
  });
});
