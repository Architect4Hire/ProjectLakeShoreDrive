import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { apiErrorInterceptor } from './api-error.interceptor';
import { correlationInterceptor } from './correlation.interceptor';
import { developmentActorInterceptor } from './development-actor.interceptor';

export function provideAppHttp(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(
      withInterceptors([correlationInterceptor, developmentActorInterceptor, apiErrorInterceptor]),
    ),
  ];
}
