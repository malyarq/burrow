import { expect, test } from '@playwright/test';

for (const width of [840, 1280, 1440]) {
  test(`sidebar fields keep their geometry and focus ring, ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=dark&accent=purple&motion=on&lang=ru');
    await expect(page.locator('[data-tour="nickname"] input')).toBeVisible();
    const nicknameTop = (await page.locator('[data-tour="nickname"] input').boundingBox())!.y;
    await page.locator('[data-tour="modpacks"]').click();
    expect((await page.locator('[data-tour="nickname"] input').boundingBox())!.y).toBeCloseTo(nicknameTop, 0);
    await expect(page.locator('[data-tour="version"]')).toHaveCount(0);
    const frames = await page.evaluate(async () => {
      const samples: { nicknameWidth: number; versionWidth: number; opacity: number; animations: number }[] = [];
      (document.querySelector('[data-tour="classic"]') as HTMLButtonElement).click();
      for (let frame = 0; frame < 32; frame++) {
        await new Promise(requestAnimationFrame);
        const nickname = document.querySelector('[data-tour="nickname"] input') as HTMLElement;
        const version = document.querySelector('[data-tour="version"] select') as HTMLElement;
        if (!nickname || !version) continue;
        let opacity = 1;
        for (let el: HTMLElement | null = version; el && el.tagName !== 'BODY'; el = el.parentElement) opacity *= Number(getComputedStyle(el).opacity);
        const disruptiveAnimations = version.getAnimations().filter(animation => {
          const frames = (animation.effect as KeyframeEffect).getKeyframes();
          return frames.some(frame => ['opacity', 'transform', 'width', 'height', 'padding', 'fontSize', 'lineHeight'].some(property => property in frame));
        });
        samples.push({ nicknameWidth: nickname.getBoundingClientRect().width, versionWidth: version.getBoundingClientRect().width, opacity, animations: disruptiveAnimations.length });
      }
      return samples;
    });
    expect(frames.length).toBeGreaterThan(20);
    for (const key of ['nicknameWidth', 'versionWidth'] as const) {
      expect(Math.max(...frames.map(f => f[key])) - Math.min(...frames.map(f => f[key]))).toBeLessThan(1);
    }
    expect(frames.every(f => f.opacity === 1 && f.animations === 0)).toBe(true);
    for (const selector of ['[data-tour="nickname"] input', '[data-tour="version"] select']) {
      const control = page.locator(selector);
      await control.focus();
      const clipping = await control.evaluate(input => {
        const bounds = input.getBoundingClientRect();
        const style = getComputedStyle(input);
        const ring = Math.max(4, parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset));
        const failures: string[] = [];
        for (let parent = input.parentElement; parent; parent = parent.parentElement) {
          if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(parent).overflowX)) {
            const clip = parent.getBoundingClientRect();
            if (bounds.left - ring < clip.left - .5 || bounds.right + ring > clip.right + .5) failures.push(parent.id || parent.className);
          }
        }
        return failures;
      });
      expect(clipping).toEqual([]);
    }
    await expect(page.locator('.burrow-diorama')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('focused-sidebar.png') });
  });
}

test('toggle thumb has equal top and bottom spacing in both states', async ({ page }) => {
  await page.goto('/tests/visual/fixtures/launcher-shell.html?theme=dark&accent=purple&motion=on&lang=en');
  await page.locator('[data-tour="settings"]').click();
  await page.locator('#settings-tab-launcher').click();
  const toggle = page.getByRole('switch', { name: 'Show Developer Console', exact: true });
  await expect(toggle).toBeVisible();
  for (let state = 0; state < 2; state++) {
    await expect.poll(async () => toggle.evaluate(el => {
      const box = el.getBoundingClientRect(); const thumb = el.querySelector('span')!.getBoundingClientRect();
      return Math.abs((thumb.top - box.top) - (box.bottom - thumb.bottom));
    })).toBeLessThan(.5);
    await expect.poll(async () => toggle.evaluate(el => {
      const box = el.getBoundingClientRect(); const thumb = el.querySelector('span')!.getBoundingClientRect();
      return el.getAttribute('aria-checked') === 'true' ? box.right - thumb.right : thumb.left - box.left;
    })).toBeCloseTo(4, 0);
    await toggle.click();
  }
});
