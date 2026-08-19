import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideApiConfig } from '../../../core/config/api-config';
import { EngagementApiClient } from './engagement-api.client';
import { CreateEngagementRequest, EngagementDetail, EngagementListResult } from './engagement.models';

describe('EngagementApiClient', () => {
  let client: EngagementApiClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiConfig({ baseUrl: '/api' })],
    });

    client = TestBed.inject(EngagementApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const sampleDetail: EngagementDetail = {
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

  it('list() issues a GET with only the defined filters as query params', () => {
    let result: EngagementListResult | undefined;
    client.list({ status: 'Discovery', page: 2, pageSize: 10 }).subscribe((r) => (result = r));

    const req = httpMock.expectOne(
      (r) => r.url === '/api/engagements' && r.method === 'GET',
    );
    expect(req.request.params.get('status')).toBe('Discovery');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.has('clientId')).toBe(false);

    const body: EngagementListResult = { items: [], totalCount: 0, page: 2, pageSize: 10 };
    req.flush(body);
    expect(result).toEqual(body);
  });

  it('list() omits undefined filters entirely rather than sending empty strings', () => {
    client.list({}).subscribe();

    const req = httpMock.expectOne((r) => r.url === '/api/engagements');
    expect(req.request.params.keys().length).toBe(0);
    req.flush({ items: [], totalCount: 0, page: 1, pageSize: 25 });
  });

  it('list() forwards includeArchived=true', () => {
    client.list({ includeArchived: true }).subscribe();

    const req = httpMock.expectOne((r) => r.url === '/api/engagements');
    expect(req.request.params.get('includeArchived')).toBe('true');
    req.flush({ items: [], totalCount: 0, page: 1, pageSize: 25 });
  });

  it('search() issues a GET against /engagements/search with searchText', () => {
    client.search({ searchText: 'contoso' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === '/api/engagements/search');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('searchText')).toBe('contoso');
    req.flush({ items: [], totalCount: 0, page: 1, pageSize: 25 });
  });

  it('get() issues a GET against /engagements/{id}', () => {
    let result: EngagementDetail | undefined;
    client.get('e1').subscribe((r) => (result = r));

    const req = httpMock.expectOne('/api/engagements/e1');
    expect(req.request.method).toBe('GET');
    req.flush(sampleDetail);
    expect(result).toEqual(sampleDetail);
  });

  it('create() POSTs the request body to /engagements', () => {
    const request: CreateEngagementRequest = {
      clientId: 'c1',
      clientName: 'Contoso',
      name: 'Contoso Migration',
      type: 'CloudMigration',
      businessProblem: 'Legacy platform cannot scale.',
      confidentiality: 'ClientConfidential',
    };
    client.create(request).subscribe();

    const req = httpMock.expectOne('/api/engagements');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(sampleDetail);
  });

  it('update() PUTs to /engagements/{id}', () => {
    client
      .update('e1', {
        engagementId: 'e1',
        name: 'Renamed',
        type: 'CloudMigration',
        businessProblem: 'Updated.',
        confidentiality: 'ClientConfidential',
      })
      .subscribe();

    const req = httpMock.expectOne('/api/engagements/e1');
    expect(req.request.method).toBe('PUT');
    req.flush(sampleDetail);
  });

  it('transitionPhase() POSTs to /engagements/{id}/phase', () => {
    client
      .transitionPhase('e1', { engagementId: 'e1', targetStatus: 'Discovery', performedBy: 'pm-1' })
      .subscribe();

    const req = httpMock.expectOne('/api/engagements/e1/phase');
    expect(req.request.method).toBe('POST');
    req.flush(sampleDetail);
  });

  it('archive() POSTs to /engagements/{id}/archive', () => {
    client.archive('e1', { engagementId: 'e1', performedBy: 'pm-1' }).subscribe();

    const req = httpMock.expectOne('/api/engagements/e1/archive');
    expect(req.request.method).toBe('POST');
    req.flush(sampleDetail);
  });
});
