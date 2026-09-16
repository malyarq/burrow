/* global window, document, requestAnimationFrame */
// Packaged Windows application benchmark. Never uses the user's launcher profile.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const index = arg.indexOf('=');
  if (!arg.startsWith('--') || index < 0) throw Error('Use --name=value arguments');
  return [arg.slice(2, index), arg.slice(index + 1)];
}));
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const executable = path.resolve(args.exe ?? path.join(root, 'release', version, 'win-unpacked', 'Burrow Next.exe'));
const counts = (args.counts ?? '20,200,1000').split(',').map(Number);
const rounds = Number(args.rounds ?? 10);
const repeats = Number(args.repeats ?? 2);
if (process.platform !== 'win32') throw Error('This sampler measures Windows only.');
if (counts.some(n => !Number.isInteger(n) || n < 1 || n > 2000)
  || !Number.isInteger(rounds) || rounds < 1 || rounds > 100
  || !Number.isInteger(repeats) || repeats < 1 || repeats > 10) throw Error('Invalid workload size');
fs.accessSync(executable);
const output = path.resolve(args.output ?? path.join(root, 'work', `stress-${Date.now()}`));
// Refuse to overwrite results or an existing profile.
fs.mkdirSync(output, { recursive: false });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function sha256(file) {
  const hash = createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
const asar = path.join(path.dirname(executable), 'resources', 'app.asar');
const result = { startedAt: new Date().toISOString(), executable, executableSha256: await sha256(executable),
  appAsarSha256: fs.existsSync(asar) ? await sha256(asar) : null, checkoutVersion: version,
  head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  hardware: { platform: os.platform(), release: os.release(), cpu: os.cpus()[0].model,
    logicalProcessors: os.cpus().length, totalMemoryGiB: os.totalmem() / 2 ** 30 },
  counts, rounds, repeats, runs: [], errors: [] };
let app, browser, page, sampler;
function phase(name) {
  fs.writeFileSync(path.join(output, 'control.tmp'), JSON.stringify({ phase: name, rootPid: app?.pid ?? 0 }));
  fs.renameSync(path.join(output, 'control.tmp'), path.join(output, 'control.json'));
  console.log(name);
}
function seed(profile, count) {
  const data = path.join(profile, 'minecraft_data');
  const records = Array.from({ length: count }, (_, i) => {
    const id = `stress-${String(i).padStart(4, '0')}`;
    fs.mkdirSync(path.join(data, 'modpacks', id), { recursive: true });
    const runtime = { minecraftVersion: '1.21.1', modLoader: { type: 'vanilla' } };
    return { id, name: `Stress Pack ${String(i).padStart(4, '0')}`,
      source: { source: 'local', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
        description: 'Deterministic local stress fixture. No game files or downloads.' },
      config: { runtime, memory: { maxMb: 4096 } }, summary: runtime };
  });
  fs.writeFileSync(path.join(data, 'instance-control-plane.json'), JSON.stringify({
    snapshot: { selectedId: records[0].id, records }, _burrowSchemaVersion: 1,
  }));
}
async function freePort() {
  const server = net.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
async function close() {
  if (!app) return;
  if (app.exitCode === null) await page?.evaluate(() => window.api.windowControls.close()).catch(() => {});
  const deadline = Date.now() + 10000;
  while (app.exitCode === null && Date.now() < deadline) await delay(100);
  if (app.exitCode === null) {
    execFileSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { windowsHide: true });
    result.errors.push('Application required forced termination');
  } else if (app.exitCode !== 0) result.errors.push(`Application exit code ${app.exitCode}`);
  await browser?.close().catch(() => {});
  app = browser = page = null;
}
async function painted() {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function run(count, repeat) {
  const name = `packs-${count}-run-${repeat}`;
  const profile = path.join(output, name);
  seed(profile, count);
  const port = await freePort();
  const started = performance.now();
  app = spawn(executable, [`--remote-debugging-port=${port}`], { windowsHide: true,
    env: { ...process.env, NODE_ENV: 'test', BURROW_TEST_USER_DATA: profile }, stdio: ['ignore', 'pipe', 'pipe'] });
  app.on('error', error => result.errors.push(String(error)));
  const log = fs.createWriteStream(path.join(output, `${name}.log`));
  app.stdout.pipe(log, { end: false }); app.stderr.pipe(log, { end: false });
  app.on('exit', () => log.end());
  phase(`${name}/setup`);
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline && !browser) {
    try { browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`); } catch { await delay(150); }
  }
  if (!browser) throw Error('Packaged app CDP startup timeout');
  page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(30000);
  await page.getByTestId('next-nav-play').waitFor();
  const entry = { count, repeat, startupObservedMs: performance.now() - started, transitions: [], errors: [] };
  entry.viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio }));
  result.runs.push(entry);
  page.on('pageerror', error => entry.errors.push(String(error)));
  await page.evaluate(() => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('first_launch', 'false');
    localStorage.setItem('settings_language', 'en');
  });
  await page.reload();
  await page.getByTestId('next-nav-play').waitFor();
  await delay(5000);
  phase(`${name}/idle-before`); await delay(12000);
  phase(`${name}/library`);
  const opened = performance.now();
  await page.getByTestId('next-nav-library').click();
  const list = page.getByRole('list', { name: 'Modpacks', exact: true });
  // The launcher also creates its built-in Classic instance.
  await page.waitForFunction(expected => document.querySelectorAll('[role="list"][aria-label="Modpacks"] [role="listitem"]').length === expected, count + 1);
  await painted();
  entry.libraryReadyMs = performance.now() - opened;
  entry.cards = await list.getByRole('listitem').count();
  entry.domNodes = await page.locator('*').count();
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  entry.heapBefore = await session.send('Runtime.getHeapUsage');
  await delay(12000);
  phase(`${name}/scroll`);
  entry.frames = await page.evaluate(async () => {
    const scroller = [...document.querySelectorAll('*')].filter(el => el.scrollHeight > el.clientHeight + 100 && el.clientHeight > 100)
      .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];
    if (!scroller) throw Error('No scrollable library found');
    const intervals = []; let last;
    for (let i = 0; i < 240; i++) {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error('Scroll frame stalled: keep the test window visible')), 10000);
        requestAnimationFrame(time => {
          clearTimeout(timer);
          if (last !== undefined) intervals.push(time - last); last = time;
          scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) * ((i % 120) / 119); resolve();
        });
      });
    }
    scroller.scrollTop = 0;
    return intervals;
  });
  phase(`${name}/navigation`);
  for (let i = 0; i < rounds; i++) {
    for (const route of ['settings', 'friends', 'play', 'library']) {
      const time = performance.now();
      await page.getByTestId(`next-nav-${route}`).click();
      if (route === 'library') await list.waitFor();
      if (route === 'settings') await page.getByTestId('settings-workspace').waitFor();
      await painted();
      entry.transitions.push({ route, ms: performance.now() - time });
      await delay(150);
    }
  }
  entry.heapAfter = await session.send('Runtime.getHeapUsage');
  await session.detach();
  await page.getByTestId('next-nav-play').click();
  phase(`${name}/settle`); await delay(15000);
  phase(`${name}/idle-after`); await delay(12000);
  await close(); phase(`${name}/closed`); await delay(3000);
}
try {
  phase('baseline');
  sampler = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts/stress-resources.ps1'), '-Directory', output], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
  sampler.stderr.on('data', chunk => result.errors.push(`Sampler: ${chunk}`));
  await delay(4000);
  for (let repeat = 1; repeat <= repeats; repeat++) for (const count of counts) await run(count, repeat);
} catch (error) {
  result.errors.push(String(error.stack));
  if (page) {
    await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    fs.writeFileSync(path.join(output, 'failure.txt'), await page.locator('body').innerText().catch(() => 'Page unavailable'));
  }
}
finally {
  try { await close(); } catch (error) { result.errors.push(`Cleanup: ${error}`); }
  fs.writeFileSync(path.join(output, 'stop'), 'stop');
  if (sampler) {
    const deadline = Date.now() + 10000;
    while (sampler.exitCode === null && Date.now() < deadline) await delay(100);
    if (sampler.exitCode === null) { sampler.kill(); result.errors.push('Sampler termination timeout'); }
    else if (sampler.exitCode !== 0) result.errors.push(`Sampler exit code ${sampler.exitCode}`);
  }
  result.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'run.json'), JSON.stringify(result, null, 2));
  console.log(`Results: ${output}`);
  if (result.errors.length || result.runs.some(run => run.errors.length)) { console.error(result.errors); process.exitCode = 1; }
}
