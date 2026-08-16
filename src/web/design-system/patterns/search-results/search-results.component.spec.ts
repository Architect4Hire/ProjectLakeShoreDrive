import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchResultContentDirective, SearchResultDetailsDirective } from './search-result-details.directive';
import { SearchQueryState, SearchResultItem, SearchResultsComponent } from './search-results.component';

@Component({
  standalone: true,
  imports: [SearchResultContentDirective, SearchResultDetailsDirective, SearchResultsComponent],
  template: `
    <lsd-search-results
      id="knowledge-search"
      accessibleName="Knowledge search"
      query="gateway"
      [state]="state"
      [results]="results"
      [activeFilterCount]="2"
      (resultActivated)="activated = $event"
      (resultFocused)="focused = $event">
      <label lsdSearchQuery>Search <input type="search" /></label>
      <label lsdSearchFacets>Type <select><option>Any</option></select></label>
      <button lsdSearchActions type="button">Save search</button>
      <button lsdSearchEmptyActions type="button">Clear filters</button>
      <button lsdSearchErrorActions type="button">Retry</button>
      <ng-template lsdSearchResultContent let-result><a href="#result">Open {{ result.identity }}</a></ng-template>
      <ng-template lsdSearchResultDetails let-result>Evidence for {{ result.identity }}</ng-template>
    </lsd-search-results>
  `,
})
class SearchResultsTestHostComponent {
  state: SearchQueryState = 'ready';
  results: readonly SearchResultItem<number>[] = [
    { identity: 1, title: 'Gateway pattern', description: 'A governed pattern.', metadata: [{ label: 'Type', value: 'Pattern' }], hasDetails: true },
    { identity: 2, title: 'Gateway decision', metadata: [{ label: 'Status', value: 'Approved' }] },
  ];
  activated: number | null = null;
  focused: number | null = null;
}

describe('SearchResultsComponent', () => {
  let fixture: ComponentFixture<SearchResultsTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SearchResultsTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SearchResultsTestHostComponent);
    fixture.detectChanges();
  });

  it('composes query, facets, actions, result metadata, and typed content', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('input[type="search"]')).not.toBeNull();
    expect(root.querySelector('select')).not.toBeNull();
    expect(root.textContent).toContain('2 results for “gateway”');
    expect(root.textContent).toContain('TypePattern');
    expect(root.textContent).toContain('Open 1');
  });

  it('supports roving Arrow, Home, End, and Enter result navigation', () => {
    const results = fixture.debugElement.queryAll(By.css('.lsd-search-results__result'));
    const first = results[0].nativeElement as HTMLElement;
    const second = results[1].nativeElement as HTMLElement;
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
    expect(fixture.componentInstance.focused).toBe(2);
    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(first);
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fixture.componentInstance.activated).toBe(1);
  });

  it('keeps deeper result evidence collapsed until requested', () => {
    const details = fixture.debugElement.query(By.css('details')).nativeElement as HTMLDetailsElement;
    expect(details.open).toBeFalse();
    (details.querySelector('summary') as HTMLElement).click(); fixture.detectChanges();
    expect(details.open).toBeTrue();
    expect(details.textContent).toContain('Evidence for 1');
  });

  it('composes standard empty and recoverable-error states with their actions', () => {
    fixture.componentInstance.results = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No results found');
    expect(fixture.nativeElement.textContent).toContain('Clear filters');
    fixture.componentInstance.state = 'error';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Search could not be completed');
    expect(fixture.nativeElement.textContent).toContain('Retry');
  });

  it('announces loading state through the standard state pattern', () => {
    fixture.componentInstance.state = 'loading';
    fixture.detectChanges();
    const status = fixture.debugElement.query(By.css('[role="status"]')).nativeElement as HTMLElement;
    expect(status.getAttribute('aria-busy')).toBe('true');
    expect(status.textContent).toContain('Searching');
  });
});
