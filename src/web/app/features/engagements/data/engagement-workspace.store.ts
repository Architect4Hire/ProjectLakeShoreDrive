import { Injectable, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { EngagementApiClient } from './engagement-api.client';

// Route-scoped (provided per ':id' route, not root) so the shell header and the overview page
// share exactly one fetch of the current engagement instead of each issuing their own GET.
@Injectable()
export class EngagementWorkspaceStore {
  private readonly api = inject(EngagementApiClient);
  private readonly route = inject(ActivatedRoute);

  private readonly engagementId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  private readonly resource = rxResource({
    params: () => this.engagementId(),
    stream: ({ params: id }) => this.api.get(id),
  });

  readonly detail = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  readonly loading = computed(() => this.resource.isLoading());
  readonly error = computed(() => this.resource.error());

  reload(): void {
    this.resource.reload();
  }
}
