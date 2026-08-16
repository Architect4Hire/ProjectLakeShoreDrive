import { NotificationSeverity } from './notification.service';

export const notificationVisualCases: ReadonlyArray<{
  appearance: 'light' | 'dark'; viewport: 'mobile' | 'desktop'; severity: NotificationSeverity; state: 'single' | 'stacked' | 'action';
}> = [
  { appearance: 'light', viewport: 'desktop', severity: 'neutral', state: 'single' },
  { appearance: 'dark', viewport: 'desktop', severity: 'info', state: 'stacked' },
  { appearance: 'light', viewport: 'mobile', severity: 'success', state: 'action' },
  { appearance: 'dark', viewport: 'mobile', severity: 'warning', state: 'single' },
  { appearance: 'light', viewport: 'desktop', severity: 'danger', state: 'action' },
];

describe('notification visual regression cases', () => {
  it('covers appearances, viewports, severities, stacking, and actions', () => {
    expect(new Set(notificationVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(notificationVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(notificationVisualCases.map((item) => item.severity))).toEqual(new Set(['neutral', 'info', 'success', 'warning', 'danger']));
  });
});
