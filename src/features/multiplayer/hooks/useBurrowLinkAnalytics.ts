import { useCallback, useEffect, useRef } from 'react';
import type { BurrowLinkSnapshot, NetworkDiagnosticCode } from '../../../../shared/contracts/network';
import {
  analyticsClient,
  countBucket,
  deriveAnalyticsAttemptId,
  durationBucket,
  trafficBucket,
} from '../../analytics/analyticsClient';

export type NetworkMode = 'hyperswarm' | 'xmcl_lan' | 'xmcl_upnp_host';

type LinkAnalyticsSession = {
  role: 'host' | 'join';
  startedAt: number;
  attemptId?: string;
  previousPeerCount: number;
  previousGameConnections: number;
};

function analyticsMode(mode: NetworkMode): 'hyperswarm' | 'lan' | 'upnp' {
  if (mode === 'xmcl_lan') return 'lan';
  if (mode === 'xmcl_upnp_host') return 'upnp';
  return 'hyperswarm';
}

function failureStage(code: NetworkDiagnosticCode): 'validation' | 'discovery' | 'peer' | 'local_game' | 'cleanup' | 'unknown' {
  if (code === 'INVALID_REQUEST') return 'validation';
  if (code === 'TUNNEL_DISCOVERY_FAILED') return 'discovery';
  if (code === 'TUNNEL_LISTEN_FAILED') return 'local_game';
  if (code === 'TUNNEL_CLEANUP_FAILED') return 'cleanup';
  if (code === 'TUNNEL_PEER_UNAVAILABLE' || code === 'TUNNEL_PROTOCOL_VIOLATION') return 'peer';
  return 'unknown';
}

function isQualified(snapshot: BurrowLinkSnapshot): boolean {
  const metrics = snapshot.metrics;
  return (metrics?.gameConnectionCount ?? 0) > 0
    && (metrics?.transferredBytes ?? 0) > 0
    && (metrics?.sessionDurationMs ?? 0) >= 60_000;
}

function restoredSession(snapshot: BurrowLinkSnapshot): LinkAnalyticsSession {
  return {
    role: snapshot.role === 'host' ? 'host' : 'join',
    startedAt: Date.now() - (snapshot.metrics?.sessionDurationMs ?? 0),
    previousPeerCount: 0,
    previousGameConnections: 0,
  };
}

function capturePeerChange(snapshot: BurrowLinkSnapshot, session: LinkAnalyticsSession): void {
  const metrics = snapshot.metrics;
  if (session.previousPeerCount === 0 && snapshot.peerCount > 0) {
    void analyticsClient.capture('burrow_link_peer_connected', {
      role: session.role,
      attempt_id: session.attemptId,
      connection_mode: metrics?.connectionMode ?? 'unknown',
      duration: durationBucket(metrics?.connectDurationMs ?? Date.now() - session.startedAt),
    });
  } else if (session.previousPeerCount > 0 && snapshot.peerCount === 0) {
    void analyticsClient.capture('burrow_link_peer_disconnected', {
      role: session.role,
      attempt_id: session.attemptId,
      qualified: isQualified(snapshot),
      duration: durationBucket(metrics?.sessionDurationMs ?? Date.now() - session.startedAt),
    });
  }
  session.previousPeerCount = snapshot.peerCount;
}

function captureGameConnection(snapshot: BurrowLinkSnapshot, session: LinkAnalyticsSession): void {
  const gameConnections = snapshot.metrics?.gameConnectionCount ?? 0;
  if (session.previousGameConnections === 0 && gameConnections > 0) {
    void analyticsClient.capture('burrow_link_game_connected', {
      role: session.role, attempt_id: session.attemptId,
    });
  }
  session.previousGameConnections = gameConnections;
}

function captureSessionEnded(
  stopped: BurrowLinkSnapshot,
  finalState: BurrowLinkSnapshot,
  session: LinkAnalyticsSession | null,
): void {
  if (!stopped.role || session?.role !== stopped.role) return;
  const metrics = stopped.metrics;
  void analyticsClient.capture('burrow_link_session_ended', {
    role: stopped.role,
    attempt_id: session.attemptId,
    connection_mode: metrics?.connectionMode ?? 'unknown',
    duration: durationBucket(metrics?.sessionDurationMs ?? 0),
    traffic: trafficBucket(metrics?.transferredBytes ?? 0),
    peak_peers: countBucket(metrics?.peakPeerCount ?? stopped.peerCount),
    game_connections: countBucket(metrics?.gameConnectionCount ?? 0),
    qualified: isQualified(stopped),
    end_reason: finalState.state === 'failed' ? 'cleanup_failed' : 'user',
  });
}

export function useBurrowLinkAnalytics(tunnel: BurrowLinkSnapshot, networkMode: NetworkMode) {
  const sessionRef = useRef<LinkAnalyticsSession | null>(null);
  const stoppingSnapshotRef = useRef<BurrowLinkSnapshot | null>(null);

  useEffect(() => {
    void analyticsClient.capture('burrow_link_viewed', { network_mode: analyticsMode(networkMode) });
  }, [networkMode]);

  useEffect(() => {
    if (tunnel.state === 'active' && tunnel.role && !sessionRef.current) {
      const restored = restoredSession(tunnel);
      sessionRef.current = restored;
      if (tunnel.roomCode) {
        void deriveAnalyticsAttemptId(tunnel.roomCode).then((attemptId) => {
          if (sessionRef.current === restored) restored.attemptId = attemptId;
        });
      }
    }

    const session = sessionRef.current;
    if (tunnel.state === 'active' && tunnel.role && session?.role === tunnel.role) {
      capturePeerChange(tunnel, session);
      captureGameConnection(tunnel, session);
    }

    if (tunnel.state === 'stopping') stoppingSnapshotRef.current = tunnel;
    const stopped = stoppingSnapshotRef.current;
    if (!stopped || (tunnel.state !== 'idle' && tunnel.state !== 'failed')) return;

    captureSessionEnded(stopped, tunnel, sessionRef.current);
    sessionRef.current = null;
    stoppingSnapshotRef.current = null;
  }, [tunnel]);

  const beginAttempt = useCallback(async (role: 'host' | 'join', roomCode?: string) => {
    const session: LinkAnalyticsSession = {
      role,
      startedAt: Date.now(),
      previousPeerCount: 0,
      previousGameConnections: 0,
      attemptId: roomCode ? await deriveAnalyticsAttemptId(roomCode) : undefined,
    };
    sessionRef.current = session;
    void analyticsClient.capture('burrow_link_attempt_started', { role, attempt_id: session.attemptId });
  }, []);

  const discoveryReady = useCallback(async (roomCode?: string) => {
    const session = sessionRef.current;
    if (!session) return;
    if (!session.attemptId && roomCode) session.attemptId = await deriveAnalyticsAttemptId(roomCode);
    if (sessionRef.current !== session) return;
    void analyticsClient.capture('burrow_link_discovery_ready', {
      role: session.role,
      attempt_id: session.attemptId,
      duration: durationBucket(Date.now() - session.startedAt),
    });
  }, []);

  const failed = useCallback((code: NetworkDiagnosticCode) => {
    const session = sessionRef.current;
    if (!session) return;
    void analyticsClient.capture('burrow_link_failed', {
      role: session.role,
      attempt_id: session.attemptId,
      failure_stage: failureStage(code),
      diagnostic_code: code,
      duration: durationBucket(Date.now() - session.startedAt),
    });
    sessionRef.current = null;
  }, []);

  const validationFailed = useCallback((role: 'host' | 'join') => {
    void analyticsClient.capture('burrow_link_failed', {
      role, failure_stage: 'validation', diagnostic_code: 'INVALID_REQUEST', duration: 'under_250ms',
    });
  }, []);

  const inviteCopied = useCallback(() => {
    void analyticsClient.capture('burrow_link_invite_copied', { attempt_id: sessionRef.current?.attemptId });
  }, []);

  const modeSelected = useCallback((mode: NetworkMode) => {
    void analyticsClient.capture('network_mode_selected', { mode: analyticsMode(mode) });
  }, []);

  return { beginAttempt, discoveryReady, failed, inviteCopied, modeSelected, validationFailed };
}
