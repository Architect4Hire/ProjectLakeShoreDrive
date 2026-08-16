import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';

@Component({
  selector: 'lsd-filter-action-bar',
  standalone: true,
  templateUrl: './filter-action-bar.component.html',
  styleUrl: './filter-action-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterActionBarComponent {
  readonly id = input.required<string>();
  readonly accessibleName = input.required<string>();
  readonly filtersLabel = input('Filters');
  readonly actionsLabel = input('Actions');
  readonly activeFilterCount = input(0);
  readonly filtersExpanded = model(false);

  protected readonly filters = viewChild.required<ElementRef<HTMLElement>>('filters');
  protected readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>('toggle');

  protected toggleFilters(): void {
    const collapsing = this.filtersExpanded();
    if (collapsing && this.filters().nativeElement.contains(document.activeElement)) {
      this.toggle().nativeElement.focus();
    }
    this.filtersExpanded.set(!collapsing);
  }

  protected normalizedCount(): number {
    return Math.max(0, Math.floor(this.activeFilterCount()));
  }
}
