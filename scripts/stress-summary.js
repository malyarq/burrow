import fs from 'node:fs';
import path from 'node:path';

const directory = path.resolve(process.argv[2] ?? '');
const run = JSON.parse(fs.readFileSync(path.join(directory, 'run.json'), 'utf8'));
const samples = fs.readFileSync(path.join(directory, 'samples.jsonl'), 'utf8').replace(/^\uFEFF/, '')
  .trim().split(/\r?\n/).map(line => JSON.parse(line));
function stats(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return { n: sorted.length, median: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    p95: sorted[Math.ceil(sorted.length * 0.95) - 1], max: sorted.at(-1) };
}
const phases = {};
for (const phase of new Set(samples.map(sample => sample.phase))) {
  // Discard the first sample: CPU counters may straddle a phase boundary.
  const rows = samples.filter(sample => sample.phase === phase).slice(1)
    .filter(sample => sample.rootPid > 0 && sample.processes.length > 0);
  phases[phase] = Object.fromEntries(['residentMiB', 'committedMiB', 'cpuMachinePct', 'availableMiB', 'pagesOutPerSec']
    .map(key => [key, stats(rows.map(row => row[key]))]));
}
const summary = { metadata: { ...run, runs: undefined }, phases,
  runs: run.runs.map(item => ({ ...item, frames: stats(item.frames ?? []),
    framesOver33ms: item.frames?.filter(value => value > 33.34).length,
    transitions: Object.fromEntries(['settings', 'friends', 'play', 'library'].map(route =>
      [route, stats(item.transitions.filter(value => value.route === route).map(value => value.ms))])) })) };
fs.writeFileSync(path.join(directory, 'summary.json'), JSON.stringify(summary, null, 2));
for (const item of summary.runs) {
  const name = `packs-${item.count}-run-${item.repeat}`;
  console.log(JSON.stringify({ count: item.count, repeat: item.repeat, cards: item.cards,
    libraryReadyMs: item.libraryReadyMs, idleBeforeMiB: phases[`${name}/idle-before`]?.residentMiB,
    libraryMiB: phases[`${name}/library`]?.residentMiB,
    idleAfterMiB: phases[`${name}/idle-after`]?.residentMiB,
    navigationCpu: phases[`${name}/navigation`]?.cpuMachinePct,
    navigation: item.transitions, frames: item.frames, errors: item.errors }));
}
if (run.errors.length) { console.error(run.errors); process.exitCode = 1; }
