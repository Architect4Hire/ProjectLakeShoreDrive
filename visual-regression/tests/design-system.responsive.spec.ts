import { expect, test, type Page } from '@playwright/test';

const widths = { desktop: 1280, tablet: 768, mobile: 390 } as const;

async function openSuite(page: Page, suite: string, width: number, height = 1200): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.goto(`/?suite=${suite}`);
}

test('shell switches from persistent navigation to keyboard-operable overlay', async ({ page }) => {
  await openSuite(page, 'recipes', widths.desktop);
  const shell = page.locator('lsd-workbench-shell-recipe');
  await expect(shell.locator('.lsd-workbench-shell__navigation')).toBeVisible();
  await expect(shell.getByRole('button', { name: 'Open primary navigation' })).toBeHidden();

  await openSuite(page, 'recipes', widths.tablet);
  const trigger = shell.getByRole('button', { name: 'Open primary navigation' });
  await expect(trigger).toBeVisible();
  await expect(shell.locator('.lsd-workbench-shell__navigation')).toBeHidden();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(shell.locator('.lsd-workbench-shell__navigation')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(shell.locator('.lsd-workbench-shell__navigation')).toBeHidden();
});

test('card-mode tables replace the desktop table on mobile', async ({ page }) => {
  await openSuite(page, 'components', widths.desktop);
  const table = page.getByRole('region', { name: 'Engagement team scroll area' });
  await expect(table.locator('table')).toBeVisible();
  await expect(table.locator('.lsd-data-table__cards')).toBeHidden();

  await openSuite(page, 'components', widths.mobile, 1600);
  await expect(table.locator('table')).toBeHidden();
  await expect(table.locator('.lsd-data-table__cards')).toBeVisible();
  await expect(table.locator('.lsd-data-table__cards').getByText('Avery Morgan')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('split view exposes both panes on desktop and a keyboard switcher on narrow screens', async ({ page }) => {
  await openSuite(page, 'split', widths.desktop);
  const split = page.locator('#responsive-split');
  await expect(split.getByRole('region', { name: 'Current decision' })).toBeVisible();
  await expect(split.getByRole('region', { name: 'Proposed decision' })).toBeVisible();
  await expect(split.getByRole('group', { name: 'Decision comparison view' })).toBeHidden();

  await openSuite(page, 'split', widths.tablet);
  await expect(split.getByRole('region', { name: 'Current decision' })).toBeVisible();
  await expect(split.getByRole('region', { name: 'Proposed decision' })).toBeVisible();

  await openSuite(page, 'split', widths.mobile);
  await expect(split.getByRole('region', { name: 'Current decision' })).toBeHidden();
  await expect(split.getByRole('region', { name: 'Proposed decision' })).toBeVisible();
  const contextButton = split.getByRole('button', { name: 'Current decision' });
  await contextButton.focus();
  await page.keyboard.press('Enter');
  await expect(split.getByRole('region', { name: 'Current decision' })).toBeFocused();
  await expect(split.getByRole('region', { name: 'Proposed decision' })).toBeHidden();
});

test('drawer becomes viewport-width on mobile and remains keyboard dismissible', async ({ page }) => {
  await openSuite(page, 'drawer', widths.desktop);
  const drawer = page.getByRole('dialog', { name: 'Source preview' });
  expect((await drawer.boundingBox())!.width).toBeLessThan(widths.desktop);

  await openSuite(page, 'drawer', widths.mobile);
  expect((await drawer.boundingBox())!.width).toBeGreaterThanOrEqual(widths.mobile - 2);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('phase navigation remains reachable as an overflow strip at mobile width', async ({ page }) => {
  await openSuite(page, 'recipes', widths.mobile, 2600);
  const navigation = page.getByRole('navigation', { name: 'Engagement phases' });
  const list = navigation.locator('ol');
  expect(await list.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  const ai = navigation.getByRole('button', { name: /^AI/ });
  await ai.scrollIntoViewIfNeeded();
  await ai.focus();
  await expect(ai).toBeFocused();
});

for (const [name, width] of Object.entries(widths)) {
  test(`dense recipes remain functional without page overflow at ${name} width`, async ({ page }) => {
    await openSuite(page, 'recipes', width, name === 'mobile' ? 2800 : 1600);
    await expect(page.locator('lsd-requirement-row')).toBeVisible();
    await expect(page.locator('lsd-knowledge-result')).toBeVisible();
    await expect(page.locator('lsd-raid-register')).toBeVisible();
    if (name === 'mobile') {
      await expect(page.locator('lsd-raid-register .lsd-data-table__cards')).toBeVisible();
      await expect(page.locator('lsd-raid-register table')).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}
