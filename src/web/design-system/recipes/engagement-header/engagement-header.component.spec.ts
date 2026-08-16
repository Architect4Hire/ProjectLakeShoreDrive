import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  EngagementHeaderComponent,
  type EngagementHeaderViewModel,
  type EngagementLifecycleStatus,
} from './engagement-header.component';

@Component({
  standalone: true,
  imports: [EngagementHeaderComponent],
  template: `
    <lsd-engagement-header [engagement]="engagement" [headingLevel]="2">
      <button lsdEngagementHeaderActions type="button">Edit engagement</button>
      <a lsdEngagementHeaderContextSwitcher href="/requirements">Requirements</a>
    </lsd-engagement-header>
  `,
})
class EngagementHeaderTestHostComponent {
  engagement: EngagementHeaderViewModel = {
    id: 'northwind-modernization',
    name: 'Commerce modernization',
    clientName: 'Northwind Traders',
    engagementType: 'Application Modernization',
    status: 'discovery',
    clientMetadata: [
      { label: 'Industry', value: 'Retail' },
      { label: 'Region', value: 'North America' },
    ],
  };
}

describe('EngagementHeaderComponent', () => {
  let fixture: ComponentFixture<EngagementHeaderTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EngagementHeaderTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(EngagementHeaderTestHostComponent);
    fixture.detectChanges();
  });

  it('renders typed identity, status, and client metadata', () => {
    const region = fixture.debugElement.query(By.css('[role="region"]')).nativeElement as HTMLElement;
    const terms = fixture.debugElement.queryAll(By.css('dt')).map((item) => item.nativeElement.textContent.trim());
    const values = fixture.debugElement.queryAll(By.css('dd')).map((item) => item.nativeElement.textContent.trim());
    expect(region.getAttribute('aria-label')).toBe('Engagement: Commerce modernization');
    expect(region.textContent).toContain('Northwind Traders');
    expect(region.textContent).toContain('Discovery');
    expect(terms).toEqual(['Industry', 'Region']);
    expect(values).toEqual(['Retail', 'North America']);
  });

  it('uses the configured heading level and labels projected controls', () => {
    expect(fixture.debugElement.query(By.css('h1'))).toBeNull();
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Commerce modernization');
    expect(fixture.debugElement.query(By.css('[role="group"]')).nativeElement.getAttribute('aria-label')).toBe('Engagement actions');
    expect(fixture.debugElement.query(By.css('nav')).nativeElement.getAttribute('aria-label')).toBe('Switch engagement context');
    expect(fixture.debugElement.query(By.css('nav')).nativeElement.textContent).toContain('Requirements');
  });

  it('has a presentation for every canonical lifecycle status', () => {
    const statuses: readonly EngagementLifecycleStatus[] = [
      'draft', 'discovery', 'analysis', 'architecture', 'estimation', 'package-generation',
      'review', 'approved', 'delivery', 'closed', 'archived',
    ];
    for (const status of statuses) {
      fixture.componentInstance.engagement = { ...fixture.componentInstance.engagement, status };
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('lsd-badge')).nativeElement.textContent.trim()).not.toBe('');
    }
  });
});
