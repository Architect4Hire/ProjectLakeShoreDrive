import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AlertAnnouncement, AlertBannerComponent, AlertSeverity } from '../../components/alert-banner/alert-banner.component';
import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';

/** Semantic assessment only. Numeric scores are intentionally not part of this API. */
export type AiConfidenceLevel = 'unknown' | 'limited' | 'moderate' | 'strong';

@Component({
  selector: 'lsd-ai-confidence',
  standalone: true,
  imports: [AlertBannerComponent, BadgeComponent],
  templateUrl: './ai-confidence.component.html',
  styleUrl: './ai-confidence.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiConfidenceComponent {
  readonly id = input.required<string>();
  readonly level = input<AiConfidenceLevel>('unknown');
  readonly summary = input.required<string>();
  readonly announcement = input<AlertAnnouncement>('off');
  readonly showDetails = input(false);
  readonly detailsLabel = input('Confidence basis and limitations');
  readonly verificationLabel = input('Verify against cited sources before architect approval.');

  protected readonly presentation = computed(() => this.presentations[this.level()]);

  private readonly presentations: Record<AiConfidenceLevel, Readonly<{
    badge: string;
    title: string;
    severity: AlertSeverity;
    variant: BadgeVariant;
  }>> = {
    unknown: {
      badge: 'Confidence unknown',
      title: 'AI confidence not assessed',
      severity: 'warning',
      variant: 'warning',
    },
    limited: {
      badge: 'Limited confidence',
      title: 'AI output needs careful verification',
      severity: 'warning',
      variant: 'warning',
    },
    moderate: {
      badge: 'Moderate confidence',
      title: 'AI output requires verification',
      severity: 'info',
      variant: 'info',
    },
    strong: {
      badge: 'Stronger confidence',
      title: 'AI output still requires verification',
      severity: 'info',
      variant: 'info',
    },
  };
}
