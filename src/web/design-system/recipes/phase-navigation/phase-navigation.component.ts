import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BadgeComponent, type BadgeVariant, ButtonComponent, type ButtonTone, SurfaceComponent } from '../../primitives';

export type EngagementPhase =
  | 'overview'
  | 'discovery'
  | 'requirements'
  | 'architecture'
  | 'adrs'
  | 'raid'
  | 'estimates'
  | 'documents'
  | 'ai';

export type EngagementPhaseState = 'available' | 'active' | 'completed' | 'attention';
export type PhaseNavigationOrientation = 'horizontal' | 'vertical';
export type EngagementPhaseStates = Readonly<Partial<Record<EngagementPhase, EngagementPhaseState>>>;

export interface EngagementPhaseItem {
  readonly id: EngagementPhase;
  readonly label: string;
}

interface PhaseStatePresentation {
  readonly badge: string | undefined;
  readonly variant: BadgeVariant;
  readonly tone: ButtonTone;
}

const canonicalPhases: readonly EngagementPhaseItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'adrs', label: 'ADRs' },
  { id: 'raid', label: 'RAID' },
  { id: 'estimates', label: 'Estimates' },
  { id: 'documents', label: 'Documents' },
  { id: 'ai', label: 'AI' },
];

@Component({
  selector: 'lsd-phase-navigation',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, SurfaceComponent],
  templateUrl: './phase-navigation.component.html',
  styleUrl: './phase-navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseNavigationComponent {
  readonly label = input('Engagement phases');
  readonly orientation = input<PhaseNavigationOrientation>('horizontal');
  readonly states = input<EngagementPhaseStates>({});

  readonly phaseRequested = output<EngagementPhase>();

  protected readonly phases = canonicalPhases;

  protected stateOf(phase: EngagementPhase): EngagementPhaseState {
    return this.states()[phase] ?? 'available';
  }

  protected presentationOf(phase: EngagementPhase): PhaseStatePresentation {
    return this.statePresentations[this.stateOf(phase)];
  }

  protected requestPhase(phase: EngagementPhase): void {
    this.phaseRequested.emit(phase);
  }

  private readonly statePresentations: Record<EngagementPhaseState, PhaseStatePresentation> = {
    available: { badge: undefined, variant: 'neutral', tone: 'neutral' },
    active: { badge: 'Current', variant: 'info', tone: 'primary' },
    completed: { badge: 'Completed', variant: 'success', tone: 'success' },
    attention: { badge: 'Needs attention', variant: 'warning', tone: 'warning' },
  };
}
