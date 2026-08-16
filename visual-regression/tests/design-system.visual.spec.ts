import { expect, test } from '@playwright/test';

const cases = [
  { name: 'components-light-desktop', suite: 'components', appearance: 'light', viewport: { width: 1280, height: 1100 } },
  { name: 'components-dark-mobile', suite: 'components', appearance: 'dark', viewport: { width: 390, height: 1800 } },
  { name: 'recipes-light-desktop', suite: 'recipes', appearance: 'light', viewport: { width: 1440, height: 1200 } },
  { name: 'recipes-dark-tablet', suite: 'recipes', appearance: 'dark', viewport: { width: 768, height: 1800 } },
  { name: 'recipes-light-mobile', suite: 'recipes', appearance: 'light', viewport: { width: 390, height: 2600 } },
] as const;

for (const visualCase of cases) {
  test(visualCase.name, async ({ page }) => {
    await page.setViewportSize(visualCase.viewport);
    await page.emulateMedia({ colorScheme: visualCase.appearance, reducedMotion: 'reduce' });
    await page.addInitScript((appearance) => document.documentElement.setAttribute('data-appearance', appearance), visualCase.appearance);
    await page.goto(`/?suite=${visualCase.suite}`);
    await expect(page.locator('main.fixture-page')).toHaveAttribute('data-suite', visualCase.suite);
    await expect(page).toHaveScreenshot(`${visualCase.name}.png`, { fullPage: true });
  });
}
