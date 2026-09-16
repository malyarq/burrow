import { expect, test, type Page } from '@playwright/test';

const fixture = '/tests/visual/fixtures/launcher-shell.html';

const presets = {
  default: { light: '244 244 245', dark: '24 24 27' },
  forest: { light: '250 247 242', dark: '28 25 23' },
  navy: { light: '239 246 255', dark: '15 23 42' },
} as const;

async function surfaceState(page: Page) {
  return page.evaluate(() => {
    const card = document.createElement('div');
    card.className = 'surface-card';
    document.body.append(card);
    const sidebar = document.querySelector('.next-window');
    const bodyStyle = getComputedStyle(document.body);
    const sidebarStyle = getComputedStyle(sidebar!);
    const cardStyle = getComputedStyle(card);
    const state = {
      bodyBackground: bodyStyle.backgroundColor.replace(/^rgba\((.*), 1\)$/, 'rgb($1)'),
      bodyToken: bodyStyle.getPropertyValue('--bg-app').trim(),
      cardBackground: cardStyle.backgroundColor,
      cardToken: cardStyle.getPropertyValue('--bg-card').trim(),
      sidebarBackground: sidebarStyle.backgroundColor,
      sidebarToken: sidebarStyle.getPropertyValue('--bg-app').trim(),
      accent: bodyStyle.getPropertyValue('--accent-main').trim(),
    };
    card.remove();
    return state;
  });
}

for (const [preset, colors] of Object.entries(presets)) {
  test(`${preset} surfaces inherit its light and dark variants`, async ({ page }) => {
    await page.goto(`${fixture}?theme=light&accent=purple&preset=${preset}&lang=en`);
    await expect(page.getByTestId('play-workspace-launch')).toBeVisible();

    const selectPreset = page.getByRole('combobox', { name: 'Theme Presets', exact: true });
    await page.locator('[data-tour="settings"]').click();
    await selectPreset.selectOption(preset);
    await page.getByRole('button', { name: 'Accent Color: purple', exact: true }).click();
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
    await expect(page.getByTestId('play-workspace-launch')).toBeVisible();
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

test('saved themes restore the complete appearance after restart and can be renamed or removed', async ({ page }) => {
  await page.goto(`${fixture}?theme=dark&accent=purple&lang=en`);
  await page.locator('[data-tour="settings"]').click();
  const preset = page.getByRole('combobox', { name: 'Theme Presets', exact: true });
  await preset.selectOption('midnight');
  await page.getByRole('button', { name: 'Custom colors', exact: true }).click();
  // Surface color controls, excluding the separate custom accent picker.
  const background = page.getByRole('button', { name: 'Custom colors', exact: true }).locator('..').locator('input[type="color"]').first();
  await background.fill('#222233');
  const saved = page.getByTestId('saved-themes');
  await saved.getByRole('textbox', { name: 'Theme name' }).fill('Evening');
  await saved.getByRole('button', { name: 'Save', exact: true }).click();
  const original = await page.evaluate(() => JSON.parse(localStorage.getItem('settings_appearanceState')!));
  await preset.selectOption('navy');
  await page.reload();
  await page.locator('[data-tour="settings"]').click();
  await saved.getByRole('button', { name: 'Evening', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('settings_appearanceState')!))).toEqual(original);
  await saved.getByRole('button', { name: 'Rename', exact: true }).click();
  await saved.getByRole('textbox', { name: 'Theme name' }).last().fill('Night');
  await saved.getByRole('button', { name: 'Save', exact: true }).last().click();
  await expect(saved.getByRole('button', { name: 'Night', exact: true })).toBeVisible();
  await saved.getByRole('button', { name: 'Delete Night', exact: true }).click();
  await expect(saved.getByRole('button', { name: 'Night', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(preset).toHaveValue('default');
  expect(await preset.locator('option[value="midnight"]').count()).toBe(0);
  expect(await preset.locator('option[value="light-plus"]').count()).toBe(0);
});
