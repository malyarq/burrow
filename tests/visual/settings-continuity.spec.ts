import { expect, test } from '@playwright/test';

for (const width of [420, 1024, 1440]) {
  for (const scale of [100, 150]) {
    test(`settings stay mounted and keep the header fixed at ${width}/${scale}`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 960 });
      await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=light&lang=ru&motion=on');
      await page.evaluate(value => { document.documentElement.style.fontSize = `${value}%`; }, scale);
      await page.getByTestId('next-nav-settings').click();
      const dialog = page.getByTestId('settings-workspace');
      const done = page.getByTestId('next-nav-settings');
      await expect(done).toBeVisible();
      const initial = (await done.boundingBox())!;
      await expect(dialog.locator('[role="tabpanel"]')).toHaveCount(6);
      for (const tab of ['downloads', 'accounts', 'statistics', 'launcher', 'appearance']) {
        await page.locator(`#settings-tab-${tab}`).click();
        await expect(dialog.getByRole('tabpanel')).toHaveAttribute('id', `settings-panel-${tab}`);
        const current = (await done.boundingBox())!;
        expect(current.y).toBeCloseTo(initial.y, 0);
        expect(current.height).toBeCloseTo(initial.height, 0);
        expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      }
      await page.locator('#settings-tab-accounts').click();
      await page.screenshot({ path: info.outputPath('accounts.png') });
    });
  }
}

test('the midpoint tick matches the native slider position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=dark&lang=en');
  await page.getByRole('button', { name: 'Advanced settings', exact: true }).click();
  const tick = page.getByTestId('memory-tick-midpoint');
  await tick.scrollIntoViewIfNeeded();
  const slider = page.getByRole('slider', { name: 'Allocated Memory (RAM)', exact: true });
  const tickBox = (await tick.boundingBox())!;
  const sliderBox = (await slider.boundingBox())!;
  await page.mouse.click(tickBox.x + tickBox.width / 2, sliderBox.y + sliderBox.height / 2);
  await expect(slider).toHaveValue('16');
});
