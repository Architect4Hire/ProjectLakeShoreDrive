// RFC 7807 shape the API edge returns for every non-2xx response (ServiceDefaults.AddProblemDetails
// on the backend), plus the extensions EngagementsController adds for validation, lifecycle-conflict
// (422), and concurrency-conflict (409) failures.
export interface ProblemDetails {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly instance?: string;
  readonly traceId?: string;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
  readonly fromStatus?: string;
  readonly toStatus?: string;
  readonly allowedTransitions?: readonly string[];
}
