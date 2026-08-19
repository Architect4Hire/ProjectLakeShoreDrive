import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorException } from '../../../core/http/api-error';
import { EngagementApiClient } from '../data/engagement-api.client';
import { CreateEngagementRequest, EngagementDetail } from '../data/engagement.models';
import { EngagementCreateComponent } from './engagement-create.component';

const validDetail: EngagementDetail = {
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
  status: 'Draft',
  createdAtUtc: '2026-01-01T00:00:00Z',
  lifecycleHistory: [],
};

class FakeEngagementApiClient {
  createCalls: CreateEngagementRequest[] = [];
  nextResult: Observable<EngagementDetail> = of(validDetail);

  create(request: CreateEngagementRequest): Observable<EngagementDetail> {
    this.createCalls.push(request);
    return this.nextResult;
  }
}

interface TestableComponent {
  readonly form: {
    invalid: boolean;
    controls: {
      clientId: { setValue(v: string): void; valid: boolean };
      clientName: { setValue(v: string): void };
      name: { setValue(v: string): void };
      businessProblem: { setValue(v: string): void; errors: Record<string, unknown> | null };
      timelineStartDate: { setValue(v: string): void };
      timelineTargetEndDate: { setValue(v: string): void };
    };
    errors: Record<string, unknown> | null;
  };
  readonly bannerErrors: { (): readonly string[] };
  submit(): void;
}

const VALID_GUID = '11111111-1111-1111-1111-111111111111';

describe('EngagementCreateComponent', () => {
  let fixture: ComponentFixture<EngagementCreateComponent>;
  let instance: TestableComponent;
  let api: FakeEngagementApiClient;
  let router: Router;

  beforeEach(async () => {
    api = new FakeEngagementApiClient();

    await TestBed.configureTestingModule({
      imports: [EngagementCreateComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: EngagementApiClient, useValue: api },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EngagementCreateComponent);
    instance = fixture.componentInstance as unknown as TestableComponent;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function fillValidForm(): void {
    instance.form.controls.clientId.setValue(VALID_GUID);
    instance.form.controls.clientName.setValue('Contoso');
    instance.form.controls.name.setValue('Contoso Migration');
    instance.form.controls.businessProblem.setValue('Legacy platform cannot scale.');
  }

  it('blocks submission when required fields are empty', () => {
    instance.submit();

    expect(instance.form.invalid).toBe(true);
    expect(api.createCalls.length).toBe(0);
  });

  it('rejects a malformed client id', () => {
    instance.form.controls.clientId.setValue('not-a-guid');
    expect(instance.form.controls.clientId.valid).toBe(false);
  });

  it('flags an end date earlier than the start date', () => {
    fillValidForm();
    instance.form.controls.timelineStartDate.setValue('2026-06-01');
    instance.form.controls.timelineTargetEndDate.setValue('2026-01-01');

    expect(instance.form.errors?.['timelineOrder']).toBe(true);
  });

  it('submits a valid form and navigates to the new engagement', () => {
    fillValidForm();
    const navigateSpy = vi.spyOn(router, 'navigate');

    instance.submit();

    expect(api.createCalls.length).toBe(1);
    expect(api.createCalls[0]?.clientId).toBe(VALID_GUID);
    expect(api.createCalls[0]?.name).toBe('Contoso Migration');
    expect(navigateSpy).toHaveBeenCalledWith(['/engagements', 'e1']);
  });

  it('maps a 400 field error onto the matching control and shows any unmatched errors in the banner', () => {
    fillValidForm();
    api.nextResult = throwError(
      () =>
        new ApiErrorException({
          kind: 'validation',
          status: 400,
          message: 'Validation failed.',
          fieldErrors: {
            BusinessProblem: ['Business problem is required.'],
            'Stakeholders[0].Name': ['Stakeholder name is required.'],
          },
        }),
    );

    instance.submit();

    expect(instance.form.controls.businessProblem.errors?.['server']).toBe('Business problem is required.');
    expect(instance.bannerErrors()).toContain('Stakeholder name is required.');
  });
});
