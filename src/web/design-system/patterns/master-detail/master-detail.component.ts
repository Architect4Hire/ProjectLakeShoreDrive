import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';

export type MasterDetailView = 'master' | 'detail';

@Component({
  selector: 'lsd-master-detail',
  standalone: true,
  imports: [ButtonComponent, SurfaceComponent],
  templateUrl: './master-detail.component.html',
  styleUrl: './master-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDetailComponent {
  readonly id = input.required<string>();
  readonly masterLabel = input.required<string>();
  readonly detailLabel = input.required<string>();
  readonly backLabel = input('Back to list');
  readonly detailAvailable = input(true);
  readonly view = model<MasterDetailView>('master');

  private readonly detailPane = viewChild.required<ElementRef<HTMLElement>>('detailPane');
  private readonly masterPane = viewChild.required<ElementRef<HTMLElement>>('masterPane');
  private lastTrigger: HTMLElement | null = null;

  openDetail(trigger?: HTMLElement): void {
    if (!this.detailAvailable()) return;
    this.lastTrigger = trigger ?? null;
    this.view.set('detail');
    this.focusAfterRender(this.detailPane);
  }

  protected showMaster(): void {
    this.view.set('master');
    const target = this.lastTrigger?.isConnected ? this.lastTrigger : this.masterPane().nativeElement;
    setTimeout(() => target.focus());
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement>): void {
    setTimeout(() => target().nativeElement.focus());
  }
}
