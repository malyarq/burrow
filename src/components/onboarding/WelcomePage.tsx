import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Box, Gamepad2, Globe2, Languages, Settings2, ShieldCheck, Waypoints } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { BrandLockup } from '../branding/BrandLockup';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';
import { useAnalytics } from '../../features/analytics/AnalyticsProvider';
import { FirstRunReadiness } from './FirstRunReadiness';

interface WelcomePageProps {
  onComplete: () => void;
  onStartTour: () => void;
  onShowMultiplayer: () => void;
  onShowSettings: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onComplete,
  onStartTour,
  onShowMultiplayer,
  onShowSettings,
}) => {
  const { language, setLanguage, setUIMode, t, getAccentStyles, getAccentHex } = useSettings();
  const { capture, configured, consent, setEnabled } = useAnalytics();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const continueWithConsent = (action: () => void) => {
    if (configured && consent === 'unknown') {
      setPendingAction(() => action);
      return;
    }
    action();
  };

  const finishConsent = (enabled: boolean) => {
    setEnabled(enabled, 'onboarding');
    if (enabled) void capture('onboarding_shown', {});
    const action = pendingAction;
    setPendingAction(null);
    action?.();
  };

  const openModpacks = () => {
    void capture('onboarding_action', { action: 'modpacks' });
    setUIMode('modpacks');
    onComplete();
  };

  const openLauncher = () => {
    void capture('onboarding_action', { action: 'play_now' });
    onComplete();
  };

  const openMultiplayer = () => {
    void capture('onboarding_action', { action: 'burrow_link' });
    onShowMultiplayer();
  };

  const openSettings = () => {
    void capture('onboarding_action', { action: 'settings' });
    onShowSettings();
  };

  const choices = [
    {
      icon: Gamepad2,
      title: t('onboarding.welcome.play_now'),
      description: t('onboarding.welcome.play_now_desc'),
      action: openLauncher,
      button: t('onboarding.welcome.play_now_action'),
    },
    {
      icon: Globe2,
      title: t('onboarding.welcome.play_together'),
      description: t('onboarding.welcome.play_together_desc'),
      action: openMultiplayer,
      button: t('onboarding.welcome.play_together_action'),
    },
    {
      icon: Box,
      title: t('onboarding.welcome.modpacks'),
      description: t('onboarding.welcome.modpacks_desc'),
      action: openModpacks,
      button: t('onboarding.welcome.modpacks_action'),
    },
  ];

  return (
    <Modal
      isOpen
      onClose={() => undefined}
      closeDisabled
      closeLabel={t('general.close_dialog')}
      hideHeader
      ariaLabelledBy="welcome-title"
      overlayClassName="bg-background/84 backdrop-blur-xl"
      className="max-w-5xl"
      bodyClassName="!p-0"
    >
      <div className="relative bg-card text-foreground">
      {pendingAction ? (
        <div className="relative flex min-h-[34rem] flex-col overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{ background: `radial-gradient(circle at top, ${getAccentHex()}28 0%, transparent 46%), radial-gradient(circle at bottom left, ${getAccentHex()}18 0%, transparent 30%)` }}
          />
          <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <BrandLockup
              direction="horizontal"
              markFrame="none"
              markRole="product-mark"
              markSize="lg"
              className="mb-8"
              wordmarkTone="default"
              wordmarkClassName="text-[1.75rem]"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${getAccentHex()}18`, color: getAccentHex() }}>
              <BarChart3 className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 id="welcome-title" className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              {t('onboarding.analytics.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-6 text-secondary">
              {t('onboarding.analytics.description')}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-secondary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>{t('onboarding.analytics.local_control')}</span>
            </div>
            <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => finishConsent(true)}>
                {t('onboarding.analytics.accept')}
              </Button>
              <Button variant="secondary" onClick={() => finishConsent(false)}>
                {t('onboarding.analytics.decline')}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => setPendingAction(null)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('general.back')}
            </Button>
          </div>
        </div>
      ) : (
      <>
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: `radial-gradient(circle at top, ${getAccentHex()}28 0%, transparent 38%), radial-gradient(circle at bottom left, ${getAccentHex()}18 0%, transparent 26%)` }}
      />
      <div className="relative overflow-hidden">
        <div className="relative border-b border-border/60 px-6 py-4 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div
              className="surface-soft mb-4 flex items-center gap-1 rounded-xl p-1 sm:absolute sm:right-6 sm:top-6 sm:mb-0"
              role="group"
              aria-label={t('onboarding.welcome.language')}
            >
              <Languages className="mx-2 h-4 w-4 text-secondary" aria-hidden="true" />
              {(['en', 'ru'] as const).map((nextLanguage) => (
                <button
                  key={nextLanguage}
                  type="button"
                  aria-pressed={language === nextLanguage}
                  onClick={() => setLanguage(nextLanguage)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-semibold uppercase transition-colors',
                    language === nextLanguage ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground',
                  )}
                >
                  {nextLanguage}
                </button>
              ))}
            </div>

            <BrandLockup
              direction="horizontal"
              markFrame="none"
              markRole="product-mark"
              markSize="xl"
              className="mb-4"
              wordmarkTone="default"
              wordmarkClassName="text-[2rem]"
            />
              <h1
                id="welcome-title"
                className={cn('text-xl font-semibold tracking-tight sm:text-2xl', getAccentStyles('text').className)}
                style={getAccentStyles('text').style}
              >
                {t('onboarding.welcome.title')}
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-6 text-secondary">
                {t('onboarding.welcome.intro')}
              </p>
          </div>
        </div>

        <FirstRunReadiness />

        <div className="grid gap-3 p-5 md:grid-cols-3">
          {choices.map(({ icon: Icon, title, description, action, button }, index) => (
            <article key={title} className="surface-card flex min-w-0 flex-col p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${getAccentHex()}14`, color: getAccentHex() }}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-bold text-foreground">{title}</h2>
              </div>
              <p className="mb-4 flex-1 text-sm leading-6 text-secondary">{description}</p>
              <Button
                variant={index === 0 ? 'primary' : 'secondary'}
                onClick={() => continueWithConsent(action)}
                className="w-full"
              >
                {button}
              </Button>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 bg-background/28 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-2xl text-sm leading-6 text-secondary">
            {t('onboarding.welcome.account_note')}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => continueWithConsent(onStartTour)}>
              <Waypoints className="h-4 w-4" aria-hidden="true" />
              {t('onboarding.welcome.tour')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => continueWithConsent(openSettings)}>
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              {t('general.settings')}
            </Button>
          </div>
        </div>
      </div>
      </>
      )}
      </div>
    </Modal>
  );
};
