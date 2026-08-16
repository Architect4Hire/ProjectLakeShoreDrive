import type { EngagementPhase, EngagementPhaseState, PhaseNavigationOrientation } from './phase-navigation.component';

interface PhaseNavigationVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly orientation: PhaseNavigationOrientation;
  readonly active: EngagementPhase;
  readonly emphasizedState: EngagementPhaseState;
}

export const phaseNavigationVisualCases: readonly PhaseNavigationVisualCase[] = [
  { name: 'overview-light-horizontal-desktop', appearance: 'light', viewport: 'desktop', orientation: 'horizontal', active: 'overview', emphasizedState: 'available' },
  { name: 'architecture-dark-horizontal-desktop', appearance: 'dark', viewport: 'desktop', orientation: 'horizontal', active: 'architecture', emphasizedState: 'completed' },
  { name: 'requirements-light-vertical-tablet', appearance: 'light', viewport: 'tablet', orientation: 'vertical', active: 'requirements', emphasizedState: 'attention' },
  { name: 'documents-dark-vertical-tablet', appearance: 'dark', viewport: 'tablet', orientation: 'vertical', active: 'documents', emphasizedState: 'completed' },
  { name: 'discovery-light-horizontal-mobile', appearance: 'light', viewport: 'mobile', orientation: 'horizontal', active: 'discovery', emphasizedState: 'attention' },
  { name: 'ai-dark-horizontal-mobile', appearance: 'dark', viewport: 'mobile', orientation: 'horizontal', active: 'ai', emphasizedState: 'active' },
];

describe('phase navigation visual coverage', () => {
  it('covers appearance, responsive widths, orientations, and every phase state', () => {
    expect(new Set(phaseNavigationVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(phaseNavigationVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(phaseNavigationVisualCases.map((item) => item.orientation))).toEqual(new Set(['horizontal', 'vertical']));
    expect(new Set(phaseNavigationVisualCases.map((item) => item.emphasizedState)))
      .toEqual(new Set(['available', 'active', 'completed', 'attention']));
  });
});
