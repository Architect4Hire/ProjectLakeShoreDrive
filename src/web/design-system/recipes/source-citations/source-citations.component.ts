import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { CitationChipComponent, type CitationReference } from '../../components';
import { type DrawerCloseReason, SurfaceComponent } from '../../primitives';
import {
  SourcePreviewComponent,
  type SourcePreviewMetadata,
  type SourcePreviewState,
} from '../../patterns';

export interface SourceCitationItem extends SourcePreviewMetadata {
  readonly disabled?: boolean;
}

@Component({
  selector: 'lsd-source-citations',
  standalone: true,
  imports: [CitationChipComponent, SourcePreviewComponent, SurfaceComponent],
  templateUrl: './source-citations.component.html',
  styleUrl: './source-citations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceCitationsComponent {
  readonly id = input.required<string>();
  readonly label = input('Sources used');
  readonly citations = input.required<readonly SourceCitationItem[]>();
  readonly selectedSourceId = input<string | undefined>(undefined);
  readonly previewOpen = input(false);
  readonly previewState = input<SourcePreviewState>('ready');
  readonly openSourceDisabled = input(false);

  readonly selectionRequested = output<SourceCitationItem>();
  readonly previewCloseRequested = output<DrawerCloseReason>();
  readonly previewRetryRequested = output<SourceCitationItem>();
  readonly openSourceRequested = output<SourceCitationItem>();

  protected readonly previewId = computed(() => `${this.id()}-preview`);
  protected readonly selectedSource = computed(() =>
    this.citations().find((citation) => citation.sourceId === this.selectedSourceId()),
  );

  protected select(reference: CitationReference): void {
    const citation = this.citations().find((item) => item.sourceId === reference.sourceId);
    if (citation && !citation.disabled) this.selectionRequested.emit(citation);
  }

  protected retry(source: SourcePreviewMetadata): void {
    const citation = this.resolve(source);
    if (citation) this.previewRetryRequested.emit(citation);
  }

  protected openSource(source: SourcePreviewMetadata): void {
    const citation = this.resolve(source);
    if (citation) this.openSourceRequested.emit(citation);
  }

  private resolve(source: SourcePreviewMetadata): SourceCitationItem | undefined {
    return this.citations().find((item) => item.sourceId === source.sourceId);
  }
}
