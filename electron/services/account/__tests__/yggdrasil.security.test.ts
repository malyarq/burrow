import { describe, expect, it, vi } from 'vitest';

const fetch = vi.hoisted(() => vi.fn());

vi.mock('electron', () => ({ net: { fetch } }));

import { YggdrasilClient } from '../yggdrasil';

describe('YggdrasilClient error handling', () => {
  it('does not reflect a failed authentication response body', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized', text: vi.fn(async () => 'password=secret token=secret') });

    await expect(new YggdrasilClient('https://auth.example.test').authenticate('player', 'secret')).rejects.toThrow(
      'Authentication failed. Check your credentials and server, then try again.',
    );
  });

  it('does not reflect a failed refresh response body', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 403, statusText: 'Forbidden', text: vi.fn(async () => 'accessToken=secret') });

    await expect(new YggdrasilClient('https://auth.example.test').refresh('secret', 'client-secret')).rejects.toThrow(
      'Authentication refresh failed. Sign in again and try once more.',
    );
  });
});
