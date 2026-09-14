import React from 'react';
import '@fontsource-variable/inter';
import { createRoot } from 'react-dom/profiling';
import '../../index.css';
import { installManualVerificationEnvironment, seedManualVerificationStorage } from './mockEnvironment';
import { ManualVerificationApp } from './ManualVerificationApp';
import { getManualVerificationView } from './views';
import { AppProviders } from '../../app/providers';
import App from '../../App';

const params = new URLSearchParams(window.location.search);
const view = getManualVerificationView(params.get('view'));
const isProductPreview = params.get('view') === 'product-next';

seedManualVerificationStorage(isProductPreview ? 'dashboard' : view);
if (isProductPreview) {
  localStorage.setItem('onboarding_completed', 'true');
  localStorage.setItem('simple_play_welcome_dismissed', 'true');
  localStorage.setItem('settings_language', params.get('lang') === 'en' ? 'en' : 'ru');
  localStorage.setItem('settings_accentColor', 'blue');
}
installManualVerificationEnvironment();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isProductPreview ? <AppProviders><App /></AppProviders> : <ManualVerificationApp />}
  </React.StrictMode>,
);
