import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[lsdMasterDetailTrigger]',
  standalone: true,
})
export class MasterDetailTriggerDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly detailRequested = output<HTMLElement>();

  @HostListener('click')
  protected activateDetail(): void {
    this.detailRequested.emit(this.host.nativeElement);
  }
}
