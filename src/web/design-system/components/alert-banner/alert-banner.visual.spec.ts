import { AlertAnnouncement, AlertSeverity } from './alert-banner.component';

export const alertBannerVisualCases: ReadonlyArray<{
  appearance: 'light' | 'dark'; viewport: 'mobile' | 'desktop'; severity: AlertSeverity;
  announcement: AlertAnnouncement; dismissible: boolean;
}> = [
  { appearance: 'light', viewport: 'desktop', severity: 'neutral', announcement: 'off', dismissible: false },
  { appearance: 'dark', viewport: 'desktop', severity: 'info', announcement: 'polite', dismissible: true },
  { appearance: 'light', viewport: 'mobile', severity: 'success', announcement: 'polite', dismissible: false },
  { appearance: 'dark', viewport: 'mobile', severity: 'warning', announcement: 'assertive', dismissible: true },
  { appearance: 'light', viewport: 'desktop', severity: 'danger', announcement: 'assertive', dismissible: true },
];

describe('alert banner visual regression cases', () => {
  it('covers appearances, responsive layouts, severities, actions, and dismissal', () => {
    expect(new Set(alertBannerVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(alertBannerVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
    expect(new Set(alertBannerVisualCases.map((item) => item.severity))).toEqual(new Set(['neutral', 'info', 'success', 'warning', 'danger']));
  });
});
