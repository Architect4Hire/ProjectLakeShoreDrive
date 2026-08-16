import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './visual-regression/tests',
  snapshotDir: './visual-regression/baselines',
  outputDir: './visual-regression/results',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css', maxDiffPixelRatio: 0 } },
  use: { baseURL: 'http://127.0.0.1:4207', browserName: 'chromium', locale: 'en-US', timezoneId: 'America/Chicago', colorScheme: 'light', reducedMotion: 'reduce' },
  webServer: { command: 'npm run start:visual', url: 'http://127.0.0.1:4207', reuseExistingServer: false, timeout: 120_000 },
});
