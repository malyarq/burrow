# Packaged launcher stress test (Windows)

Build a Windows package first. This test launches the actual executable with a new,
isolated `BURROW_TEST_USER_DATA` directory for every run. It seeds canonical local
instances and uses the real backend and renderer. It does not launch Minecraft,
download mods, record video, or modify your normal profile. Normal startup metadata
requests still use the network. Keep the test window visible and the machine's
power/display settings unchanged between comparisons.

```powershell
npm run stress:launcher -- --counts=20,200,1000 --rounds=10 --repeats=2
node scripts/stress-summary.js C:/absolute/path/to/work/stress-TIMESTAMP
node scripts/stress-compare.js C:/baseline-result C:/candidate-result
```

Use `--exe=C:/absolute/path/to/Burrow.exe` to measure a different packaged build.
`--output=C:/absolute/path/to/new-directory` must name a directory that does not
exist; its parent must exist. Default output goes into ignored `work/`.

Each tier adds the specified number of synthetic local packs, plus the launcher's
built-in Classic instance. These packs deliberately have no installed game files
or remote cover images. This isolates library size and navigation costs; it does
not measure JAR parsing, image downloads, installation, or gameplay.

Per run: fresh-profile startup, onboarding setup, five-second warmup, 12 seconds
on Play, library population (asserted card count), 12 seconds in Library, 240
scroll frames, repeated Settings/Together/Play/Library navigation, 15 seconds to
settle, 12 seconds on Play again, graceful close. No forced garbage collection.
The benchmark exits nonzero on a functional failure, renderer exception, sampler
failure, or forced app termination. Failure output includes a screenshot and text.

`samples.jsonl` samples the executable's complete process tree roughly every
1-2 seconds with Windows performance counters. `residentMiB` is private resident
RAM (no shared-page double counting); `committedMiB` is private committed memory,
not additional resident RAM. CPU is a percentage of the entire machine. System
available memory and page-out counters provide ambient-load context. GPU VRAM is
not included. Short peaks between samples can be missed.

`run.json` includes workload, executable/asar hashes, checkout version, source HEAD, hardware, observed
startup, DOM count, renderer heap, transitions, and raw frame intervals. Source
HEAD is provenance of the harness checkout, not proof of executable provenance.
Library readiness means all cards exist and two animation frames have elapsed;
it does not wait for every delayed entrance animation. Navigation latency includes
Playwright click handling and two animation frames, not just React render time.
`summary.json` contains medians, p95, maxima, sample counts, and per-route metrics.
The first resource sample of each phase is excluded to avoid boundary CPU mixing.

For an optimization comparison, measure baseline and candidate with identical
counts/rounds/repeats, the same machine and visible window size. Alternate build
order to reduce cache/background-load bias. Compare idle/library/after-navigation
resident memory separately, along with CPU and frame intervals. Report absolute
MiB and percentage differences; reject a claimed win if functionality fails or
latency deteriorates. A short retained-memory increase is not proof of a leak.
The comparison command rejects failed/incomplete runs, mismatched hardware or
workloads, and phases with fewer than three samples. It reports the median of
per-run medians, absolute/percentage reductions, and ranges across repeats.
Neither a different framework's marketing numbers nor this Electron baseline
establish actual Qt/Rust/Tauri savings; each candidate must execute the workload.
