import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChild, effect, input, output, signal, viewChildren } from '@angular/core';

import { SurfaceComponent } from '../../primitives/surface/surface.component';
import { FilterActionBarComponent } from '../filter-action-bar/filter-action-bar.component';
import { StateFeedbackComponent } from '../state-feedback/state-feedback.component';
import { SearchResultContentDirective, SearchResultDetailsDirective } from './search-result-details.directive';

export type SearchQueryState = 'idle' | 'loading' | 'ready' | 'error';

export interface SearchResultMetadata {
  readonly label: string;
  readonly value: string;
}

export interface SearchResultItem<T> {
  readonly identity: T;
  readonly title: string;
  readonly description?: string;
  readonly metadata?: readonly SearchResultMetadata[];
  readonly hasDetails?: boolean;
}

@Component({
  selector: 'lsd-search-results',
  standalone: true,
  imports: [FilterActionBarComponent, NgTemplateOutlet, SearchResultContentDirective, SearchResultDetailsDirective, StateFeedbackComponent, SurfaceComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent<T = string> {
  readonly id = input.required<string>();
  readonly accessibleName = input('Search results');
  readonly query = input('');
  readonly state = input<SearchQueryState>('idle');
  readonly results = input.required<readonly SearchResultItem<T>[]>();
  readonly totalResults = input<number | undefined>(undefined);
  readonly activeFilterCount = input(0);
  readonly detailsLabel = input('Show result details');
  readonly idleTitle = input('Search for records');
  readonly emptyTitle = input('No results found');
  readonly errorTitle = input('Search could not be completed');
  readonly errorDescription = input('Check the query or filters and try again.');

  readonly resultActivated = output<T>();
  readonly resultFocused = output<T>();

  protected readonly detailsTemplate = contentChild(SearchResultDetailsDirective<T>);
  protected readonly contentTemplate = contentChild(SearchResultContentDirective<T>);
  protected readonly resultElements = viewChildren<ElementRef<HTMLElement>>('resultItem');
  protected readonly activeIndex = signal(0);
  protected readonly normalizedTotal = computed(() =>
    Math.max(0, Math.floor(this.totalResults() ?? this.results().length)),
  );
  protected readonly resultSummary = computed(() => {
    const count = this.normalizedTotal();
    const noun = count === 1 ? 'result' : 'results';
    return this.query().trim() ? `${count} ${noun} for “${this.query().trim()}”` : `${count} ${noun}`;
  });

  constructor() {
    effect(() => {
      this.results();
      this.activeIndex.set(0);
    });
  }

  protected focusResult(index: number): void {
    const items = this.results();
    if (!items.length) return;
    const normalized = (index + items.length) % items.length;
    this.activeIndex.set(normalized);
    this.resultElements()[normalized]?.nativeElement.focus();
  }

  protected handleResultKeydown(event: KeyboardEvent, index: number, identity: T): void {
    if (event.target !== event.currentTarget) return;
    const destinations: Partial<Record<string, number>> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: this.results().length - 1,
    };
    const destination = destinations[event.key];
    if (destination !== undefined) {
      event.preventDefault();
      this.focusResult(destination);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.resultActivated.emit(identity);
    }
  }
}
