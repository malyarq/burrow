import { expect, test, type Page } from '@playwright/test';

const fixture = '/tests/visual/fixtures/launcher-shell.html';

const presets = {
  default: { light: '244 244 245', dark: '24 24 27' },
  midnight: { light: '238 242 255', dark: '9 9 11' },
  forest: { light: '236 253 245', dark: '5 46 22' },
  'light-plus': { light: '255 255 255', dark: '24 24 27' },
  navy: { light: '239 246 255', dark: '15 23 42' },
} as const;

async function surfaceState(page: Page) {
  return page.evaluate(() => {
    const card = document.createElement('div');
    card.className = 'surface-card';
    document.body.append(card);
    const sidebar = document.querySelector('aside');
    const bodyStyle = getComputedStyle(document.body);
    const sidebarStyle = getComputedStyle(sidebar!);
    const cardStyle = getComputedStyle(card);
    const state = {
      bodyBackground: bodyStyle.backgroundColor,
      bodyToken: bodyStyle.getPropertyValue('--bg-app').trim(),
      cardBackground: cardStyle.backgroundColor,
      cardToken: cardStyle.getPropertyValue('--bg-card').trim(),
      sidebarBackground: sidebarStyle.backgroundColor,
      sidebarToken: sidebarStyle.getPropertyValue('--bg-sidebar').trim(),
      accent: bodyStyle.getPropertyValue('--accent-main').trim(),
    };
    card.remove();
    return state;
  });
}

for (const [preset, colors] of Object.entries(presets)) {
  test(`${preset} surfaces inherit its light and dark variants`, async ({ page }) => {
    await page.goto(`${fixture}?theme=light&accent=purple&preset=${preset}&lang=en`);
    await expect(page.locator('.classic-hero')).toBeVisible();

    const selectPreset = page.getByRole('combobox', { name: 'Theme Presets', exact: true });
    await page.locator('[data-tour="settings"]').click();
    await selectPreset.selectOption(preset);
    await page.waitForTimeout(350);

    let surfaces = await surfaceState(page);
    expect(surfaces.bodyToken).toBe(colors.light);
    expect(surfaces.cardToken).not.toBe('');
    expect(surfaces.sidebarToken).not.toBe('');
    expect(surfaces.bodyBackground).toBe(`rgb(${colors.light.replaceAll(' ', ', ')})`);
    expect(surfaces.cardBackground).toBe(`rgb(${surfaces.cardToken.replaceAll(' ', ', ')})`);
    expect(surfaces.sidebarBackground).not.toBe('rgba(0, 0, 0, 0)');
    expect(surfaces.accent).toBe('147 51 234');

    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await page.waitForTimeout(350);
    surfaces = await surfaceState(page);
    expect(surfaces.bodyToken).toBe(colors.dark);
    expect(surfaces.bodyBackground).toBe(`rgb(${colors.dark.replaceAll(' ', ', ')})`);
    expect(surfaces.cardBackground).toBe(`rgb(${surfaces.cardToken.replaceAll(' ', ', ')})`);
    expect(surfaces.sidebarBackground).not.toBe('rgba(0, 0, 0, 0)');
    expect(surfaces.accent).toBe('147 51 234');

    await page.reload();
    await expect(page.locator('.classic-hero')).toBeVisible();
    await page.waitForTimeout(350);
    surfaces = await surfaceState(page);
    expect(surfaces.bodyToken).toBe(colors.dark);
    expect(surfaces.bodyBackground).toBe(`rgb(${colors.dark.replaceAll(' ', ', ')})`);
    expect(surfaces.accent).toBe('147 51 234');

    await page.locator('[data-tour="settings"]').click();
    await page.getByRole('button', { name: 'Light', exact: true }).click();
    await page.waitForTimeout(350);
    surfaces = await surfaceState(page);
    expect(surfaces.bodyToken).toBe(colors.light);
    expect(surfaces.bodyBackground).toBe(`rgb(${colors.light.replaceAll(' ', ', ')})`);
    expect(surfaces.accent).toBe('147 51 234');
  });
}
