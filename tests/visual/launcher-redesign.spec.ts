import { expect, test, type Page } from '@playwright/test';

async function expectNoOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const main = document.querySelector('[data-testid="app-layout-main"]');
    return document.documentElement.scrollWidth <= innerWidth
      && (!main || main.scrollWidth <= main.clientWidth + 1);
  })).toBe(true);
}

for (const lang of ['ru', 'en']) {
  const labels = lang === 'ru'
    ? { advanced: 'Расширенные настройки', library: 'Модпаки', details: 'Открыть детали: Alpha Pack', settings: 'Настройки', multiplayer: 'Мультиплеер' }
    : { advanced: 'Advanced settings', library: 'Modpacks', details: 'Open details: Alpha Pack', settings: 'Settings', multiplayer: 'Multiplayer' };
for (const theme of ['dark', 'light']) {
  for (const width of [420, 760, 1440]) {
    test(`launcher routes, ${lang}, ${theme}, ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/tests/visual/fixtures/launcher-shell.html?theme=${theme}&lang=${lang}`);
      await expect(page.locator('.classic-hero h1')).toHaveText('Classic');
      await expect(page.locator('.classic-hero')).toBeVisible();
      await expectNoOverflow(page);
      if (width < 800) {
        await expect(page.getByTestId('sidebar-expand-button')).toBeVisible();
        expect((await page.locator('aside').boundingBox())?.width).toBeLessThanOrEqual(80);
      }
      const advanced = page.getByRole('button', { name: labels.advanced, exact: true });
      await expect(advanced).toHaveAttribute('aria-expanded', 'false');
      const contentId = await advanced.getAttribute('aria-controls');
      expect(contentId).toBeTruthy();
      const content = page.locator(`[id="${contentId}"]`);
      await expect(content).toBeHidden();
      await advanced.click();
      await expect(content).toBeVisible();
      await advanced.click();
      await expect(content).toBeHidden();
      await page.screenshot({ path: testInfo.outputPath('home.png') });

      await page.locator('aside').getByRole('button', { name: labels.library, exact: true }).click();
      await expect(page.getByRole('heading', { name: labels.library, exact: true })).toBeVisible();
      await expectNoOverflow(page);
      const filters = page.getByTestId('installed-modpack-catalog-header').locator('select');
      for (const filter of await filters.all()) {
        expect((await filter.boundingBox())?.width).toBeGreaterThanOrEqual(150);
      }
      await page.getByRole('button', { name: labels.details, exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Alpha Pack', exact: true })).toBeVisible();
      await expectNoOverflow(page);
      await page.screenshot({ path: testInfo.outputPath('details.png') });

      await page.locator('aside').getByRole('button', { name: labels.settings, exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoOverflow(page);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await page.locator('aside').getByRole('button', { name: labels.multiplayer, exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText('Burrow Link');
      await expect(page.getByRole('dialog')).not.toContainText('Hyperswarm');
      await expectNoOverflow(page);
      await page.screenshot({ path: testInfo.outputPath('multiplayer.png') });
    });
  }
}

}
