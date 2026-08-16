import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BadgeComponent, DrawerComponent, type DrawerCloseReason, SurfaceComponent } from '../../primitives';
import { AiContentComponent, type AiGenerationState, AiGenerationProgressComponent, type AiProgressMode, type ReviewProvenance } from '../../patterns';

export interface AiGenerationContextSummary { readonly label: string; readonly count: number; }
export interface AiGenerationDrawerViewModel {
  readonly operation: string;
  readonly target: string;
  readonly state: AiGenerationState;
  readonly provenance: ReviewProvenance;
  readonly context: readonly AiGenerationContextSummary[];
  readonly progressMode?: AiProgressMode;
  readonly progressValue?: number;
  readonly progressMax?: number;
  readonly announcement?: string;
}

@Component({ selector: 'lsd-ai-generation-drawer', standalone: true,
  imports: [AiContentComponent, AiGenerationProgressComponent, BadgeComponent, DrawerComponent, SurfaceComponent],
  templateUrl: './ai-generation-drawer.component.html', styleUrl: './ai-generation-drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class AiGenerationDrawerComponent {
  readonly id = input.required<string>(); readonly model = input.required<AiGenerationDrawerViewModel>();
  readonly open = input(false); readonly cancellable = input(true); readonly actionsDisabled = input(false);
  readonly closeRequested = output<DrawerCloseReason>(); readonly cancelRequested = output<void>();
  readonly accepted = output<void>(); readonly rejected = output<void>(); readonly regenerateRequested = output<void>();
  protected readonly active = computed(() => this.model().state === 'generating' || this.model().state === 'cancelling');
  protected readonly contentState = computed(() => this.model().state === 'failed' ? 'failed' : this.active() ? 'generating' : 'draft');
}
