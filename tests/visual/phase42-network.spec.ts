import { expect, test } from '@playwright/test';

const routes = [
  { view: 'phase-42-tunnel-en', readyText: 'Room Active!', forbiddenText: 'Scan local network' },
  { view: 'phase-42-lan-ru', readyText: 'Мир Beta Pack', forbiddenText: 'Код Комнаты' },
] as const;

for (const route of routes) {
  test(route.view, async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem('mp_room_code', 'phantom-room');
      localStorage.setItem('mp_mapped_port', '12345');
    });
    await page.goto(`/manual-verification.html?view=${route.view}`);
    await expect(page.getByText(route.readyText).first()).toBeVisible();
    await expect.poll(async () => JSON.parse(await page.locator('#verification-status').textContent() || '{}').ready).toBe(true);
    await expect(page.locator('body')).not.toContainText(route.forbiddenText);
    await expect.poll(async () => await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(async () => await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return false;
      const bounds = dialog.getBoundingClientRect();
      return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight;
    })).toBe(true);
    await expect.poll(async () => await page.evaluate(() => ({
      room: localStorage.getItem('mp_room_code'),
      mapped: localStorage.getItem('mp_mapped_port'),
    }))).toEqual({ room: null, mapped: null });
  });
}

for (const width of [420, 1280]) {
  for (const [state, label] of [
    ['waiting', 'Waiting for a friend. Local address ready'],
    ['peer', 'Peer found. Connect from Minecraft'],
    ['game', 'Game stream open'],
    ['timeout', 'Could not connect the game to a peer.'],
  ]) {
    test(`join ${state} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/manual-verification.html?view=phase-42-tunnel-en&joinState=${state}`);
      await expect(page.getByRole('status')).toContainText(label);
      await expect(page.getByText('localhost:30000')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Stop Session', exact: true })).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Tunnel Established!');
      await expect.poll(() => page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('join-state.png'), fullPage: true });
    });
  }
}
