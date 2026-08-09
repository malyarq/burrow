// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BurrowLinkSnapshot } from '../../../../../shared/contracts/network';
import { useBurrowLinkAnalytics } from '../useBurrowLinkAnalytics';

const capture = vi.hoisted(() => vi.fn());

vi.mock('../../../analytics/analyticsClient', () => ({
  analyticsClient: { capture },
  countBucket: (value: number) => value > 0 ? '1' : '0',
  deriveAnalyticsAttemptId: async () => 'safe-attempt-hash',
  durationBucket: (value: number) => value >= 60_000 ? '1m_3m' : 'under_250ms',
  trafficBucket: (value: number) => value > 0 ? 'under_1mb' : 'none',
}));

const idle: BurrowLinkSnapshot = { revision: 0, state: 'idle', role: null, peerCount: 0 };

describe('useBurrowLinkAnalytics', () => {
  beforeEach(() => {
    capture.mockReset().mockResolvedValue('sent');
  });

  it('records a qualified session lifecycle without exposing the room code', async () => {
    const roomCode = 'ab'.repeat(32);
    const { result, rerender } = renderHook(
      ({ snapshot }) => useBurrowLinkAnalytics(snapshot, 'hyperswarm'),
      { initialProps: { snapshot: idle } },
    );

    await act(async () => result.current.beginAttempt('join', roomCode));
    expect(capture).toHaveBeenCalledWith('burrow_link_attempt_started', {
      role: 'join', attempt_id: 'safe-attempt-hash',
    });

    rerender({
      snapshot: {
        revision: 1,
        state: 'active',
        role: 'join',
        roomCode,
        localPort: 30_000,
        peerCount: 1,
        metrics: {
          connectionMode: 'direct', connectDurationMs: 200, sessionDurationMs: 200,
          transferredBytes: 0, peakPeerCount: 1, gameConnectionCount: 0,
        },
      },
    });
    expect(capture).toHaveBeenCalledWith('burrow_link_peer_connected', {
      role: 'join',
      attempt_id: 'safe-attempt-hash',
      connection_mode: 'direct',
      duration: 'under_250ms',
    });

    const finalMetrics = {
      connectionMode: 'direct' as const,
      connectDurationMs: 200,
      sessionDurationMs: 61_000,
      transferredBytes: 500,
      peakPeerCount: 1,
      gameConnectionCount: 1,
    };
    rerender({ snapshot: { revision: 2, state: 'active', role: 'join', peerCount: 1, metrics: finalMetrics } });
    expect(capture).toHaveBeenCalledWith('burrow_link_game_connected', {
      role: 'join', attempt_id: 'safe-attempt-hash',
    });

    rerender({ snapshot: { revision: 3, state: 'stopping', role: 'join', peerCount: 1, metrics: finalMetrics } });
    rerender({ snapshot: { revision: 4, state: 'idle', role: null, peerCount: 0 } });
    expect(capture).toHaveBeenCalledWith('burrow_link_session_ended', {
      role: 'join',
      attempt_id: 'safe-attempt-hash',
      connection_mode: 'direct',
      duration: '1m_3m',
      traffic: 'under_1mb',
      peak_peers: '1',
      game_connections: '1',
      qualified: true,
      end_reason: 'user',
    });
    expect(JSON.stringify(capture.mock.calls)).not.toContain(roomCode);
  });
});
