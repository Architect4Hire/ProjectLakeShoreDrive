import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorException } from '../../../core/http/api-error';
import { EngagementApiClient } from '../data/engagement-api.client';
import {
  ArchiveEngagementRequest,
  EngagementDetail,
  EngagementStatus,
  TransitionEngagementPhaseRequest,
} from '../data/engagement.models';
import { EngagementPhaseTransitionComponent } from './engagement-phase-transition.component';

const engagementWithStatus = (status: EngagementStatus): EngagementDetail => ({
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
  status,
  createdAtUtc: '2026-01-01T00:00:00Z',
  lifecycleHistory: [],
});

class FakeEngagementApiClient {
  transitionCalls: { id: string; request: TransitionEngagementPhaseRequest }[] = [];
  archiveCalls: { id: string; request: ArchiveEngagementRequest }[] = [];
  next$: Subject<EngagementDetail> = new Subject();

  transitionPhase(id: string, request: TransitionEngagementPhaseRequest): Observable<EngagementDetail> {
    this.transitionCalls.push({ id, request });
    return this.next$.asObservable();
  }

  archive(id: string, request: ArchiveEngagementRequest): Observable<EngagementDetail> {
    this.archiveCalls.push({ id, request });
    return this.next$.asObservable();
  }
}

interface TestableComponent {
  readonly transitionOptions: {
    (): readonly { status: EngagementStatus; allowed: boolean; reason: string | undefined }[];
  };
  readonly dialogOpen: { (): boolean };
  readonly errorMessage: { (): string | undefined };
  readonly concurrencyConflict: { (): boolean };
  requestTransition(status: EngagementStatus): void;
  cancel(): void;
  confirm(): void;
}

describe('EngagementPhaseTransitionComponent', () => {
  let fixture: ComponentFixture<EngagementPhaseTransitionComponent>;
  let instance: TestableComponent;
  let api: FakeEngagementApiClient;

  beforeEach(async () => {
    api = new FakeEngagementApiClient();

    await TestBed.configureTestingModule({
      imports: [EngagementPhaseTransitionComponent],
      providers: [provideZonelessChangeDetection(), { provide: EngagementApiClient, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(EngagementPhaseTransitionComponent);
    instance = fixture.componentInstance as unknown as TestableComponent;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setEngagement(status: EngagementStatus): void {
    fixture.componentRef.setInput('engagement', engagementWithStatus(status));
    fixture.detectChanges();
  }

  it('for Draft, only Discovery and Archived are allowed; everything else is disabled with a reason', () => {
    setEngagement('Draft');

    const options = instance.transitionOptions();
    const allowed = options.filter((o) => o.allowed).map((o) => o.status);
    expect(allowed.sort()).toEqual(['Archived', 'Discovery'].sort());

    const blocked = options.filter((o) => !o.allowed);
    expect(blocked.length).toBe(options.length - 2);
    expect(blocked.every((o) => !!o.reason)).toBe(true);
  });

  it('for Archived, nothing is allowed and the reason states the terminal rule', () => {
    setEngagement('Archived');

    const options = instance.transitionOptions();
    expect(options.every((o) => !o.allowed)).toBe(true);
    expect(options[0]?.reason).toContain('archived');
  });

  it('does not call the API until the transition is confirmed', () => {
    setEngagement('Draft');

    instance.requestTransition('Discovery');
    expect(instance.dialogOpen()).toBe(true);
    expect(api.transitionCalls.length).toBe(0);
  });

  it('confirm() posts the target status and reason to the API', () => {
    setEngagement('Draft');

    instance.requestTransition('Discovery');
    instance.confirm();

    expect(api.transitionCalls.length).toBe(1);
    expect(api.transitionCalls[0]?.request.targetStatus).toBe('Discovery');
    expect(api.transitionCalls[0]?.id).toBe('e1');
  });

  it('on success, emits transitioned and closes the dialog', () => {
    setEngagement('Draft');
    const emitted: EngagementDetail[] = [];
    fixture.componentInstance.transitioned.subscribe((detail) => emitted.push(detail));

    instance.requestTransition('Discovery');
    instance.confirm();
    api.next$.next(engagementWithStatus('Discovery'));
    api.next$.complete();

    expect(instance.dialogOpen()).toBe(false);
    expect(emitted.length).toBe(1);
    expect(emitted[0]?.status).toBe('Discovery');
  });

  it('on 422, shows the server reason and re-derives allowed transitions from the response', () => {
    setEngagement('Draft');

    instance.requestTransition('Architecture');
    instance.confirm();
    api.next$.error(
      new ApiErrorException({
        kind: 'lifecycleConflict',
        status: 422,
        message: "Cannot move from 'Draft' to 'Architecture'.",
        fromStatus: 'Draft',
        toStatus: 'Architecture',
        allowedTransitions: ['Discovery'],
      }),
    );

    expect(instance.errorMessage()).toBe("Cannot move from 'Draft' to 'Architecture'.");

    const options = instance.transitionOptions();
    const allowed = options.filter((o) => o.allowed).map((o) => o.status);
    expect(allowed).toEqual(['Discovery']);
  });

  it('on 409, prompts to reload', () => {
    setEngagement('Draft');

    instance.requestTransition('Discovery');
    instance.confirm();
    api.next$.error(new ApiErrorException({ kind: 'concurrencyConflict', status: 409, message: 'Stale write.' }));

    expect(instance.concurrencyConflict()).toBe(true);
    expect(instance.errorMessage()).toBe('Stale write.');
  });

  it('cancel() closes the dialog without calling the API', () => {
    setEngagement('Draft');

    instance.requestTransition('Discovery');
    instance.cancel();

    expect(instance.dialogOpen()).toBe(false);
    expect(api.transitionCalls.length).toBe(0);
  });

  it('archiving posts to the archive endpoint, not transitionPhase', () => {
    setEngagement('Draft');

    instance.requestTransition('Archived');
    instance.confirm();

    expect(api.archiveCalls.length).toBe(1);
    expect(api.transitionCalls.length).toBe(0);
  });

  it('no code path other than confirm() can invoke transitionPhase or archive', () => {
    setEngagement('Draft');

    // Merely deriving options / opening the dialog must never call the API.
    instance.transitionOptions();
    instance.requestTransition('Discovery');
    instance.cancel();
    instance.requestTransition('Architecture');
    instance.cancel();

    expect(api.transitionCalls.length).toBe(0);
    expect(api.archiveCalls.length).toBe(0);
  });
});
