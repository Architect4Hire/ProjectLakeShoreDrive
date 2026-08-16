import { ActivityAttribution } from './activity-stream.component';

interface ActivityStreamVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly attribution?: ActivityAttribution;
  readonly detailsOpen?: boolean;
  readonly empty?: boolean;
}

export const activityStreamVisualCases: readonly ActivityStreamVisualCase[] = [
  { name: 'human-history-light', appearance: 'light', viewport: 'desktop', attribution: 'human-authored' },
  { name: 'ai-suggested-dark', appearance: 'dark', viewport: 'desktop', attribution: 'ai-suggested' },
  { name: 'ai-generated-details-mobile', appearance: 'light', viewport: 'mobile', attribution: 'ai-generated', detailsOpen: true },
  { name: 'human-modified-dark-mobile', appearance: 'dark', viewport: 'mobile', attribution: 'human-modified-from-ai' },
  { name: 'human-approved-light', appearance: 'light', viewport: 'desktop', attribution: 'human-approved' },
  { name: 'system-dark', appearance: 'dark', viewport: 'desktop', attribution: 'system' },
  { name: 'empty-light-mobile', appearance: 'light', viewport: 'mobile', empty: true },
];

describe('activity stream visual coverage', () => {
  it('covers attribution, details, empty, appearance, and responsive states', () => {
    expect(new Set(activityStreamVisualCases.map((item) => item.attribution).filter(Boolean)).size).toBe(6);
    expect(activityStreamVisualCases.some((item) => item.detailsOpen)).toBeTrue();
    expect(activityStreamVisualCases.some((item) => item.empty)).toBeTrue();
    expect(new Set(activityStreamVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(activityStreamVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
  });
});
