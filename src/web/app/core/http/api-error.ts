import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetails } from './problem-details';

export type ApiErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'lifecycleConflict'
  | 'concurrencyConflict'
  | 'network'
  | 'unknown';

// Normalized shape every API client method surfaces on failure, so components branch on
// `kind` rather than parsing HTTP status codes or ProblemDetails shapes themselves.
export interface ApiError {
  readonly kind: ApiErrorKind;
  readonly message: string;
  readonly status: number;
  readonly traceId?: string | undefined;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>> | undefined;
  readonly fromStatus?: string | undefined;
  readonly toStatus?: string | undefined;
  readonly allowedTransitions?: readonly string[] | undefined;
}

// A real Error subclass (not just a plain object shaped like ApiError) because Angular's
// `resource`/`rxResource` requires thrown values to be actual Error instances, and every
// EngagementApiClient call may be driven through a resource.
export class ApiErrorException extends Error implements ApiError {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly traceId?: string | undefined;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>> | undefined;
  readonly fromStatus?: string | undefined;
  readonly toStatus?: string | undefined;
  readonly allowedTransitions?: readonly string[] | undefined;

  constructor(details: ApiError) {
    super(details.message);
    this.name = 'ApiErrorException';
    this.kind = details.kind;
    this.status = details.status;
    this.traceId = details.traceId;
    this.fieldErrors = details.fieldErrors;
    this.fromStatus = details.fromStatus;
    this.toStatus = details.toStatus;
    this.allowedTransitions = details.allowedTransitions;
  }
}

function kindForStatus(status: number): ApiErrorKind {
  switch (status) {
    case 400:
      return 'validation';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'notFound';
    case 409:
      return 'concurrencyConflict';
    case 422:
      return 'lifecycleConflict';
    default:
      return status === 0 ? 'network' : 'unknown';
  }
}

export function toApiError(response: HttpErrorResponse): ApiErrorException {
  const problem = isProblemDetails(response.error) ? response.error : undefined;

  return new ApiErrorException({
    kind: kindForStatus(response.status),
    status: response.status,
    message: problem?.detail ?? problem?.title ?? response.message ?? 'The request failed.',
    traceId: problem?.traceId,
    fieldErrors: problem?.errors,
    fromStatus: problem?.fromStatus,
    toStatus: problem?.toStatus,
    allowedTransitions: problem?.allowedTransitions,
  });
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === 'object' && value !== null;
}
