import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { provideApiConfig } from '../../../core/config/api-config';
import { EngagementWorkspaceStore } from '../data/engagement-workspace.store';
import { EngagementDetail } from '../data/engagement.models';
import { EngagementOverviewComponent } from './engagement-overview.component';

const detail: EngagementDetail = {
  id: 'e1',
  clientId: 'c1',
  clientName: 'Contoso',
  name: 'Contoso Migration',
  type: 'CloudMigration',
  businessProblem: 'Legacy platform cannot scale.',
  businessObjectives: ['Reduce downtime'],
  knownTechnologyLandscape: [],
  stakeholders: [{ name: 'Jane Doe', role: 'VP Engineering' }],
  constraints: [],
  requestedDeliverables: [],
  confidentiality: 'ClientConfidential',
  status: 'Discovery',
  createdAtUtc: '2026-01-01T00:00:00Z',
  lifecycleHistory: [
    {
      fromStatus: 'Draft',
      toStatus: 'Discovery',
      performedBy: 'pm-1',
      reason: 'Kickoff complete',
      occurredAtUtc: '2026-01-02T00:00:00Z',
    },
  ],
};

describe('EngagementOverviewComponent', () => {
  let fixture: ComponentFixture<EngagementOverviewComponent>;

  function setUp(store: Partial<EngagementWorkspaceStore>): void {
    TestBed.configureTestingModule({
      imports: [EngagementOverviewComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideApiConfig({ baseUrl: '/api' }),
        { provide: EngagementWorkspaceStore, useValue: store },
      ],
    });

    fixture = TestBed.createComponent(EngagementOverviewComponent);
  }

  it('shows a loading state while the engagement is not yet available', async () => {
    setUp({ detail: signal(undefined), loading: signal(true), error: signal(undefined) });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Loading engagement');
  });

  it('shows an error state when the fetch fails', async () => {
    setUp({ detail: signal(undefined), loading: signal(false), error: signal(new Error('Not found')) });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Not found');
  });

  it('renders BR-020 summary fields, current phase, placeholders, and lifecycle history', async () => {
    setUp({ detail: signal(detail), loading: signal(false), error: signal(undefined) });

    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Contoso');
    expect(text).toContain('Legacy platform cannot scale.');
    expect(text).toContain('Reduce downtime');
    expect(text).toContain('Jane Doe');
    expect(text).toContain('Discovery');
    expect(text).toContain('Phase 2 of 11');
    expect(text).toContain('Kickoff complete');

    // Every non-overview phase gets a "not yet available" placeholder card.
    expect(text).toContain('Requirements not yet available');
    expect(text).toContain('ADRs not yet available');
  });
});
