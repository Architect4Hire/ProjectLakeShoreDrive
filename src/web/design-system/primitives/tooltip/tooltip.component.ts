import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  HostListener,
  input,
  signal,
} from '@angular/core';

import { elevationTokens } from '../../tokens/elevation';
import { globalLayers } from '../../tokens/layers';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'lsd-tooltip',
  standalone: true,
  imports: [TooltipTriggerDirective],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  readonly id = input.required<string>();
  readonly text = input.required<string>();
  readonly placement = input<TooltipPlacement>('top');

  protected readonly tooltipId = computed(() => `${this.id()}-tooltip`);
  protected readonly open = computed(
    () => (this.hovered() || this.focused()) && !this.escapeDismissed(),
  );
  protected readonly tooltipClass = computed(() =>
    [
      'pointer-events-none absolute max-w-64 rounded-control border border-border-default bg-surface-raised px-2.5 py-1.5 text-xs text-text-primary',
      this.placementClasses[this.placement()],
    ].join(' '),
  );
  protected readonly tooltipShadow = elevationTokens.popover;
  protected readonly tooltipLayer = globalLayers.tooltip;

  private readonly trigger = contentChild(TooltipTriggerDirective);
  private readonly hovered = signal(false);
  private readonly focused = signal(false);
  private readonly escapeDismissed = signal(false);

  constructor() {
    effect(() => this.trigger()?.setDescriptionId(this.tooltipId()));
  }

  protected showFromPointer(): void {
    if (!this.hovered() && !this.focused()) {
      this.escapeDismissed.set(false);
    }
    this.hovered.set(true);
  }

  protected hideFromPointer(): void {
    this.hovered.set(false);
    if (!this.focused()) {
      this.escapeDismissed.set(false);
    }
  }

  protected showFromFocus(): void {
    if (!this.hovered() && !this.focused()) {
      this.escapeDismissed.set(false);
    }
    this.focused.set(true);
  }

  protected hideFromFocus(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (host.contains(event.relatedTarget as Node | null)) {
      return;
    }

    this.focused.set(false);
    if (!this.hovered()) {
      this.escapeDismissed.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected dismiss(): void {
    if (this.open()) {
      this.escapeDismissed.set(true);
    }
  }

  private readonly placementClasses: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
    bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  };
}
