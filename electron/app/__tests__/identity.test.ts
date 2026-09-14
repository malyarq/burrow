import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BURROW_NEXT_APP_ID, BURROW_NEXT_APP_NAME, getBurrowNextUserDataPath } from '../identity';

describe('Burrow Next application identity', () => {
  it('uses an app identity and user-data directory that cannot overlap stable Burrow', () => {
    expect(BURROW_NEXT_APP_NAME).toBe('Burrow Next');
    expect(BURROW_NEXT_APP_ID).toBe('com.malyarq.burrow.next');
    expect(getBurrowNextUserDataPath(path.join('C:', 'Users', 'player', 'AppData', 'Roaming')))
      .toBe(path.join('C:', 'Users', 'player', 'AppData', 'Roaming', 'Burrow Next'));
  });
});
