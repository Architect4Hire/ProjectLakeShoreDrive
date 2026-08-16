import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeComponent, type BadgeVariant, SeparatorComponent, SurfaceComponent } from '../../primitives';

export type AdrProvenance = 'human-authored' | 'ai-suggested' | 'ai-generated' | 'human-modified-from-ai' | 'human-approved';
export interface AdrStatusPresentation { readonly label: string; readonly variant: BadgeVariant; }
export interface AdrLinkedReference { readonly id: string; readonly label: string; }
export interface AdrSummaryViewModel {
  readonly number: string;
  readonly title: string;
  readonly status: AdrStatusPresentation;
  readonly decision: string;
  readonly rationaleSummary: string;
  readonly provenance: AdrProvenance;
  readonly linkedRequirements?: readonly AdrLinkedReference[];
  readonly linkedPatterns?: readonly AdrLinkedReference[];
}

@Component({
  selector: 'lsd-adr-summary', standalone: true,
  imports: [BadgeComponent, SeparatorComponent, SurfaceComponent],
  templateUrl: './adr-summary.component.html', styleUrl: './adr-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdrSummaryComponent {
  readonly adr = input.required<AdrSummaryViewModel>();
  readonly headingLevel = input<2 | 3 | 4>(3);
  readonly actionsLabel = input('ADR actions');
  protected readonly headingId = computed(() => `adr-${this.adr().number}-title`);
  protected readonly provenancePresentation = computed(() => this.provenanceMap[this.adr().provenance]);

  private readonly provenanceMap: Record<AdrProvenance, Readonly<{ label: string; variant: BadgeVariant }>> = {
    'human-authored': { label: 'Human authored', variant: 'neutral' },
    'ai-suggested': { label: 'AI suggested', variant: 'suggested' },
    'ai-generated': { label: 'AI generated · Not approved', variant: 'ai-draft' },
    'human-modified-from-ai': { label: 'Human modified from AI', variant: 'info' },
    'human-approved': { label: 'Human approved', variant: 'approved' },
  };
}
