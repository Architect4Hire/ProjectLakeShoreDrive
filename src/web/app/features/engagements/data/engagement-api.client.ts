import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api-config';
import {
  ArchiveEngagementRequest,
  CreateEngagementRequest,
  EngagementDetail,
  EngagementListQuery,
  EngagementListResult,
  SearchEngagementsQuery,
  TransitionEngagementPhaseRequest,
  UpdateEngagementRequest,
} from './engagement.models';

// Typed client for the Engagement API (BR-020..023). Feature components depend on this, never
// on HttpClient directly (angular.md: "HTTP is accessed through typed client/services").
@Injectable({ providedIn: 'root' })
export class EngagementApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/engagements`;

  list(query: EngagementListQuery): Observable<EngagementListResult> {
    return this.http.get<EngagementListResult>(this.baseUrl, { params: toParams(query) });
  }

  search(query: SearchEngagementsQuery): Observable<EngagementListResult> {
    return this.http.get<EngagementListResult>(`${this.baseUrl}/search`, { params: toParams(query) });
  }

  get(id: string): Observable<EngagementDetail> {
    return this.http.get<EngagementDetail>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateEngagementRequest): Observable<EngagementDetail> {
    return this.http.post<EngagementDetail>(this.baseUrl, request);
  }

  update(id: string, request: UpdateEngagementRequest): Observable<EngagementDetail> {
    return this.http.put<EngagementDetail>(`${this.baseUrl}/${id}`, request);
  }

  transitionPhase(id: string, request: TransitionEngagementPhaseRequest): Observable<EngagementDetail> {
    return this.http.post<EngagementDetail>(`${this.baseUrl}/${id}/phase`, request);
  }

  archive(id: string, request: ArchiveEngagementRequest): Observable<EngagementDetail> {
    return this.http.post<EngagementDetail>(`${this.baseUrl}/${id}/archive`, request);
  }
}

function toParams(query: object): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
    if (value !== undefined && value !== null) {
      params = params.set(key, String(value));
    }
  }

  return params;
}
