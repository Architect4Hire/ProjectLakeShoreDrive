import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';
import type { ReviewProvenance } from '../review-approval/review-approval.component';

export type AiContentState = 'draft' | 'generating' | 'suggested' | 'ready' | 'failed';
export type AiConfidence = 'none' | 'low' | 'medium' | 'high';
export type AiContentAction = 'accept' | 'reject' | 'regenerate';

/** Display-safe citation metadata selected by the consuming application. */
export interface AiSourceCitation {
  readonly id: string;
  readonly label: string;
  readonly locator?: string;
  readonly description?: string;
}

@Component({
  selector: 'lsd-ai-content',
  standalone: true,
  imports: [AlertBannerComponent, BadgeComponent, ButtonComponent, SurfaceComponent],
  templateUrl: './ai-content.component.html',
  styleUrl: './ai-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiContentComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly provenance = input.required<ReviewProvenance>();
  readonly state = input<AiContentState>('draft');
  readonly confidence = input<AiConfidence>('none');
  readonly citations = input<readonly AiSourceCitation[]>([]);
  readonly selectedCitationId = input<string | null>(null);
  /** The caller sets this only after making its own authorization decision. */
  readonly contextInspectorVisible = input(false);
  readonly processing = input<AiContentAction | null>(null);
  readonly actionsDisabled = input(false);
  readonly failureMessage = input('AI content could not be generated. Try again or continue without it.');

  readonly accepted = output<void>();
  readonly rejected = output<void>();
  readonly regenerateRequested = output<void>();
  readonly citationSelected = output<AiSourceCitation>();

  protected readonly isAiAttributed = computed(() =>
    this.provenance() === 'ai-suggested' ||
    this.provenance() === 'ai-generated' ||
    this.provenance() === 'human-modified-from-ai',
  );
  protected readonly busy = computed(() => this.state() === 'generating');
  protected readonly provenancePresentation = computed(() => this.provenanceMap[this.provenance()]);
  protected readonly stateLabel = computed(() => this.stateLabels[this.state()]);
  protected readonly confidenceLabel = computed(() =>
    this.confidence() === 'none' ? null : `${this.confidence()} confidence — verify before approval`,
  );
  protected readonly selectedCitation = computed(() =>
    this.citations().find((citation) => citation.id === this.selectedCitationId()),
  );
  protected readonly decisionsAvailable = computed(() =>
    (this.state() === 'draft' || this.state() === 'suggested' || this.state() === 'ready') &&
    this.provenance() !== 'human-approved',
  );
  protected readonly actionsUnavailable = computed(() =>
    this.actionsDisabled() || this.processing() !== null || this.busy(),
  );

  protected accept(): void {
    if (!this.unavailable()) this.accepted.emit();
  }

  protected reject(): void {
    if (!this.unavailable()) this.rejected.emit();
  }

  protected regenerate(): void {
    if (!this.unavailable()) this.regenerateRequested.emit();
  }

  protected selectCitation(citation: AiSourceCitation): void {
    this.citationSelected.emit(citation);
  }

  private unavailable(): boolean {
    return this.actionsUnavailable();
  }

  private readonly stateLabels: Record<AiContentState, string> = {
    draft: 'AI draft',
    generating: 'Generating',
    suggested: 'Suggested change',
    ready: 'Generated content',
    failed: 'AI generation failed',
  };

  private readonly provenanceMap: Record<ReviewProvenance, Readonly<{ label: string; variant: BadgeVariant }>> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' },
    'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated', variant: 'ai-draft' },
    'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
  };
}
