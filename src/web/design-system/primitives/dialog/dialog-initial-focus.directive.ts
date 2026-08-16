import { Directive, ElementRef } from '@angular/core';

/** Marks the control that receives focus when its containing dialog opens. */
@Directive({
  selector: '[lsdDialogInitialFocus]',
  standalone: true,
})
export class DialogInitialFocusDirective {
  constructor(readonly elementRef: ElementRef<HTMLElement>) {}
}
