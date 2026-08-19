import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_CONFIG } from '../config/api-config';

const USER_HEADER = 'X-Debug-User';
const ROLE_HEADER = 'X-Debug-Role';

// Forwards the configured Development-only debug identity so the API's dev header auth seam
// (ADR-0011 defers real identity) has someone to authenticate. Inert when API_CONFIG carries
// no developmentActor, and deleted entirely once the real edge/session auth lands.
export const developmentActorInterceptor: HttpInterceptorFn = (req, next) => {
  const actor = inject(API_CONFIG).developmentActor;

  if (!actor) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        [USER_HEADER]: actor.userId,
        [ROLE_HEADER]: actor.role,
      },
    }),
  );
};
