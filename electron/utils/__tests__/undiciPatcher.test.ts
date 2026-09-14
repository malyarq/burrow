import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { patchUndiciThrowOnError } from '../undiciPatcher';

type RuntimeTarget = { manifest: { url: string }; version: { name: string } };

describe('Undici XMCL compatibility', () => {
  const servers: http.Server[] = [];
  const directories: string[] = [];

  afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))));
    for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true });
  });

  async function startServer(): Promise<string> {
    const server = http.createServer((request, response) => {
      if (request.url === '/runtime-index.json') {
        const target: RuntimeTarget = { manifest: { url: `http://${request.headers.host}/runtime-manifest.json` }, version: { name: '21.0.0' } };
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({ 'windows-x64': { 'java-runtime-delta': [target] } }));
        return;
      }
      if (request.url === '/runtime-manifest.json') {
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({ files: {} }));
        return;
      }
      if (request.url === '/download.bin') {
        response.end('xmcl-download');
        return;
      }
      response.statusCode = 404;
      response.end();
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Regression server did not bind a port');
    return `http://127.0.0.1:${address.port}`;
  }

  it('supports the real XMCL installer request and file-transfer stream paths with Undici 7', async () => {
    const origin = await startServer();
    patchUndiciThrowOnError();
    const installer = await import('@xmcl/installer');
    const transfer = await import('@xmcl/file-transfer');
    const destination = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'burrow-undici-patch-')), 'download.bin');
    directories.push(path.dirname(destination));

    await expect(installer.fetchJavaRuntimeManifest({
      url: `${origin}/runtime-index.json`,
      target: installer.JavaRuntimeTargetType.Delta,
      platform: { name: 'windows', arch: 'x64' } as never,
    })).resolves.toMatchObject({ target: 'java-runtime-delta', files: {} });
    await transfer.download({ url: `${origin}/download.bin`, destination });
    expect(fs.readFileSync(destination, 'utf8')).toBe('xmcl-download');
  });

  it('patches dynamic Undici bindings with a dispatcher when loaded after compatibility setup', async () => {
    const origin = await startServer();
    patchUndiciThrowOnError();
    const { Agent, request } = await import('undici');
    const dispatcher = new Agent();

    try {
      await expect(request(`${origin}/runtime-index.json`, { dispatcher, throwOnError: true })).resolves.toMatchObject({ statusCode: 200 });
    } finally {
      await dispatcher.close();
    }
  });
});
