import { expect, test } from '@playwright/test';

test('Downloads has usable controls on its first frame, rather than an empty lazy panel', async ({ page }) => {
  await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=dark&accent=purple&motion=on&lang=en');
  await page.locator('[data-tour="settings"]').click();
  await expect(page.locator('#settings-tab-downloads')).toBeVisible();
  const visibleOnFirstFrame = await page.evaluate(async () => {
    (document.getElementById('settings-tab-downloads') as HTMLButtonElement).click();
    await new Promise(requestAnimationFrame);
    const panel = document.getElementById('settings-panel-downloads');
    return Boolean(panel?.querySelector('[data-testid="downloads-tuning-section"]')) && !panel?.querySelector('[aria-label="Loading"]');
  });
  expect(visibleOnFirstFrame).toBe(true);
});

test('custom color controls name the preview parts and have full-size targets', async ({ page }) => {
  await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=light&accent=purple&lang=ru');
  await page.locator('[data-tour="settings"]').click();
  await page.getByRole('button', { name: 'Свои цвета', exact: true }).click();
  const group = page.getByRole('button', { name: 'Свои цвета', exact: true }).locator('..');
  await expect(group).toContainText('Заголовок');
  await expect(group).toContainText('Подпись');
  await expect(group).toContainText('Пример ошибки');
  const colors = group.locator('input[type="color"]');
  await expect(colors).toHaveCount(6);
  for (const control of await colors.all()) {
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await control.evaluate(el => Boolean((el as HTMLInputElement).labels?.length))).toBe(true);
  }
  await expect(colors.first()).toHaveValue('#f4f4f5');
  await page.getByRole('button', { name: 'Темная', exact: true }).click();
  await expect(colors.first()).toHaveValue('#18181b');
});
