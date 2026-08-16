import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent, BadgeVariant } from '../../primitives/badge/badge.component';
import { ButtonComponent } from '../../primitives/button/button.component';
import { SurfaceComponent } from '../../primitives/surface/surface.component';
import { SplitViewComponent } from '../split-view/split-view.component';

export type DocumentVersionStatus = 'current' | 'draft' | 'approved';
export type DocumentVersionAuthorship = 'human' | 'ai' | 'human-modified-ai';

export interface DocumentVersionPresentation {
  readonly versionId: string;
  readonly label: string;
  readonly status: DocumentVersionStatus;
  readonly authorship: DocumentVersionAuthorship;
  readonly changedBy?: string;
  readonly changedAt?: string;
  readonly promptVersion?: string;
  readonly sourceCount?: number;
}

export interface VersionRegenerationRequest {
  readonly baseVersionId: string;
  readonly comparedVersionId: string;
}

@Component({
  selector: 'lsd-version-comparison',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, SplitViewComponent, SurfaceComponent],
  templateUrl: './version-comparison.component.html',
  styleUrl: './version-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionComparisonComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly baseVersion = input.required<DocumentVersionPresentation>();
  readonly comparedVersion = input.required<DocumentVersionPresentation>();
  readonly regenerateAvailable = input(true);
  readonly regenerateDisabled = input(false);
  readonly regenerating = input(false);
  readonly regenerateLabel = input('Regenerate from current version');

  readonly regenerationRequested = output<VersionRegenerationRequest>();

  protected readonly containsDraft = computed(() =>
    this.baseVersion().status === 'draft' || this.comparedVersion().status === 'draft',
  );
  protected readonly basePresentation = computed(() => this.statusMap[this.baseVersion().status]);
  protected readonly comparedPresentation = computed(() => this.statusMap[this.comparedVersion().status]);

  protected requestRegeneration(): void {
    if (!this.regenerateAvailable() || this.regenerateDisabled() || this.regenerating()) return;
    this.regenerationRequested.emit({
      baseVersionId: this.baseVersion().versionId,
      comparedVersionId: this.comparedVersion().versionId,
    });
  }

  protected authorshipLabel(authorship: DocumentVersionAuthorship): string {
    return this.authorshipLabels[authorship];
  }

  private readonly statusMap: Record<DocumentVersionStatus, Readonly<{ label: string; variant: BadgeVariant }>> = {
    current: { label: 'Current version', variant: 'neutral' },
    draft: { label: 'AI draft — not approved', variant: 'ai-draft' },
    approved: { label: 'Architect approved', variant: 'approved' },
  };

  private readonly authorshipLabels: Record<DocumentVersionAuthorship, string> = {
    human: 'Human authored',
    ai: 'AI generated',
    'human-modified-ai': 'Human modified from AI',
  };
}
