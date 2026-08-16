import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[lsdClickOutside]',
  host: {
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class ClickOutsideDirective {
  readonly clickedOutside = output<PointerEvent>();

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onDocumentPointerDown(event: PointerEvent): void {
    if (!this.hostElement.contains(event.target as Node | null)) {
      this.clickedOutside.emit(event);
    }
  }
}
