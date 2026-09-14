import { expect, test, type Page } from '@playwright/test';

const fixture = '/tests/visual/fixtures/launcher-shell.html';
async function tokens(page: Page) {
  return page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return { bg: style.getPropertyValue('--bg-app').trim(), accent: style.getPropertyValue('--accent-main').trim() };
  });
}
async function noDialogOverflow(page: Page) {
  expect(await page.getByRole('dialog').evaluate(dialog => Array.from(dialog.querySelectorAll<HTMLElement>('[data-modal-body], [role="tabpanel"], .disclosure-content')).every(el => el.hidden || el.scrollWidth <= el.clientWidth + 1))).toBe(true);
}

test('a saved purple accent survives palette and mode changes without tinting neutral surfaces', async ({ page }) => {
  await page.goto(`${fixture}?theme=dark&accent=purple&preset=default&lang=en`);
  await expect(page.locator('.classic-hero')).toBeVisible();
  expect(await tokens(page)).toEqual({ bg: '24 24 27', accent: '147 51 234' });
  await page.locator('[data-tour="settings"]').click();
  for (const accent of ['blue', 'orange', 'rose', 'emerald', 'purple']) {
    await page.getByRole('button', { name: `Accent Color: ${accent}`, exact: true }).click();
    expect((await tokens(page)).bg).toBe('24 24 27');
  }
  const selector = page.getByRole('combobox', { name: 'Theme Presets', exact: true });
  for (const preset of ['forest', 'midnight', 'navy', 'light-plus', 'default']) {
    await selector.selectOption(preset);
    expect((await tokens(page)).accent).toBe('147 51 234');
  }
  expect((await tokens(page)).bg).toBe('24 24 27');
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  expect(await tokens(page)).toEqual({ bg: '244 244 245', accent: '147 51 234' });
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  expect(await tokens(page)).toEqual({ bg: '24 24 27', accent: '147 51 234' });
});

for (const theme of ['dark', 'light']) {
  for (const width of [420, 1024, 1440]) {
    test(`settings geometry, purple, ${theme}, ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${fixture}?theme=${theme}&accent=purple&preset=default&lang=en`);
      await expect(page.locator('.classic-hero')).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath('home.png') });
      await page.locator('aside').getByRole('button', { name: 'Settings', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await noDialogOverflow(page);
      await page.screenshot({ path: testInfo.outputPath('appearance.png') });
      const advanced = page.getByRole('button', { name: 'Custom colors', exact: true });
      await advanced.click();
      const disclosure = advanced.locator('..');
      const padding = await disclosure.locator('.disclosure-content').evaluate(el => getComputedStyle(el).paddingLeft);
      expect(parseFloat(padding)).toBeGreaterThanOrEqual(16);
      await expect(disclosure.locator('.surface-muted, .surface-inline, .surface-card')).toHaveCount(0);
      await advanced.scrollIntoViewIfNeeded();
      await noDialogOverflow(page);
      await page.screenshot({ path: testInfo.outputPath('surface-colors.png') });
      for (const tab of ['downloads', 'launcher', 'storage', 'accounts', 'statistics']) {
        await page.locator(`[role="tab"][id$="${tab}"]`).click();
        await expect(page.getByRole('dialog').locator(`#settings-panel-${tab}`)).toBeVisible();
        await expect(page.getByRole('dialog').locator(`#settings-panel-${tab} button`).first()).toBeVisible();
        await expect(page.getByRole('dialog').getByRole('status', { name: 'Loading', exact: true })).toHaveCount(0);
        await noDialogOverflow(page);
        await page.screenshot({ path: testInfo.outputPath(`${tab}.png`) });
      }
    });
  }
}

test('motion is present, and both reduced-motion paths suppress it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${fixture}?theme=dark&accent=purple&lang=en&motion=on`);
  await expect(page.locator('.classic-hero')).toBeVisible();
  await page.locator('[data-tour="settings"]').click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'dialog-arrive');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(parseFloat(await page.getByRole('dialog').evaluate(el => getComputedStyle(el).animationDuration))).toBeLessThanOrEqual(.001);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => document.body.classList.add('disable-animations'));
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
});
