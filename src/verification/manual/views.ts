export type ManualVerificationView =
  | 'overview'
  | 'welcome'
  | 'tour'
  | 'dashboard'
  | 'settings-appearance'
  | 'settings-accounts'
  | 'phase-17-polish'
  | 'accounts'
  | 'modpack-list'
  | 'modpack-create'
  | 'modpack-browser'
  | 'modpack-details'
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
  { id: 'phase-17-polish', label: 'Phase 17 Polish', description: 'Composite proof for constrained catalog, compact nav, and Russian settings localization.' },
  { id: 'accounts', label: 'Accounts', description: 'Standalone account management and skin panel.' },
  { id: 'modpack-list', label: 'Modpack List', description: 'Installed modpack cards and actions.' },
  { id: 'modpack-create', label: 'Create Wizard', description: 'Shell-integrated create wizard proof with a route-owned primary action.' },
  { id: 'modpack-browser', label: 'Modpack Browser', description: 'Shell-integrated content-heavy proof with route-owned browsing controls and neutral fallback art for missing covers.' },
  { id: 'modpack-details', label: 'Modpack Details', description: 'Shell-integrated details proof for route-owned CTA hierarchy and bottom-edge visibility.' },
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
