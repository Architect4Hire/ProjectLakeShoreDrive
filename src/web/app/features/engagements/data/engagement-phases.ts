import { EngagementPhase } from '../../../../design-system/public-api';

export interface EngagementPhaseDefinition {
  readonly id: EngagementPhase;
  readonly label: string;
}

// Single source of truth for the canonical phase list (previously duplicated between
// engagement-shell.component.ts and engagement-shell.routes.ts).
export const ENGAGEMENT_PHASE_DEFINITIONS: readonly EngagementPhaseDefinition[] = [
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

export const ENGAGEMENT_PHASE_IDS: readonly EngagementPhase[] = ENGAGEMENT_PHASE_DEFINITIONS.map((p) => p.id);
