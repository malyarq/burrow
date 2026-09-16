import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

if (process.argv.length !== 4) throw Error('Usage: node scripts/stress-compare.js BASELINE_DIRECTORY CANDIDATE_DIRECTORY');
const [baseline, candidate] = process.argv.slice(2).map(dir => JSON.parse(fs.readFileSync(path.join(path.resolve(dir), 'summary.json'), 'utf8')));
for (const report of [baseline, candidate]) {
  assert.equal(report.metadata.errors.length, 0, 'Cannot compare a failed benchmark');
  assert.equal(report.runs.length, report.metadata.counts.length * report.metadata.repeats, 'Incomplete run');
  assert.ok(report.runs.every(run => run.errors.length === 0 && run.cards === run.count + 1), 'Functional checks failed');
}
for (const field of ['hardware', 'counts', 'rounds', 'repeats']) {
  assert.deepEqual(candidate.metadata[field], baseline.metadata[field], `Comparison requires matching ${field}`);
}
assert.deepEqual(candidate.runs.map(run => run.viewport), baseline.runs.map(run => run.viewport), 'Viewport mismatch');
function median(values) {
  values.sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}
const comparison = [];
for (const count of baseline.metadata.counts) {
  for (const phase of ['idle-before', 'library', 'navigation', 'idle-after']) {
    for (const metric of ['residentMiB', 'cpuMachinePct']) {
      const values = [baseline, candidate].map(report => report.runs.filter(run => run.count === count).map(run => {
        const summary = report.phases[`packs-${count}-run-${run.repeat}/${phase}`]?.[metric];
        assert.ok(summary?.n >= 3, `Insufficient samples: ${count}/${phase}/${metric}`);
        return summary.median;
      }));
      const before = median(values[0]), after = median(values[1]);
      comparison.push({ packs: count, phase, metric, baseline: +before.toFixed(3), candidate: +after.toFixed(3),
        reduction: +(before - after).toFixed(3), reductionPct: before === 0 ? null : +(100 * (before - after) / before).toFixed(1),
        baselineRange: [Math.min(...values[0]), Math.max(...values[0])],
        candidateRange: [Math.min(...values[1]), Math.max(...values[1])] });
    }
  }
}
console.log(JSON.stringify(comparison, null, 2));
console.error('Positive reduction means lower consumption. Compare latency/frame metrics too; this is not a statistical significance test.');
