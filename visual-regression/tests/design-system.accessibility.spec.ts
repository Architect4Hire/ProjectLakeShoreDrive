import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const representativeSuites = ['components', 'recipes', 'errors'] as const;

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  const unexplained = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
  expect(unexplained, results.violations.map(({ id, impact, help }) => `${impact}: ${id} — ${help}`).join('\n')).toEqual([]);
}

for (const appearance of ['light', 'dark'] as const) {
  for (const suite of representativeSuites) {
    test(`${suite} has no critical or serious WCAG violations in ${appearance}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: appearance, reducedMotion: 'reduce' });
      await page.addInitScript((value) => document.documentElement.setAttribute('data-appearance', value), appearance);
      await page.goto(`/?suite=${suite}`);
      await expectNoAxeViolations(page);
    });
  }
}

test('keyboard focus is visible and named controls remain operable', async ({ page }) => {
  await page.goto('/?suite=components');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
  await expect(focused).toHaveAccessibleName(/dismiss|platform strategy|browse|discovery/i);
  expect(await focused.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
});

test('errors and live regions expose programmatic relationships', async ({ page }) => {
  await page.goto('/?suite=errors');
  const field = page.locator('input#engagement-name');
  await expect(field).toHaveAccessibleName(/engagement name/i);
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toHaveAttribute('aria-errormessage', 'engagement-name-error');
  await expect(page.locator('#engagement-name-error')).toHaveRole('alert');
  await expect(page.getByRole('alert')).toHaveCount(3);
});

for (const overlay of ['dialog', 'drawer'] as const) {
  test(`${overlay} is modal, named, described, focused, and axe-clean`, async ({ page }) => {
    await page.goto(`/?suite=${overlay}`);
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAccessibleName(overlay === 'dialog' ? 'Review decision' : 'Source preview');
    await expect(modal).toHaveAttribute('aria-describedby', overlay === 'dialog' ? 'review-dialog-description' : 'source-drawer-description');
    await expect(modal.locator(':focus')).toBeVisible();
    await expectNoAxeViolations(page);
  });
}

test('reduced-motion media is active and fixture transitions are disabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?suite=recipes');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  const durations = await page.locator('main *').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transitionDuration));
  expect(new Set(durations)).toEqual(new Set(['0s']));
});
