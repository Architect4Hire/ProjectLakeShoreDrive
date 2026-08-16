import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';

/** Display-safe reference metadata supplied by application code. */
export interface CitationReference {
  readonly sourceId: string;
  readonly sourceTitle: string;
  readonly sourceSection?: string;
}

@Component({
  selector: 'lsd-citation-chip',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent],
  templateUrl: './citation-chip.component.html',
  styleUrl: './citation-chip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationChipComponent {
  readonly citation = input.required<CitationReference>();
  /** ID of the caller-rendered preview region, dialog, or drawer controlled by this trigger. */
  readonly previewId = input.required<string>();
  readonly previewOpen = input(false);
  readonly disabled = input(false);
  readonly showSourceId = input(true);

  readonly previewRequested = output<CitationReference>();

  protected readonly accessibleLabel = computed(() => {
    const citation = this.citation();
    const section = citation.sourceSection ? `, section ${citation.sourceSection}` : '';
    return `Preview AI source ${citation.sourceTitle}${section}, source identifier ${citation.sourceId}`;
  });

  protected requestPreview(): void {
    if (!this.disabled()) this.previewRequested.emit(this.citation());
  }
}
