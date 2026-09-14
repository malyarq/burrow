// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MultiplayerPage from '../MultiplayerPage';

const state = vi.hoisted(() => ({ current: {} as Record<string, unknown> }));
vi.mock('../../features/multiplayer/hooks/useMultiplayer', () => ({ useMultiplayer: () => state.current }));
vi.mock('../../contexts/SettingsContext', () => ({ useSettings: () => ({ t: (key: string) => key, getAccentStyles: () => ({ className: '', style: undefined }) }) }));

const base = {
  mode: 'host', setMode: vi.fn(), port: '25565', setPort: vi.fn(), roomCode: '', invitation: '', joinCode: '', setJoinCode: vi.fn(), mappedPort: null, directAddress: '',
  status: '', diagnostic: undefined, isLoading: false, setNetworkMode: vi.fn(), host: vi.fn(), join: vi.fn(), stop: vi.fn(), selectLanServer: vi.fn(), copyToClipboard: vi.fn(),
  tunnel: { revision: 0, state: 'idle', role: null, peerCount: 0 },
  lan: { revision: 0, state: 'idle', family: null, discoveredCount: 0 },
  upnp: { revision: 0, state: 'idle', mappings: [] }, discovered: [],
};

describe('MultiplayerPage capability surfaces', () => {
  afterEach(cleanup);
  beforeEach(() => {
    window.matchMedia = vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })) as never;
  });

  it('shows room-code controls only for Burrow Link', () => {
    state.current = { ...base, networkMode: 'hyperswarm', mode: 'join' };
    render(<MultiplayerPage onBack={vi.fn()} />);
    expect(screen.getByText('multiplayer.invite_or_code')).toBeTruthy();
    expect(screen.queryByText('multiplayer.scan_lan')).toBeNull();
  });

  it('shows LAN discovery without room-code controls', () => {
    state.current = { ...base, networkMode: 'xmcl_lan', mode: 'join' };
    render(<MultiplayerPage onBack={vi.fn()} />);
    expect(screen.getByText('multiplayer.scan_lan')).toBeTruthy();
    expect(screen.queryByText('multiplayer.invite_or_code')).toBeNull();
  });

  it('keeps UPnP host-only and exposes mapping action', () => {
    state.current = { ...base, networkMode: 'xmcl_upnp_host' };
    render(<MultiplayerPage onBack={vi.fn()} />);
    expect(screen.getByText('multiplayer.map_port')).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it.each([
    [0, 0, 'multiplayer.endpoint_waiting'],
    [1, 0, 'multiplayer.peer_ready'],
    [1, 1, 'multiplayer.game_stream_open'],
  ])('distinguishes peer=%i and open streams=%i', (peerCount, activeGameConnectionCount, expected) => {
    state.current = { ...base, networkMode: 'hyperswarm', mode: 'join', mappedPort: 30000, directAddress: 'localhost:30000',
      tunnel: { revision: 1, state: 'active', role: 'join', peerCount, metrics: { gameConnectionCount: 3, activeGameConnectionCount } },
    };
    render(<MultiplayerPage onBack={vi.fn()} />);
    expect(screen.getAllByText(expected)).toHaveLength(2);
    expect(screen.queryByText('multiplayer.tunnel_established')).toBeNull();
    expect(screen.getByText('localhost:30000')).toBeTruthy();
  });

  it('shows a safe timeout diagnostic and retains the stop action', () => {
    state.current = { ...base, networkMode: 'hyperswarm', mode: 'join', mappedPort: 30000, directAddress: 'localhost:30000',
      tunnel: { revision: 1, state: 'active', role: 'join', peerCount: 0 }, diagnostic: { code: 'TUNNEL_PEER_UNAVAILABLE' },
    };
    render(<MultiplayerPage onBack={vi.fn()} />);
    expect(screen.getByRole('status').textContent).toBe('multiplayer.diagnostic.TUNNEL_PEER_UNAVAILABLE');
    expect(screen.getByRole('button', { name: 'multiplayer.stop' })).toBeTruthy();
  });
});
