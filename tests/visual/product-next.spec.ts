import { expect, test, type Page } from '@playwright/test';

const productNext = '/manual-verification.html?view=product-next&lang=en';
const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console.error: ${message.text()}`);
  });
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => new Promise<void>(requestAnimationFrame));
  expect(runtimeErrors.get(page) ?? []).toEqual([]);
});

async function openProduct(page: Page, width = 1100, height = 850) {
  await page.setViewportSize({ width, height });
  await page.goto(productNext);
  await expect(page.getByTestId('next-nav-play')).toBeVisible();
  await expect(page.getByTestId('play-workspace-launch')).toBeVisible();
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    body: document.body.scrollWidth <= document.body.clientWidth + 1,
    shell: (() => {
      const shell = document.querySelector<HTMLElement>('[data-testid="app-shell-frame"]');
      return Boolean(shell && shell.scrollWidth <= shell.clientWidth + 1);
    })(),
  }));
  expect(overflow).toEqual({ document: true, body: true, shell: true });
}

async function openGuidedContent(page: Page, tab: 'Resource packs' | 'Shaders', action: RegExp, title: RegExp) {
  await page.getByRole('tab', { name: tab, exact: true }).click();
  await page.getByRole('button', { name: action }).first().click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
}

test('Product Next exposes the four top-level destinations and preserves a settings tab after navigation', async ({ page }) => {
  await openProduct(page);

  for (const id of ['play', 'library', 'friends', 'settings'] as const) {
    await expect(page.getByTestId(`next-nav-${id}`)).toBeVisible();
  }

  await page.getByTestId('next-nav-settings').click();
  await expect(page.getByTestId('settings-workspace')).toBeVisible();
  await page.locator('#settings-tab-downloads').click();
  await expect(page.locator('#settings-panel-downloads')).toBeVisible();

  await page.getByTestId('next-nav-library').click();
  await expect(page.getByTestId('library-launch-dock')).toBeVisible();
  await page.getByTestId('next-nav-settings').click();
  await expect(page.locator('#settings-tab-downloads')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#settings-panel-downloads')).toBeVisible();
});

test('Product Next applies visibly distinct light and dark backgrounds without desktop overflow', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-settings').click();
  await expect(page.getByTestId('settings-workspace')).toBeVisible();

  await page.getByRole('button', { name: 'Light', exact: true }).click();
  const lightBackground = await page.locator('.next-window').evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  const darkBackground = await page.locator('.next-window').evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(lightBackground).not.toBe(darkBackground);
  await assertNoHorizontalOverflow(page);

  await openProduct(page, 760, 900);
  await page.getByTestId('next-nav-settings').click();
  await expect(page.getByTestId('settings-workspace')).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test('Product Next keeps dark preset surfaces separate from accents and restores a named saved theme', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-settings').click();
  const presets = page.getByRole('combobox', { name: 'Theme Presets', exact: true });

  await presets.selectOption('default');
  const neutralBackground = await page.locator('.next-window').evaluate((element) => getComputedStyle(element).backgroundColor);
  await presets.selectOption('navy');
  const ocean = await page.locator('.next-window').evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    accent: getComputedStyle(element).getPropertyValue('--accent-main').trim(),
  }));
  expect(ocean.background).not.toBe(neutralBackground);
  await presets.selectOption('forest');
  expect(await page.locator('.next-window').evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(ocean.background);

  await presets.selectOption('navy');
  await page.getByRole('button', { name: 'Accent Color: blue', exact: true }).click();
  await expect.poll(() => page.locator('.next-window').evaluate((element) => getComputedStyle(element).getPropertyValue('--accent-main').trim())).not.toBe(ocean.accent);
  expect(await page.locator('.next-window').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(ocean.background);

  await page.getByRole('button', { name: 'Custom colors', exact: true }).click();
  await page.getByRole('button', { name: 'Custom colors', exact: true }).locator('..').getByLabel('Window background', { exact: true }).fill('#102030');
  const savedSurface = await page.locator('.next-window').evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    accent: getComputedStyle(element).getPropertyValue('--accent-main').trim(),
  }));
  const savedThemes = page.getByTestId('saved-themes');
  await savedThemes.getByRole('textbox', { name: 'Theme name', exact: true }).fill('Ocean violet');
  await savedThemes.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(savedThemes.getByRole('button', { name: 'Ocean violet', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Accent Color: purple', exact: true }).click();
  await page.getByRole('button', { name: 'Custom colors', exact: true }).locator('..').getByLabel('Window background', { exact: true }).fill('#405060');
  await savedThemes.getByRole('button', { name: 'Ocean violet', exact: true }).click();
  await expect.poll(() => page.locator('.next-window').evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    accent: getComputedStyle(element).getPropertyValue('--accent-main').trim(),
  }))).toEqual(savedSurface);
});

test('Product Next keeps the main Play controls stable after returning from the library', async ({ page }) => {
  await openProduct(page);
  const before = await page.getByTestId('play-workspace-launch').boundingBox();
  expect(before).not.toBeNull();

  await page.getByTestId('next-nav-library').click();
  await expect(page.getByTestId('library-launch-dock')).toBeVisible();
  await page.getByTestId('next-nav-play').click();
  await expect(page.getByTestId('play-workspace-launch')).toBeVisible();
  const after = await page.getByTestId('play-workspace-launch').boundingBox();
  expect(after).not.toBeNull();
  expect(after!.x).toBeCloseTo(before!.x, 0);
  expect(after!.y).toBeCloseTo(before!.y, 0);
  expect(after!.width).toBeCloseTo(before!.width, 0);
  expect(after!.height).toBeCloseTo(before!.height, 0);
});

test('Product Next exposes the memory slider label and reaches 8 GB from the keyboard', async ({ page }) => {
  await openProduct(page);
  await page.getByRole('button', { name: 'Advanced settings', exact: true }).click();
  const memory = page.getByRole('slider', { name: 'Allocated Memory (RAM)', exact: true });
  await expect(memory).toBeVisible();
  await memory.focus();
  await page.keyboard.press('Home');
  for (let step = 0; step < 14; step += 1) await page.keyboard.press('ArrowRight');
  await expect(memory).toHaveValue('8');
  await expect(memory).toHaveAttribute('max', '32');
  const manual = page.getByRole('spinbutton', { name: 'Memory in GB', exact: true });
  await manual.fill('128');
  await manual.press('Tab');
  await expect(memory).toHaveValue('128');
  await expect(memory).toHaveAttribute('max', '128');
  await memory.press('ArrowLeft');
  await expect(memory).toHaveValue('127.5');
  await expect(memory).toHaveAttribute('max', '128');
  await manual.fill('256');
  await manual.press('Tab');
  await expect(memory).toHaveAttribute('max', '256');
  await manual.fill('8');
  await manual.press('Tab');
  await expect(memory).toHaveValue('8');
  await expect(memory).toHaveAttribute('max', '32');
});

test('Product Next sends resource-pack and shader actions through their guided library routes', async ({ page }) => {
  await openProduct(page);
  await openGuidedContent(page, 'Resource packs', /Add Resource Pack/i, /Add Resource Pack/i);

  await page.goto(productNext);
  await expect(page.getByTestId('play-workspace-launch')).toBeVisible();
  await openGuidedContent(page, 'Shaders', /Add Shader/i, /Add Shader/i);
});

for (const width of [1100, 880, 720, 640]) {
  test(`Product Next keeps shader actions together at ${width}px`, async ({ page }) => {
    await openProduct(page, width, 850);
    await page.getByRole('tab', { name: 'Shaders', exact: true }).click();
    const add = page.getByRole('button', { name: /Add Shader/i });
    await add.scrollIntoViewIfNeeded();
    const refresh = page.getByRole('button', { name: 'Update', exact: true });
    const a = await add.boundingBox();
    const b = await refresh.boundingBox();
    expect(a).not.toBeNull(); expect(b).not.toBeNull();
    expect(a!.y).toBeCloseTo(b!.y, 0);
    expect(b!.x + b!.width).toBeLessThanOrEqual(width);
    await assertNoHorizontalOverflow(page);
  });
}

test('Product Next opens a beginner guide for the selected multiplayer mode', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-friends').click();
  await page.locator('summary').filter({ hasText: 'Playing with a friend, step by step' }).click();
  await expect(page.getByText(/The host creates an invitation/)).toBeVisible();
});

for (const width of [1100, 880, 720, 640]) {
  test(`Product Next contains every modpack action and screenshot panel at ${width}px`, async ({ page }) => {
    await openProduct(page, width, 850);
    await page.getByTestId('next-nav-library').click();
    await page.getByRole('button', { name: 'Open details: Alpha Pack', exact: true }).click();
    const actions = page.getByTestId('modpack-details-actions');
    await expect(actions).toBeVisible();
    for (const button of await actions.getByRole('button').all()) {
      const bounds = await button.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await page.getByRole('tab', { name: 'Screenshots', exact: true }).click();
    await expect(page.getByTestId('screenshots-workspace-shell')).toBeVisible();
    const panels = await page.locator('#modpack-details-panel-screenshots').evaluate(e => ({ width:e.clientWidth, scrollWidth:e.scrollWidth }));
    expect(panels.scrollWidth).toBeLessThanOrEqual(panels.width + 1);
  });
}

test('Product Next keeps the welcome language visibly selected after switching', async ({ page }) => {
  await page.setViewportSize({ width:1100, height:850 });
  await page.goto(productNext + '&onboarding=1');
  const ru = page.getByRole('button', { name:'ru', exact:true });
  const en = page.getByRole('button', { name:'en', exact:true });
  await ru.click();
  await expect(ru).toHaveAttribute('aria-pressed', 'true');
  const selectedBorder = await ru.evaluate(e=>getComputedStyle(e).borderColor);
  const inactiveBorder = await en.evaluate(e=>getComputedStyle(e).borderColor);
  expect(selectedBorder).not.toBe(inactiveBorder);
  await en.click();
  await expect(en).toHaveAttribute('aria-pressed', 'true');
  expect(await en.evaluate(e=>getComputedStyle(e).borderColor)).toBe(selectedBorder);
});

test('Product Next can replay the tour from Settings after completing it', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-settings').click();
  await page.getByRole('button', { name: 'Take the tour again', exact: true }).click();
  await expect(page.getByText('1 / 4', { exact:true })).toBeVisible();
  for (let step=0; step<3; step++) await page.getByRole('button', { name:'Next', exact:true }).click();
  await page.getByRole('button', { name:'Finish', exact:true }).click();
  await page.getByRole('button', { name:'Take the tour again', exact:true }).click();
  await expect(page.getByText('1 / 4', { exact:true })).toBeVisible();
});

test('Product Next applies four additional distinct preset families in both modes', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-settings').click();
  for (const mode of ['Dark', 'Light']) {
    await page.getByRole('button', { name:mode, exact:true }).click();
    const backgrounds = [];
    for (const preset of ['plum', 'copper', 'frost', 'parchment']) {
      await page.getByRole('combobox', { name:'Theme Presets', exact:true }).selectOption(preset);
      backgrounds.push(await page.locator('.next-window').evaluate(e=>getComputedStyle(e).backgroundColor));
    }
    expect(new Set(backgrounds).size).toBe(4);
  }
});

test('Product Next empty screenshots span the same width as the screenshot workspace', async ({ page }) => {
  await page.setViewportSize({width:1100,height:850});
  await page.goto(productNext + '&emptyScreenshots=1');
  await page.getByTestId('next-nav-library').click();
  await page.getByRole('button', {name:'Open details: Alpha Pack',exact:true}).click();
  const actions = page.getByTestId('modpack-details-actions');
  const heights = await actions.getByRole('button').evaluateAll(elements=>elements.filter(e=>!e.getAttribute('data-route-action')?.includes('update')).map(e=>e.getBoundingClientRect().height));
  expect(new Set(heights).size).toBe(1);
  await page.getByRole('tab',{name:'Screenshots',exact:true}).click();
  const empty = page.getByText('No screenshots yet', {exact:true});
  await expect(empty).toBeVisible();
  const frame = await empty.evaluate(e=>e.closest('[data-layout]')?.firstElementChild?.getBoundingClientRect().width);
  const workspace = await page.getByTestId('screenshots-workspace-shell').boundingBox();
  expect(frame).toBeCloseTo(workspace!.width,0);
});

test('Product Next keeps mod content mounted while switching Vanilla and Forge', async ({ page }) => {
  await openProduct(page);
  const tabs = page.getByRole('tablist', { name:'Content',exact:true });
  const beforeTabs = await tabs.elementHandle();
  const list = page.getByRole('list', { name:'Installed Mods',exact:true });
  await expect(list).toBeVisible();
  const beforeList = await list.elementHandle();
  const add = page.getByRole('button', { name:'+ Add Mod',exact:true });
  for (const name of ['Vanilla','Forge','Vanilla','Fabric']) {
    await page.getByTestId('play-workspace-loader').getByRole('button',{name,exact:true}).click();
    await expect(page.getByRole('tab',{name:'Mods',exact:true})).toHaveAttribute('aria-selected','true');
    expect(await beforeTabs!.evaluate(e=>e.isConnected)).toBe(true);
    expect(await beforeList!.evaluate(e=>e.isConnected)).toBe(true);
    if(name==='Vanilla') await expect(add).toBeDisabled();
    else await expect(add).toBeEnabled();
  }
});

test('Product Next keeps installed catalog controls mounted when selecting another pack', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-library').click();
  const controls = await page.getByTestId('installed-modpack-filter-controls').elementHandle();
  await page.getByRole('button',{name:'Make active: Classic',exact:true}).click();
  await expect(page.getByRole('button',{name:'Active now: Classic',exact:true})).toBeVisible();
  expect(await controls!.evaluate(e=>e.isConnected)).toBe(true);
});


test('Product Next shows remote pack contents and its official page action', async ({ page }) => {
  await openProduct(page);
  await page.getByTestId('next-nav-library').click();
  await page.getByRole('button', { name: 'Modpack Browser', exact: true }).click();
  await page.getByRole('button', { name: 'Open details: Alpha Pack', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open official project page', exact: true })).toBeVisible();
  const contents = page.getByTestId('remote-modpack-contents');
  for (const label of ['Mods', 'Resource packs', 'Shaders', 'Other included files']) {
    await expect(contents.getByRole('list', { name: label, exact: true })).toBeVisible();
  }
  await assertNoHorizontalOverflow(page);
});
