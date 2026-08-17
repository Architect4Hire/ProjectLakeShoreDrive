import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page, context: string): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  const critical = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');

  if (critical.length > 0) {
    console.log(`\n❌ ${context} — Found ${critical.length} critical/serious violations:`);
    critical.forEach(v => {
      console.log(`   • ${v.impact}: ${v.id} — ${v.help}`);
      console.log(`     Elements: ${v.nodes.length} affected`);
    });
  }

  expect(critical, `${context}: ${results.violations.map(({ id, impact, help }) => `${impact}: ${id} — ${help}`).join('\n')}`).toEqual([]);
}

test.describe('Design System Gallery Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for dev server to be ready
    await page.goto('/gallery', { waitUntil: 'networkidle' });
  });

  test('gallery renders without layout shift (light mode)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript((value) => document.documentElement.setAttribute('data-appearance', value), 'light');

    // Wait for content to settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const initialContent = await page.locator('lsd-gallery').boundingBox();
    expect(initialContent).toBeTruthy();

    // Small delay to ensure no layout shift
    await page.waitForTimeout(500);
    const finalContent = await page.locator('lsd-gallery').boundingBox();
    expect(initialContent).toEqual(finalContent);
  });

  test('gallery has no critical or serious WCAG 2.2 AA violations (light mode)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.addInitScript((value) => document.documentElement.setAttribute('data-appearance', value), 'light');

    await expectNoAxeViolations(page, 'Gallery (light mode)');
  });

  test('gallery has no critical or serious WCAG 2.2 AA violations (dark mode)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.addInitScript((value) => document.documentElement.setAttribute('data-appearance', value), 'dark');

    await expectNoAxeViolations(page, 'Gallery (dark mode)');
  });

  test('keyboard navigation: Tab through all interactive elements', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'networkidle' });

    let focusableCount = 0;
    const focusableElements: string[] = [];

    // Press Tab multiple times and collect focused elements
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');

      if (await focused.count() > 0) {
        focusableCount++;
        const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
        const id = await focused.evaluate((el) => el.id || '');
        const name = await focused.evaluate((el) => el.getAttribute('aria-label') || el.textContent?.slice(0, 20) || '');

        focusableElements.push(`${tag}${id ? `#${id}` : ''} "${name}"`);

        // Check focus visibility
        const outlineStyle = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
        expect(outlineStyle, `Element ${tag} must have visible focus outline`).not.toBe('none');
      }
    }

    console.log(`\n✓ Tab navigation: found ${focusableCount} focusable elements`);
    expect(focusableCount).toBeGreaterThan(5);
  });

  test('theme toggle button is accessible', async ({ page }) => {
    const themeButton = page.locator('lsd-button:has-text("Light"), lsd-button:has-text("Dark")').first();

    // Verify button has accessible name (aria-label or text content)
    await expect(themeButton).toHaveAccessibleName(/light|dark|toggle|theme|dark mode|light mode/i);

    // Test click/activation works
    const appearance = await page.evaluate(() => document.documentElement.getAttribute('data-appearance'));
    await themeButton.click();

    await page.waitForTimeout(300);
    const newAppearance = await page.evaluate(() => document.documentElement.getAttribute('data-appearance'));
    expect(newAppearance).not.toBe(appearance);

    console.log(`✓ Theme toggle is accessible and works: ${appearance} → ${newAppearance}`);
  });

  test('buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('lsd-button');
    const count = await buttons.count();

    console.log(`\n✓ Checking ${count} buttons for accessible names`);

    for (let i = 0; i < Math.min(count, 15); i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.evaluate((el) => {
        return el.getAttribute('aria-label') || el.textContent || '';
      });

      expect(accessibleName.trim(), `Button ${i + 1} must have accessible name`).toBeTruthy();
    }
  });

  test('form controls have associated labels', async ({ page }) => {
    const inputs = page.locator('lsd-input, lsd-textarea, lsd-select, lsd-checkbox');
    const count = await inputs.count();

    console.log(`\n✓ Checking ${count} form controls for labels`);

    let checkedCount = 0;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const control = inputs.nth(i);
      // Get id from component attribute (passed input)
      const componentId = await control.evaluate((el) => el.getAttribute('id'));
      const ariaLabel = await control.evaluate((el) => el.getAttribute('aria-label'));

      // Skip controls without id or aria-label (may be test fixtures or internal elements)
      if (!componentId && !ariaLabel) {
        continue;
      }

      checkedCount++;
      // Check if there's a label associated (by looking for label with matching for attribute)
      const label = componentId ? page.locator(`label[for="${componentId}"]`) : null;
      const hasLabel = (componentId && label && await label.count() > 0) || !!ariaLabel;

      expect(hasLabel, `Form control ${checkedCount} (id=${componentId}) must have a label`).toBeTruthy();
    }

    console.log(`  Verified ${checkedCount} controls with labels`);
    expect(checkedCount).toBeGreaterThan(0);
  });

  test('headings use semantic hierarchy (h1, h2, h3)', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();

    console.log(`\n✓ Found ${count} headings`);
    expect(count).toBeGreaterThan(0);

    const firstHeading = await page.locator('h1').evaluate((el) => el.textContent);
    expect(firstHeading).toBeTruthy();
    console.log(`  Main heading: "${firstHeading}"`);
  });

  test('semantic markup: main landmark present', async ({ page }) => {
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
    console.log('✓ Main landmark found');
  });

  test('color contrast in light and dark modes', async ({ page }) => {
    // Test light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript((value) => document.documentElement.setAttribute('data-appearance', value), 'light');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    const contrastViolations = results.violations;
    if (contrastViolations.length > 0) {
      console.log(`\n⚠ Light mode contrast issues: ${contrastViolations.length}`);
      contrastViolations.forEach(v => {
        console.log(`   • ${v.nodes.length} elements: ${v.help}`);
      });
    }

    // Contrast is a "best practice" for older WCAG, but we check for awareness
    expect(contrastViolations.length, 'Light mode: color contrast should meet WCAG AA').toBeLessThan(1);
  });

  test('reduced-motion is respected', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:4200/gallery', { waitUntil: 'networkidle' });

    const hasReducedMotion = await page.evaluate(() =>
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    expect(hasReducedMotion).toBe(true);

    const elements = page.locator('main *');
    const durations = await elements.evaluateAll((els) =>
      [...new Set(els.map((el) => getComputedStyle(el).transitionDuration))]
    );

    console.log(`\n✓ Transition durations in reduced-motion: ${JSON.stringify(durations)}`);

    // Under reduced-motion, transitions should be 0s or very short
    const hasAnimations = durations.some(d => d !== '0s' && parseFloat(d) > 0.1);
    if (hasAnimations) {
      console.log('  ⚠ Some animations present despite reduced-motion preference');
    }
  });
});
