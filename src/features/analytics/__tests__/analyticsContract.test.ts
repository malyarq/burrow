import { describe, expect, it } from 'vitest';
import {
  countBucket,
  deriveAnalyticsAttemptId,
  durationBucket,
  resultCountBucket,
  trafficBucket,
} from '../analyticsContract';

describe('analytics data minimization helpers', () => {
  it('reduces precise timings, counts, and traffic to stable coarse buckets', () => {
    expect(durationBucket(249)).toBe('under_250ms');
    expect(durationBucket(60_000)).toBe('1m_3m');
    expect(countBucket(8)).toBe('6_10');
    expect(resultCountBucket(51)).toBe('51_100');
    expect(trafficBucket(10_000_000)).toBe('10mb_100mb');
  });

  it('derives a non-reversible cross-peer attempt id only from a valid random room code', async () => {
    const roomCode = 'ab'.repeat(32);
    const first = await deriveAnalyticsAttemptId(roomCode);
    const second = await deriveAnalyticsAttemptId(roomCode.toUpperCase());

    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(second).toBe(first);
    expect(first).not.toContain(roomCode);
    await expect(deriveAnalyticsAttemptId('not-a-room-code')).resolves.toBeUndefined();
  });
});
