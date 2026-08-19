import { HttpInterceptorFn } from '@angular/common/http';

const CORRELATION_HEADER = 'X-Correlation-Id';

// Mints a correlation id for every outgoing API request that doesn't already carry one, so a
// user action can be traced end to end (observability.md) even before the API edge exists.
export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has(CORRELATION_HEADER)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { [CORRELATION_HEADER]: crypto.randomUUID() } }));
};
