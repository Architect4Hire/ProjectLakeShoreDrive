import type { RequirementPriority } from './requirement-row.component';

interface RequirementRowVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'tablet' | 'mobile';
  readonly priority: RequirementPriority;
  readonly references: 'many' | 'single' | 'none';
  readonly actions: 'present' | 'absent';
}

export const requirementRowVisualCases: readonly RequirementRowVisualCase[] = [
  { name: 'approved-light-desktop', appearance: 'light', viewport: 'desktop', priority: 'medium', references: 'many', actions: 'present' },
  { name: 'ai-draft-dark-desktop', appearance: 'dark', viewport: 'desktop', priority: 'high', references: 'single', actions: 'present' },
  { name: 'blocked-light-tablet', appearance: 'light', viewport: 'tablet', priority: 'critical', references: 'many', actions: 'present' },
  { name: 'draft-dark-tablet', appearance: 'dark', viewport: 'tablet', priority: 'low', references: 'none', actions: 'absent' },
  { name: 'long-title-light-mobile', appearance: 'light', viewport: 'mobile', priority: 'high', references: 'many', actions: 'present' },
  { name: 'minimal-dark-mobile', appearance: 'dark', viewport: 'mobile', priority: 'low', references: 'none', actions: 'absent' },
];

describe('requirement row visual coverage', () => {
  it('covers appearance, responsive modes, priorities, reference density, and actions', () => {
    expect(new Set(requirementRowVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(requirementRowVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'tablet', 'mobile']));
    expect(new Set(requirementRowVisualCases.map((item) => item.priority))).toEqual(new Set(['critical', 'high', 'medium', 'low']));
    expect(new Set(requirementRowVisualCases.map((item) => item.references))).toEqual(new Set(['many', 'single', 'none']));
    expect(new Set(requirementRowVisualCases.map((item) => item.actions))).toEqual(new Set(['present', 'absent']));
  });
});
