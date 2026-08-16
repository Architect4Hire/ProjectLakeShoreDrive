import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';

export type SplitViewPane = 'context' | 'output';
export type SplitViewRatio = 'context-wide' | 'balanced' | 'output-wide';

@Component({
  selector: 'lsd-split-view',
  standalone: true,
  imports: [ButtonComponent, SurfaceComponent],
  templateUrl: './split-view.component.html',
  styleUrl: './split-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitViewComponent {
  readonly id = input.required<string>();
  readonly accessibleName = input.required<string>();
  readonly contextLabel = input('Context');
  readonly outputLabel = input('Output');
  readonly ratio = input<SplitViewRatio>('balanced');
  readonly compactPane = model<SplitViewPane>('output');

  private readonly contextPane = viewChild.required<ElementRef<HTMLElement>>('contextPane');
  private readonly outputPane = viewChild.required<ElementRef<HTMLElement>>('outputPane');

  protected showPane(pane: SplitViewPane): void {
    this.compactPane.set(pane);
    const target = pane === 'context' ? this.contextPane : this.outputPane;
    setTimeout(() => target().nativeElement.focus());
  }
}
