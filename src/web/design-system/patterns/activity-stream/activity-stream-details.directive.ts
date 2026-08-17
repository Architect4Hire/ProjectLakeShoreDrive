import { Directive, TemplateRef } from '@angular/core';

import type { ActivityStreamItem } from './activity-stream.component';

export interface ActivityStreamDetailsContext<T> {
  readonly $implicit: ActivityStreamItem<T>;
  readonly index: number;
  readonly count: number;
}

@Directive({ selector: 'ng-template[lsdActivityDetails]', standalone: true })
export class ActivityStreamDetailsDirective<T = string> {
  constructor(readonly template: TemplateRef<ActivityStreamDetailsContext<T>>) {}

  static ngTemplateContextGuard<T>(
    _directive: ActivityStreamDetailsDirective<T>,
    _context: unknown,
  ): _context is ActivityStreamDetailsContext<T> { return true; }
}
