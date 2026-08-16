import { Directive, input, TemplateRef } from '@angular/core';

/** Supplies typed panel content to its containing `lsd-tabs` component. */
@Directive({
  selector: 'ng-template[lsdTabPanel]',
  standalone: true,
})
export class TabPanelDirective<T = string> {
  readonly identity = input.required<T>({ alias: 'lsdTabPanel' });

  constructor(readonly template: TemplateRef<unknown>) {}
}
