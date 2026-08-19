import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { EngagementApiClient } from '../data/engagement-api.client';
import { EngagementDetail } from '../data/engagement.models';
import { EngagementShellComponent } from './engagement-shell.component';

class FakeActivatedRoute {
  readonly paramMap = of(convertToParamMap({ id: 'e1' }));
  readonly snapshot = { paramMap: convertToParamMap({ id: 'e1' }) };
}

class FakeEngagementApiClient {
  nextDetail: EngagementDetail | undefined;

  get(): Observable<EngagementDetail> {
    return of(this.nextDetail!);
  }
}

const baseDetail: EngagementDetail = {
  id: 'e1',
  clientId: 'c1',
  clientName: 'Contoso',
  name: 'Contoso Migration',
  type: 'CloudMigration',
  businessProblem: 'Legacy platform cannot scale.',
  businessObjectives: [],
  knownTechnologyLandscape: [],
  stakeholders: [],
  constraints: [],
  requestedDeliverables: [],
  confidentiality: 'ClientConfidential',
  status: 'Analysis',
  createdAtUtc: '2026-01-01T00:00:00Z',
  lifecycleHistory: [],
};

interface TestableShell {
  readonly phaseStates: { (): Record<string, string> };
}

describe('EngagementShellComponent', () => {
  let fixture: ComponentFixture<EngagementShellComponent>;
  let instance: TestableShell;
  let api: FakeEngagementApiClient;

  beforeEach(async () => {
    api = new FakeEngagementApiClient();
    api.nextDetail = baseDetail;

    await TestBed.configureTestingModule({
      imports: [EngagementShellComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new FakeActivatedRoute() },
        { provide: EngagementApiClient, useValue: api },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EngagementShellComponent);
    instance = fixture.componentInstance as unknown as TestableShell;
  });

  it('renders the engagement header once the workspace loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Contoso Migration');
    expect(text).toContain('Contoso');
  });

  it('marks phases before the current lifecycle position as completed, per real engagement data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // baseDetail.status = 'Analysis' (lifecycle index 2): overview(0) and discovery(1) precede
    // it, architecture(3) and estimates(4) follow.
    const states = instance.phaseStates();
    expect(states['overview']).toBe('completed');
    expect(states['discovery']).toBe('completed');
    expect(states['architecture']).toBe('available');
    expect(states['estimates']).toBe('available');
  });
});
