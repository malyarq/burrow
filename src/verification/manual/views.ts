export type ManualVerificationView =
  | 'overview'
  | 'welcome'
  | 'tour'
  | 'dashboard'
  | 'settings-appearance'
  | 'settings-accounts'
  | 'phase-22-theme-dark'
  | 'phase-22-theme-light'
  | 'phase-22-locale-en'
  | 'phase-22-locale-ru'
  | 'phase-17-polish'
  | 'accounts'
  | 'modpack-list'
  | 'modpack-create'
  | 'modpack-browser'
  | 'modpack-details'
  | 'phase-21-browser-density'
  | 'phase-21-details-density'
  | 'phase-21-runtime-create'
  | 'phase-21-runtime-edit'
  | 'phase-21-secondary-density'
  | 'modpack-export'
  | 'modpack-add'
  | 'modpack-install'
  | 'modpack-import-preview'
  | 'modpack-add-modal'
  | 'resource-packs'
  | 'share'
  | 'screenshots'
  | 'utilities'
  | 'content';

export const CORE_VIEWS: Array<{ id: ManualVerificationView; label: string; description: string }> = [
  { id: 'overview', label: 'Overview', description: 'Manual verification hub for milestone-owned v0.4.0 flows.' },
  { id: 'welcome', label: 'Welcome', description: 'First-run welcome overlay.' },
  { id: 'tour', label: 'Tour', description: 'Onboarding spotlight with stable targets.' },
  { id: 'dashboard', label: 'Launcher Home', description: 'Phase 20 launcher-home proof inside the real shell for one canonical mark, one wordmark, and one shell-owned Play CTA.' },
  { id: 'settings-appearance', label: 'Settings -> Appearance', description: 'Shell-integrated appearance proof for shared launcher branding and the accent-vs-brand boundary.' },
  { id: 'settings-accounts', label: 'Settings -> Accounts', description: 'Settings shell with accounts continuity.' },
  {
    id: 'phase-22-theme-dark',
    label: 'Phase 22 Theme Dark',
    description: 'Shell-integrated dark-theme proof for appearance controls under a shipped preset with the Phase 22 state contract.',
  },
  {
    id: 'phase-22-theme-light',
    label: 'Phase 22 Theme Light',
    description: 'Shell-integrated light-theme proof for appearance controls under a custom accent variant with the same shared state contract.',
  },
  {
    id: 'phase-22-locale-en',
    label: 'Phase 22 Locale EN',
    description: 'English route proof combining a modpack primary route and a secondary-content overlay with visible dates and counts.',
  },
  {
    id: 'phase-22-locale-ru',
    label: 'Phase 22 Locale RU',
    description: 'Russian route proof combining a modpack primary route and a secondary-content overlay with visible dates and counts.',
  },
  { id: 'phase-17-polish', label: 'Phase 17 Polish', description: 'Composite proof for constrained catalog, compact nav, and Russian settings localization.' },
  { id: 'accounts', label: 'Accounts', description: 'Standalone account management and skin panel.' },
  { id: 'modpack-list', label: 'Modpack List', description: 'Installed modpack cards and actions.' },
  { id: 'modpack-create', label: 'Create Wizard', description: 'Shell-integrated create wizard proof with a route-owned primary action.' },
  { id: 'modpack-browser', label: 'Modpack Browser', description: 'Shell-integrated content-heavy proof with route-owned browsing controls and neutral fallback art for missing covers.' },
  { id: 'modpack-details', label: 'Modpack Details', description: 'Shell-integrated details proof for route-owned CTA hierarchy and bottom-edge visibility.' },
  {
    id: 'phase-21-browser-density',
    label: 'Phase 21 Browser Density',
    description: 'Crowded shell-integrated browser proof with long labels, stacked metadata, and enough cards to expose dense-route failures.',
  },
  {
    id: 'phase-21-details-density',
    label: 'Phase 21 Details Density',
    description: 'Constrained-width details proof with long metadata, longer tab labels, and dense mod content inside the real shell.',
  },
  {
    id: 'phase-21-runtime-create',
    label: 'Phase 21 Create Summary',
    description: 'Create-wizard runtime summary truth seeded to the same dense runtime fixture used by the edit proof.',
  },
  {
    id: 'phase-21-runtime-edit',
    label: 'Phase 21 Edit Summary',
    description: 'Edit-settings runtime summary truth for the shared dense Phase 21 runtime fixture inside the real shell.',
  },
  {
    id: 'phase-21-secondary-density',
    label: 'Phase 21 Secondary Density',
    description: 'Dense resource-pack management proof with long labels, fallback art, and enough secondary content to reveal hierarchy issues.',
  },
  { id: 'modpack-export', label: 'Export', description: 'Shell-integrated export-route proof for flow-first actions and visible final content edges.' },
  { id: 'modpack-add', label: 'Add Content', description: 'Shell-integrated add-content route proof with demoted shell launch and visible result endings.' },
  { id: 'modpack-install', label: 'Install', description: 'Shell-integrated install-route proof for route-owned CTA hierarchy.' },
  { id: 'modpack-import-preview', label: 'Import Preview', description: 'Shell-integrated import-preview proof with visible final import controls.' },
  { id: 'modpack-add-modal', label: 'Add Mod Modal', description: 'Shell-integrated modal proof showing add-mod overlay state above the real shell.' },
  { id: 'resource-packs', label: 'Resource Packs', description: 'Shell-integrated deep-media proof with no-art pack thumbnails routed through the shared fallback policy.' },
  { id: 'share', label: 'Share', description: 'Share-code modal on the refreshed secondary surface.' },
  { id: 'screenshots', label: 'Screenshots', description: 'Screenshot gallery with live fixture imagery.' },
  { id: 'utilities', label: 'Utilities', description: 'Mirrors priority and local statistics utilities.' },
  { id: 'content', label: 'Content', description: 'Representative world datapack management flow.' },
];

export function isManualVerificationView(value: string | null): value is ManualVerificationView {
  return CORE_VIEWS.some((view) => view.id === value);
}

export function getManualVerificationView(value: string | null): ManualVerificationView {
  return isManualVerificationView(value) ? value : 'overview';
}
