import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TabPanelDirective } from './tab-panel.directive';

export interface TabItem<T> {
  readonly identity: T;
  readonly label: string;
  readonly disabled?: boolean;
}

export type TabCompareWith<T> = (left: T, right: T) => boolean;

@Component({
  selector: 'lsd-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, TabPanelDirective],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent<T = string> {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly tabs = input.required<readonly TabItem<T>[]>();
  readonly selected = input.required<T>();
  readonly compareWith = input<TabCompareWith<T>>((left, right) => Object.is(left, right));

  readonly selectionChange = output<T>();

  protected readonly selectedIndex = computed(() => {
    const tabs = this.tabs();
    const requested = tabs.findIndex((tab) =>
      !tab.disabled && this.compareWith()(tab.identity, this.selected()),
    );
    return requested >= 0 ? requested : tabs.findIndex((tab) => !tab.disabled);
  });
  protected readonly selectedTemplate = computed(() => {
    const index = this.selectedIndex();
    if (index < 0) {
      return null;
    }
    const selected = this.tabs()[index]!.identity;
    return this.panels().find((panel) =>
      this.compareWith()(panel.identity() as T, selected),
    )?.template ?? null;
  });

  private readonly panels = contentChildren(TabPanelDirective);
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected tabId(index: number): string { return `${this.id()}-tab-${index}`; }
  protected panelId(index: number): string { return `${this.id()}-panel-${index}`; }

  protected select(index: number, focus = false): void {
    const tab = this.tabs()[index];
    if (!tab || tab.disabled) {
      return;
    }
    this.selectionChange.emit(tab.identity);
    if (focus) {
      queueMicrotask(() => this.tabButtons()[index]?.nativeElement.focus());
    }
  }

  protected handleKeydown(event: KeyboardEvent, currentIndex: number): void {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    let nextIndex: number | undefined;

    if (direction) {
      nextIndex = this.nextEnabledIndex(currentIndex, direction);
    } else if (event.key === 'Home') {
      nextIndex = this.nextEnabledIndex(-1, 1);
    } else if (event.key === 'End') {
      nextIndex = this.nextEnabledIndex(0, -1);
    }

    if (nextIndex === undefined) {
      return;
    }
    event.preventDefault();
    this.select(nextIndex, true);
  }

  private nextEnabledIndex(currentIndex: number, direction: 1 | -1): number | undefined {
    const tabs = this.tabs();
    if (!tabs.length) {
      return undefined;
    }
    for (let offset = 1; offset <= tabs.length; offset += 1) {
      const index = (currentIndex + direction * offset + tabs.length) % tabs.length;
      if (!tabs[index]?.disabled) {
        return index;
      }
    }
    return undefined;
  }
}
