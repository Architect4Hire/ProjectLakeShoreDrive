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
import { localOverlayLayers } from '../../tokens/layers';
import { panelSizes } from '../../tokens/sizing';
import { DialogInitialFocusDirective } from './dialog-initial-focus.directive';

export type DialogCloseReason = 'backdrop' | 'close-button' | 'escape';
export type DialogSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'lsd-dialog',
  standalone: true,
  imports: [DialogInitialFocusDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly open = input(false);
  readonly size = input<DialogSize>('medium');
  readonly dismissible = input(true);
  readonly closeLabel = input('Close dialog');

  /** The owner must set `open` to false when this event is emitted. */
  readonly closeRequested = output<DialogCloseReason>();

  protected readonly titleId = () => `${this.id()}-title`;
  protected readonly descriptionId = () => (this.description() ? `${this.id()}-description` : null);
  protected readonly dialogShadow = elevationTokens['overlay-prominent'];
  protected readonly contentLayer = localOverlayLayers.content;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly initialFocus = contentChild(DialogInitialFocusDirective);
  private restoreFocusTo: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const element = this.dialog().nativeElement;
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

  protected requestClose(reason: DialogCloseReason): void {
    if (!this.dismissible()) {
      return;
    }

    const element = this.dialog().nativeElement;
    element.close();
    this.restoreFocus();
    this.closeRequested.emit(reason);
  }

  protected handleCancel(event: Event): void {
    event.preventDefault();
    this.requestClose('escape');
  }

  protected handleBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.requestClose('backdrop');
    }
  }

  protected maxInlineSize(): string {
    const sizes: Record<DialogSize, string> = {
      small: panelSizes['inline-wide'],
      medium: '36rem',
      large: panelSizes['content-reading'],
    };
    return sizes[this.size()];
  }

  private focusInitialControl(dialog: HTMLDialogElement): void {
    const marked = this.initialFocus()?.elementRef.nativeElement;
    const fallback = dialog.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (marked ?? fallback ?? dialog).focus();
  }

  private restoreFocus(): void {
    if (this.restoreFocusTo?.isConnected) {
      this.restoreFocusTo.focus();
    }
    this.restoreFocusTo = null;
  }
}
