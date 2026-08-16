import type { EngagementLifecycleStatus } from './engagement-header.component';

interface EngagementHeaderVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly status: EngagementLifecycleStatus;
  readonly metadata: 'standard' | 'long' | 'none';
  readonly actions: 'present' | 'absent';
}

export const engagementHeaderVisualCases: readonly EngagementHeaderVisualCase[] = [
  { name: 'discovery-light-desktop', appearance: 'light', viewport: 'desktop', status: 'discovery', metadata: 'standard', actions: 'present' },
  { name: 'review-dark-desktop', appearance: 'dark', viewport: 'desktop', status: 'review', metadata: 'long', actions: 'present' },
  { name: 'approved-light-tablet', appearance: 'light', viewport: 'tablet', status: 'approved', metadata: 'standard', actions: 'present' },
  { name: 'draft-dark-tablet', appearance: 'dark', viewport: 'tablet', status: 'draft', metadata: 'none', actions: 'absent' },
  { name: 'delivery-light-mobile', appearance: 'light', viewport: 'mobile', status: 'delivery', metadata: 'long', actions: 'present' },
  { name: 'archived-dark-mobile', appearance: 'dark', viewport: 'mobile', status: 'archived', metadata: 'none', actions: 'absent' },
];

describe('engagement header visual coverage', () => {
  it('covers appearance, width, lifecycle treatments, metadata, and actions', () => {
    expect(new Set(engagementHeaderVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(engagementHeaderVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(engagementHeaderVisualCases.map((item) => item.metadata))).toEqual(new Set(['standard', 'long', 'none']));
    expect(new Set(engagementHeaderVisualCases.map((item) => item.actions))).toEqual(new Set(['present', 'absent']));
    expect(engagementHeaderVisualCases.some((item) => item.status === 'approved')).toBeTrue();
    expect(engagementHeaderVisualCases.some((item) => item.status === 'archived')).toBeTrue();
  });
});
