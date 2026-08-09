// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_MODPACK_BROWSER_STATE } from '../../../features/modpacks/hooks/useModpackNavigation';
import { useModpackBrowserCatalog } from '../browser/useModpackBrowserCatalog';

const mocks = vi.hoisted(() => ({
  analyticsCapture: vi.fn(),
  search: vi.fn(),
  versions: vi.fn(),
}));

vi.mock('../../../hooks/useDebounce', () => ({ useDebounce: (value: string) => value }));
vi.mock('../../../services/ipc/providerCatalogIPC', () => ({
  providerCatalogIPC: { search: mocks.search, versions: mocks.versions },
}));
vi.mock('../../../features/analytics/analyticsClient', () => ({
  analyticsClient: { capture: mocks.analyticsCapture },
  durationBucket: () => '250ms_1s',
  resultCountBucket: () => '1_10',
}));

describe('modpack browser analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.analyticsCapture.mockReset().mockResolvedValue('sent');
    mocks.search.mockReset().mockResolvedValue({
      items: [{ platform: 'modrinth', projectId: 'private-project-id', title: 'Private search result' }],
      total: 1,
    });
    mocks.versions.mockReset().mockResolvedValue([{
      platform: 'modrinth', versionId: 'private-version-id', name: 'Version', mcVersions: [], loaders: [], files: [],
    }]);
  });

  it('records useful search and open outcomes without the query or project ids', async () => {
    const onNavigate = vi.fn();
    const { result } = renderHook(() => useModpackBrowserCatalog({
      initialState: { ...DEFAULT_MODPACK_BROWSER_STATE, query: 'private search words' },
      onNavigate,
      onStateChange: vi.fn(),
    }));

    await waitFor(() => expect(result.current.results).toHaveLength(1));
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('catalog_search_finished', {
      provider: 'modrinth',
      outcome: 'succeeded',
      has_query: true,
      has_filters: false,
      results: '1_10',
      duration: '250ms_1s',
    });

    await act(async () => result.current.openModpack(result.current.results[0]));
    expect(mocks.analyticsCapture).toHaveBeenCalledWith('catalog_project_opened', {
      provider: 'modrinth', outcome: 'succeeded', duration: '250ms_1s',
    });
    expect(onNavigate).toHaveBeenCalledOnce();

    const analyticsPayloads = JSON.stringify(mocks.analyticsCapture.mock.calls);
    expect(analyticsPayloads).not.toContain('private search words');
    expect(analyticsPayloads).not.toContain('private-project-id');
    expect(analyticsPayloads).not.toContain('private-version-id');
  });
});
