import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { DrawerCloseReason, DrawerComponent, DrawerPlacement, DrawerSize } from '../../primitives/drawer/drawer.component';
import { StateFeedbackComponent } from '../state-feedback/state-feedback.component';

export type SourcePreviewState = 'loading' | 'ready' | 'unavailable' | 'failed';

/** Resolvable, display-safe metadata selected and authorized by application code. */
export interface SourcePreviewMetadata {
  readonly sourceId: string;
  readonly sourceTitle: string;
  readonly sourceSection?: string;
  readonly artifactType?: string;
  readonly version?: string;
  readonly locator?: string;
}

@Component({
  selector: 'lsd-source-preview',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, DrawerComponent, StateFeedbackComponent],
  templateUrl: './source-preview.component.html',
  styleUrl: './source-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcePreviewComponent {
  readonly id = input.required<string>();
  readonly source = input.required<SourcePreviewMetadata>();
  readonly open = input(false);
  readonly state = input<SourcePreviewState>('ready');
  readonly placement = input<DrawerPlacement>('end');
  readonly size = input<DrawerSize>('wide');
  readonly dismissible = input(true);
  readonly openSourceDisabled = input(false);
  readonly loadingMessage = input('Loading source preview');
  readonly unavailableMessage = input('This source preview is unavailable.');
  readonly failureMessage = input('The source preview could not be displayed.');

  readonly closeRequested = output<DrawerCloseReason>();
  readonly retryRequested = output<SourcePreviewMetadata>();
  readonly openSourceRequested = output<SourcePreviewMetadata>();

  protected readonly drawerTitle = computed(() => `Source preview: ${this.source().sourceTitle}`);
  protected readonly drawerDescription = computed(() => {
    const section = this.source().sourceSection ? `, ${this.source().sourceSection}` : '';
    return `AI source evidence${section}. Viewing this source does not approve generated content.`;
  });

  protected retry(): void {
    if (this.state() === 'failed' || this.state() === 'unavailable') this.retryRequested.emit(this.source());
  }

  protected openSource(): void {
    if (this.state() === 'ready' && !this.openSourceDisabled()) this.openSourceRequested.emit(this.source());
  }
}
