import path from 'node:path';

export const BURROW_NEXT_APP_NAME = 'Burrow Next';
export const BURROW_NEXT_APP_ID = 'com.malyarq.burrow.next';

export function getBurrowNextUserDataPath(appDataPath: string) {
  return path.join(appDataPath, BURROW_NEXT_APP_NAME);
}
