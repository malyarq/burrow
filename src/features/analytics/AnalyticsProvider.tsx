import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import {
  analyticsClient,
  durationBucket,
  getAnalyticsConsent,
  persistAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsClient,
  type AnalyticsCaptureResult,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analyticsClient';

type AnalyticsContextValue = {
  capture<K extends AnalyticsEventName>(event: K, properties: AnalyticsEventMap[K]): Promise<AnalyticsCaptureResult>;
  enabled: boolean;
  configured: boolean;
  consent: AnalyticsConsent;
  setEnabled(enabled: boolean, source?: 'onboarding' | 'settings'): void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);
const rendererStartedAt = typeof performance === 'undefined' ? 0 : performance.now();

export function AnalyticsProvider(props: { children: ReactNode; client?: AnalyticsClient }) {
  const client = props.client ?? analyticsClient;
  const { language, uiMode } = useSettings();
  const [consent, setConsent] = useState<AnalyticsConsent>(() => getAnalyticsConsent());
  const enabled = consent === 'granted';
  const startupCaptured = useRef(false);
  const startupDuration = useRef<ReturnType<typeof durationBucket>>('under_250ms');

  useEffect(() => {
    startupDuration.current = durationBucket(
      typeof performance === 'undefined' ? 0 : performance.now() - rendererStartedAt,
    );
  }, []);

  const capture = useCallback(<K extends AnalyticsEventName>(event: K, properties: AnalyticsEventMap[K]) => (
    client.capture(event, properties)
  ), [client]);

  const setEnabled = useCallback((nextEnabled: boolean, source: 'onboarding' | 'settings' = 'settings') => {
    persistAnalyticsConsent(nextEnabled);
    setConsent(nextEnabled ? 'granted' : 'denied');
    if (nextEnabled) void capture('analytics_enabled', { source });
    else client.clearLocalData();
  }, [capture, client]);

  useEffect(() => {
    if (!enabled || startupCaptured.current || window.location.hash === '#console') return;
    startupCaptured.current = true;
    void capture('app_opened', { language, ui_mode: uiMode, startup_duration: startupDuration.current });
  }, [capture, enabled, language, uiMode]);

  const value = useMemo<AnalyticsContextValue>(() => ({
    capture,
    configured: client.configured,
    consent,
    enabled,
    setEnabled,
  }), [capture, client.configured, consent, enabled, setEnabled]);

  return <AnalyticsContext.Provider value={value}>{props.children}</AnalyticsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within an AnalyticsProvider');
  return context;
}
