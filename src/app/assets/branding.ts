export const BRAND_WORDMARK = 'Burrow'

export function getBundledAssetPath(fileName: string, baseUrl = import.meta.env.BASE_URL) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBase}${fileName.replace(/^\/+/, '')}`
}

export const APP_ICON_PATH = getBundledAssetPath('icon.ico')
export const LAUNCHER_MARK_PATH = getBundledAssetPath('launcher-mark.png')

export const MEDIA_FALLBACK_PATH = getBundledAssetPath('burrow-next-landscape.png')

export type BrandAssetRole = 'app-icon' | 'product-mark' | 'media-fallback'

export type BrandAssetDefinition = {
  alt: string
  label: string
  path: string
  role: BrandAssetRole
}

export const BRAND_ASSETS: Record<BrandAssetRole, BrandAssetDefinition> = {
  'app-icon': {
    role: 'app-icon',
    path: APP_ICON_PATH,
    label: 'Burrow app icon',
    alt: 'Burrow app icon',
  },
  'product-mark': {
    role: 'product-mark',
    path: LAUNCHER_MARK_PATH,
    label: 'Burrow mark',
    alt: 'Burrow mark',
  },
  'media-fallback': {
    role: 'media-fallback',
    path: MEDIA_FALLBACK_PATH,
    label: 'Burrow media fallback art',
    alt: 'Burrow media fallback art',
  },
}

export function getBrandAsset(role: BrandAssetRole) {
  return BRAND_ASSETS[role]
}

export function getBrandAssetPath(role: BrandAssetRole) {
  return getBrandAsset(role).path
}

export function getBrandWordmark() {
  return BRAND_WORDMARK
}

export function isBundledAssetSource(source: string | null | undefined, assetPath: string): boolean {
  if (!source) {
    return false
  }

  const normalizedSource = source.split('#')[0]?.split('?')[0] ?? ''
  const normalizedAsset = assetPath.split('#')[0]?.split('?')[0] ?? assetPath
  const absoluteAssetSuffix = normalizedAsset.startsWith('./')
    ? normalizedAsset.slice(1)
    : normalizedAsset

  return normalizedSource === normalizedAsset || normalizedSource.endsWith(absoluteAssetSuffix)
}

export function isBrandAssetSource(source: string | null | undefined, role: BrandAssetRole) {
  return isBundledAssetSource(source, getBrandAssetPath(role))
}
