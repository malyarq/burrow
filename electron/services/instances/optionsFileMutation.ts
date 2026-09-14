import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'fs-extra';
import { replaceFileAtomically } from '../../security/zipWriter';

const pendingMutations = new Map<string, Promise<void>>();

/** Serializes read-modify-write updates for one Minecraft options file. */
export async function mutateOptionsFile(filePath: string, update: (content: string) => string): Promise<void> {
  const previous = pendingMutations.get(filePath) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(async () => {
    let current = '';
    try { current = await fs.readFile(filePath, 'utf8'); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    const temporaryPath = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${randomUUID()}.tmp`);
    try {
      await fs.writeFile(temporaryPath, update(current), 'utf8');
      await replaceFileAtomically(temporaryPath, filePath);
    } finally {
      await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    }
  });
  pendingMutations.set(filePath, next);
  try {
    await next;
  } finally {
    if (pendingMutations.get(filePath) === next) pendingMutations.delete(filePath);
  }
}
