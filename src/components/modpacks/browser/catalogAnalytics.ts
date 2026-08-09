import type {
  ProviderCatalogSearchRequest,
  ProviderCatalogSearchResult,
  ProviderCatalogVersionDescriptor,
  ProviderCatalogVersionsRequest,
} from '@shared/contracts';
import { analyticsClient, durationBucket, resultCountBucket } from '../../../features/analytics/analyticsClient';
import { providerCatalogIPC } from '../../../services/ipc/providerCatalogIPC';

function hasFilters(request: ProviderCatalogSearchRequest): boolean {
  return Boolean(request.minecraftVersion || request.loader || (request.sort && request.sort !== 'popularity'));
}

function captureSearch(
  request: ProviderCatalogSearchRequest,
  outcome: 'succeeded' | 'failed',
  resultCount: number,
  startedAt: number,
): void {
  void analyticsClient.capture('catalog_search_finished', {
    provider: request.platform,
    outcome,
    has_query: Boolean(request.query?.trim()),
    has_filters: hasFilters(request),
    results: resultCountBucket(resultCount),
    duration: durationBucket(Date.now() - startedAt),
  });
}

export async function searchCatalog(request: ProviderCatalogSearchRequest): Promise<ProviderCatalogSearchResult> {
  const startedAt = Date.now();
  try {
    const response = await providerCatalogIPC.search(request);
    captureSearch(request, 'succeeded', response.total || response.items.length, startedAt);
    return response;
  } catch (error) {
    captureSearch(request, 'failed', 0, startedAt);
    throw error;
  }
}

export async function loadCatalogVersions(
  request: ProviderCatalogVersionsRequest,
): Promise<readonly ProviderCatalogVersionDescriptor[]> {
  const startedAt = Date.now();
  try {
    const versions = await providerCatalogIPC.versions(request);
    void analyticsClient.capture('catalog_project_opened', {
      provider: request.platform, outcome: 'succeeded', duration: durationBucket(Date.now() - startedAt),
    });
    return versions;
  } catch (error) {
    void analyticsClient.capture('catalog_project_opened', {
      provider: request.platform, outcome: 'failed', duration: durationBucket(Date.now() - startedAt),
    });
    throw error;
  }
}
