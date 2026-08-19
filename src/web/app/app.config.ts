import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideApiConfig } from './core/config/api-config';
import { provideAppHttp } from './core/http/http.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAppHttp(),
    // TODO(ADR-0011): drop developmentActor once real edge/session auth replaces the
    // Development-only debug header seam on the Engagement API.
    provideApiConfig({
      baseUrl: '/api',
      developmentActor: { userId: 'dev@architect4hire.com', role: 'PrincipalArchitect' },
    }),
  ],
};
