export const BRAND_WORDMARK = 'Burrow'

export function getBundledAssetPath(fileName: string, baseUrl = import.meta.env.BASE_URL) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBase}${fileName.replace(/^\/+/, '')}`
}

export const APP_ICON_PATH = getBundledAssetPath('icon.ico')
export const LAUNCHER_MARK_PATH = getBundledAssetPath('launcher-mark.png')

function createSvgDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const MEDIA_FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" fill="none" shape-rendering="crispEdges">
  <rect width="320" height="180" fill="#25231f"/>
  <rect x="12" y="12" width="296" height="156" fill="#302d27" stroke="#585249" stroke-width="4"/>
  <path d="M16 128h40v-16h32V96h32v16h32v-32h32v16h32v16h32v16h36v36H16z" fill="#464138"/>
  <path d="M16 144h56v-16h40v16h40v-16h40v16h40v-16h40v16h28v20H16z" fill="#6b6255"/>
  <path d="M16 160h84v-16h36v16h48v-16h36v16h84v4H16z" fill="#8a7a65"/>
  <rect x="136" y="64" width="48" height="48" fill="#1f1e1b"/>
  <rect x="144" y="72" width="32" height="32" fill="#4c453b"/>
  <rect x="152" y="80" width="16" height="16" fill="#c5a36a"/>
  <path d="M40 44h16v16H40zm24 0h16v16H64zm24 0h16v16H88zm144 0h16v16h-16zm24 0h16v16h-16zm24 0h16v16h-16z" fill="#7b7366"/>
  <path d="M40 76h72v4H40zm168 0h72v4h-72z" fill="#8a7a65"/>
</svg>
`.trim()

export const MEDIA_FALLBACK_PATH = createSvgDataUri(MEDIA_FALLBACK_SVG)

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
