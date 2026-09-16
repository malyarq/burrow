// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RuntimeSection } from '../RuntimeSection';

const mocked = vi.hoisted(() => ({ scan: vi.fn(), get: vi.fn(), select: vi.fn() }));
vi.mock('../../../../../services/ipc/javaRuntimeIPC', () => ({ javaRuntimeIPC: mocked }));

function config(id: string) {
  return { id, name: id, runtime: { minecraft: '1.20.1' }, memory: { maxMb: 4096 } };
}

function view(id: string) {
  return render(<RuntimeSection
    modpackConfig={config(id)}
    setMemoryGb={vi.fn()}
    setMinMemoryGb={vi.fn()}
    t={(key) => key}
    getAccentStyles={() => ({})}
  />);
}

describe('RuntimeSection Java lifecycle', () => {
  afterEach(() => vi.clearAllMocks());

  it('serializes selection and ignores its result after switching instances', async () => {
    mocked.scan.mockResolvedValue([{ id: 'java-21', version: '21.0.6', majorVersion: 21 }]);
    mocked.get.mockResolvedValue({ installationId: null });
    let resolve!: () => void;
    mocked.select.mockImplementationOnce(() => new Promise<void>((done) => { resolve = done; }));
    const rendered = view('alpha');
    const select = await screen.findByLabelText('Java runtime');
    await waitFor(() => expect((select as HTMLSelectElement).disabled).toBe(false));
    fireEvent.change(select, { target: { value: 'java-21' } });
    expect((select as HTMLSelectElement).disabled).toBe(true);
    fireEvent.change(select, { target: { value: '' } });
    expect(mocked.select).toHaveBeenCalledTimes(1);
    rendered.rerender(<RuntimeSection modpackConfig={config('beta')} setMemoryGb={vi.fn()} setMinMemoryGb={vi.fn()} t={(key) => key} getAccentStyles={() => ({})} />);
    await waitFor(() => expect(mocked.get).toHaveBeenCalledWith({ instanceId: 'beta' }));
    await act(async () => resolve());
    expect((select as HTMLSelectElement).value).toBe('');
  });

  it('loads the persisted opaque selection after scan and clears it for Auto', async () => {
    mocked.scan.mockResolvedValue([{ id: 'java-21', version: '21.0.6', majorVersion: 21 }]);
    mocked.get.mockResolvedValue({ installationId: 'java-21' });
    mocked.select.mockResolvedValue({ status: 'auto' });
    view('alpha');

    const select = await screen.findByLabelText('Java runtime');
    await waitFor(() => expect((select as HTMLSelectElement).value).toBe('java-21'));
    fireEvent.change(select, { target: { value: '' } });
    await waitFor(() => expect(mocked.select).toHaveBeenCalledWith({ instanceId: 'alpha', installationId: null }));
    expect((select as HTMLSelectElement).value).toBe('');
  });

  it('ignores a late Java scan from the previous instance', async () => {
    let resolveAlpha!: (value: readonly { id: string; version: string; majorVersion: number }[]) => void;
    let resolveBeta!: (value: readonly { id: string; version: string; majorVersion: number }[]) => void;
    mocked.scan
      .mockImplementationOnce(() => new Promise((resolve) => { resolveAlpha = resolve; }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolveBeta = resolve; }));
    mocked.get.mockImplementation(async ({ instanceId }: { instanceId: string }) => ({ installationId: `${instanceId}-java` }));
    const rendered = view('alpha');

    rendered.rerender(<RuntimeSection
      modpackConfig={config('beta')}
      setMemoryGb={vi.fn()}
      setMinMemoryGb={vi.fn()}
      t={(key) => key}
      getAccentStyles={() => ({})}
    />);
    resolveBeta([{ id: 'beta-java', version: '21.0.6', majorVersion: 21 }]);
    const select = await screen.findByLabelText('Java runtime');
    await waitFor(() => expect((select as HTMLSelectElement).value).toBe('beta-java'));
    resolveAlpha([{ id: 'alpha-java', version: '17.0.12', majorVersion: 17 }]);
    await waitFor(() => expect((select as HTMLSelectElement).value).toBe('beta-java'));
    expect(mocked.get).toHaveBeenCalledWith({ instanceId: 'beta' });
  });
});
