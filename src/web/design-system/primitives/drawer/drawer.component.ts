import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

import { elevationTokens } from '../../tokens/elevation';
import { globalLayers } from '../../tokens/layers';
import { panelSizes } from '../../tokens/sizing';
import { DrawerInitialFocusDirective } from './drawer-initial-focus.directive';

export type DrawerCloseReason = 'backdrop' | 'close-button' | 'escape';
export type DrawerPlacement = 'start' | 'end';
export type DrawerSize = 'compact' | 'default' | 'wide';

@Component({
  selector: 'lsd-drawer',
  standalone: true,
  imports: [DrawerInitialFocusDirective],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly open = input(false);
  readonly placement = input<DrawerPlacement>('end');
  readonly size = input<DrawerSize>('default');
  readonly dismissible = input(true);
  readonly closeLabel = input('Close drawer');

  /** The owner must set `open` to false when this event is emitted. */
  readonly closeRequested = output<DrawerCloseReason>();

  protected readonly titleId = () => `${this.id()}-title`;
  protected readonly descriptionId = () => (this.description() ? `${this.id()}-description` : null);
  protected readonly drawerShadow = elevationTokens['overlay-prominent'];
  protected readonly overlayLayer = globalLayers.overlay;
  protected readonly drawerWidth = () => panelSizes[`drawer-${this.size()}`];

  private readonly drawer = viewChild.required<ElementRef<HTMLDialogElement>>('drawer');
  private readonly initialFocus = contentChild(DrawerInitialFocusDirective);
  private restoreFocusTo: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const element = this.drawer().nativeElement;
      if (this.open() && !element.open) {
        this.restoreFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        element.showModal();
        queueMicrotask(() => this.focusInitialControl(element));
      } else if (!this.open() && element.open) {
        element.close();
        this.restoreFocus();
      }
    });
  }

  protected requestClose(reason: DrawerCloseReason): void {
    if (!this.dismissible()) {
      return;
    }
    this.drawer().nativeElement.close();
    this.restoreFocus();
    this.closeRequested.emit(reason);
  }

  protected handleCancel(event: Event): void {
    event.preventDefault();
    this.requestClose('escape');
  }

  protected handleBackdrop(event: MouseEvent): void {
    if (event.target === this.drawer().nativeElement) {
      this.requestClose('backdrop');
    }
  }

  private focusInitialControl(drawer: HTMLDialogElement): void {
    const marked = this.initialFocus()?.elementRef.nativeElement;
    const fallback = drawer.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (marked ?? fallback ?? drawer).focus();
  }

  private restoreFocus(): void {
    if (this.restoreFocusTo?.isConnected) {
      this.restoreFocusTo.focus();
    }
    this.restoreFocusTo = null;
  }
}
