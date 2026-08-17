import { Directive, TemplateRef } from '@angular/core';

import type { SearchResultItem } from './search-results.component';

export interface SearchResultDetailsContext<T> {
  readonly $implicit: SearchResultItem<T>;
  readonly index: number;
  readonly count: number;
}

@Directive({ selector: 'ng-template[lsdSearchResultDetails]', standalone: true })
export class SearchResultDetailsDirective<T = string> {
  constructor(readonly template: TemplateRef<SearchResultDetailsContext<T>>) {}

  static ngTemplateContextGuard<T>(
    _directive: SearchResultDetailsDirective<T>,
    _context: unknown,
  ): _context is SearchResultDetailsContext<T> { return true; }
}

@Directive({ selector: 'ng-template[lsdSearchResultContent]', standalone: true })
export class SearchResultContentDirective<T = string> {
  constructor(readonly template: TemplateRef<SearchResultDetailsContext<T>>) {}

  static ngTemplateContextGuard<T>(
    _directive: SearchResultContentDirective<T>,
    _context: unknown,
  ): _context is SearchResultDetailsContext<T> { return true; }
}
