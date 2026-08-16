import { Directive, signal } from '@angular/core';

@Directive({
  selector: '[lsdTooltipTrigger]',
  standalone: true,
  host: {
    '[attr.aria-describedby]': 'descriptionId()',
  },
})
export class TooltipTriggerDirective {
  protected readonly descriptionId = signal<string | null>(null);

  setDescriptionId(id: string): void {
    this.descriptionId.set(id);
  }
}
