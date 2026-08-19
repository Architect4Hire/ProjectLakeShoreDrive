import { InjectionToken, Provider } from '@angular/core';

// Single browser-facing API base (ADR-0010: one API edge, never per-service hostnames).
// Components never read this directly; only the typed API clients under core/http and
// feature data services do.
export interface ApiConfig {
  readonly baseUrl: string;
  // Development-only debug identity forwarded by DevelopmentActorInterceptor until the real
  // ADR-0011 cookie/edge-token auth exists. Omit outside local development.
  readonly developmentActor?: {
    readonly userId: string;
    readonly role: string;
  };
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

export function provideApiConfig(config: ApiConfig): Provider {
  return { provide: API_CONFIG, useValue: config };
}
