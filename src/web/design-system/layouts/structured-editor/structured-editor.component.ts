import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { globalLayers } from '../../tokens/layers';

import {
  StructuredEditorSectionActionsDirective,
  StructuredEditorSectionContentDirective,
  StructuredEditorTemplateContext,
} from './structured-editor-section.directive';

export type StructuredEditorSaveState = 'saved' | 'dirty' | 'saving' | 'error';

export interface StructuredEditorSection<T> {
  readonly identity: T;
  readonly title: string;
  readonly description?: string;
}

export type StructuredEditorCompareWith<T> = (left: T, right: T) => boolean;

@Component({
  selector: 'lsd-structured-editor',
  standalone: true,
  imports: [NgTemplateOutlet, StructuredEditorSectionContentDirective, StructuredEditorSectionActionsDirective],
  templateUrl: './structured-editor.component.html',
  styleUrl: './structured-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructuredEditorComponent<T = string> {
  readonly id = input.required<string>();
  readonly accessibleName = input.required<string>();
  readonly sections = input.required<readonly StructuredEditorSection<T>[]>();
  readonly saveState = input<StructuredEditorSaveState>('saved');
  readonly saveError = input<string | undefined>(undefined);
  readonly splitViewAvailable = input(false);
  readonly contextLabel = input('Context');
  readonly showContextLabel = input('Show context');
  readonly hideContextLabel = input('Hide context');
  readonly splitViewOpen = model(false);
  readonly compareWith = input<StructuredEditorCompareWith<T>>((left, right) => Object.is(left, right));

  protected readonly stickyLayer = globalLayers.sticky;

  private readonly contents = contentChildren(StructuredEditorSectionContentDirective);
  private readonly sectionActions = contentChildren(StructuredEditorSectionActionsDirective);
  private readonly contextPane = viewChild.required<ElementRef<HTMLElement>>('contextPane');
  private readonly contextToggle = viewChild<ElementRef<HTMLButtonElement>>('contextToggle');

  protected contentFor(identity: T): StructuredEditorSectionContentDirective<T> | undefined {
    return this.contents().find((item) => this.compareWith()(item.identity() as T, identity)) as
      StructuredEditorSectionContentDirective<T> | undefined;
  }

  protected actionsFor(identity: T): StructuredEditorSectionActionsDirective<T> | undefined {
    return this.sectionActions().find((item) => this.compareWith()(item.identity() as T, identity)) as
      StructuredEditorSectionActionsDirective<T> | undefined;
  }

  protected contextFor(section: StructuredEditorSection<T>, index: number): StructuredEditorTemplateContext<T> {
    return { $implicit: section.identity, index, count: this.sections().length };
  }

  protected toggleContext(): void {
    const opening = !this.splitViewOpen();
    this.splitViewOpen.set(opening);
    queueMicrotask(() => {
      if (opening) this.contextPane().nativeElement.focus();
      else this.contextToggle()?.nativeElement.focus();
    });
  }

  protected statusText(): string {
    if (this.saveState() === 'saving') return 'Saving changes';
    if (this.saveState() === 'dirty') return 'Unsaved changes';
    if (this.saveState() === 'error') return this.saveError() ?? 'Changes could not be saved';
    return 'All changes saved';
  }
}
