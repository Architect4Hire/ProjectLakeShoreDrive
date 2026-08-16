import { Directive, ElementRef } from '@angular/core';

/** Marks the control that receives focus when its containing drawer opens. */
@Directive({
  selector: '[lsdDrawerInitialFocus]',
  standalone: true,
})
export class DrawerInitialFocusDirective {
  constructor(readonly elementRef: ElementRef<HTMLElement>) {}
}
