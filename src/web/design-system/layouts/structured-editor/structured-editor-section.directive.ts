import { Directive, input, TemplateRef } from '@angular/core';

export interface StructuredEditorTemplateContext<T> {
  readonly $implicit: T;
  readonly index: number;
  readonly count: number;
}

@Directive({ selector: 'ng-template[lsdEditorSectionContent]', standalone: true })
export class StructuredEditorSectionContentDirective<T = string> {
  readonly identity = input.required<T>({ alias: 'lsdEditorSectionContent' });
  constructor(readonly template: TemplateRef<StructuredEditorTemplateContext<T>>) {}
  static ngTemplateContextGuard<T>(
    _directive: StructuredEditorSectionContentDirective<T>,
    _context: unknown,
  ): _context is StructuredEditorTemplateContext<T> { return true; }
}

@Directive({ selector: 'ng-template[lsdEditorSectionActions]', standalone: true })
export class StructuredEditorSectionActionsDirective<T = string> {
  readonly identity = input.required<T>({ alias: 'lsdEditorSectionActions' });
  constructor(readonly template: TemplateRef<StructuredEditorTemplateContext<T>>) {}
  static ngTemplateContextGuard<T>(
    _directive: StructuredEditorSectionActionsDirective<T>,
    _context: unknown,
  ): _context is StructuredEditorTemplateContext<T> { return true; }
}
