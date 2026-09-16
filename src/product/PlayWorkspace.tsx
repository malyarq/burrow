import { useCallback, useId, useMemo, useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import type { AppLayoutProps } from '../components/AppLayout';
import { GameTab } from '../components/settings/tabs/GameTab';
import { ClassicContentTabs } from '../components/simple-play/ClassicContentTabs';
import { DegradedStateView } from '../components/layout/DegradedStateView';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Select } from '../components/ui/Select';
import { useSettings, useUIMode } from '../contexts/SettingsContext';
import { useEffectiveInstance } from '../features/instances/hooks/useEffectiveInstance';
import {
  dispatchInstanceConfigCommand,
  useInstanceConfigCommands,
} from '../features/instances/hooks/useInstanceConfigCommands';
import { useInstanceInvalidation } from '../features/instances/hooks/useInstanceInvalidation';
import { useModSupportedVersions } from '../features/launcher/hooks/useModSupportedVersions';
import {
  getLaunchActionLabel,
  getLaunchStageTitle,
  isLoaderSupported,
} from '../features/launcher/services/launcherService';
import { buildModpackRuntimeSummary } from '../features/modpacks/hooks/useModpackRuntimeSummary';
import { usePersistentModpackNavigation } from '../features/modpacks/navigation/ModpackNavigationContext';
import { RestartGameButton } from './RestartGameButton';
import { OptifineToggle } from '../components/sidebar/OptifineToggle';
import { CLASSIC_MODPACK_ID } from '../../shared/constants';
import { toDisplayErrorMessage } from '../utils/displayError';

export type PlayWorkspaceProps = Pick<AppLayoutProps, 'launch' | 'runtime' | 'actions'>;

function text(t: (key: string) => string, key: string, fallback: string) {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

export function PlayWorkspace({ launch, runtime, actions }: PlayWorkspaceProps) {
  const { t, getAccentStyles, disableAnimations } = useSettings();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const advancedId = useId();
  const { setMode } = useUIMode();
  const effectiveInstance = useEffectiveInstance();
  const instanceId = effectiveInstance.status === 'ready' ? effectiveInstance.data.id : null;
  const configCommands = useInstanceConfigCommands(instanceId);
  const { invalidateInstance } = useInstanceInvalidation();
  const { forgeVersions, fabricVersions, neoForgeVersions, optiFineVersions } = useModSupportedVersions();
  const modpackNavigation = usePersistentModpackNavigation();
  const busy = runtime.isLaunching;
  const config = effectiveInstance.status === 'ready' ? effectiveInstance.data.snapshot : null;
  const runtimeSummary = useMemo(() => (
    config ? buildModpackRuntimeSummary({ config, optiFineVersions }) : null
  ), [config, optiFineVersions]);
  const loaderSupported = isLoaderSupported({
    loaderType: launch.loaderType,
    mcVersion: launch.version,
    forgeVersions: launch.supportedVersions.forge.length ? launch.supportedVersions.forge : forgeVersions,
    fabricVersions: launch.supportedVersions.fabric.length ? launch.supportedVersions.fabric : fabricVersions,
    neoForgeVersions: launch.supportedVersions.neoForge.length ? launch.supportedVersions.neoForge : neoForgeVersions,
  });
  const canLaunch = !busy && loaderSupported && effectiveInstance.status === 'ready';
  const stageTitle = getLaunchStageTitle(runtime.launchStage, t);
  const actionLabel = getLaunchActionLabel(runtime.launchStage, t);
  const showProgress = busy && runtime.launchStage === 'downloading' && typeof runtime.progress === 'number';

  const retry = useCallback(() => {
    void invalidateInstance(CLASSIC_MODPACK_ID);
  }, [invalidateInstance]);
  const updateVersion = useCallback((version: string) => {
    launch.setVersion(version);
  }, [launch]);
  const updateLoader = useCallback((loader: PlayWorkspaceProps['launch']['loaderType']) => {
    launch.setLoader(loader);
  }, [launch]);
  const openGuidedContent = useCallback((contentType: 'resourcepack' | 'shader') => {
    if (!instanceId) return;
    modpackNavigation.navigate({
      type: contentType === 'resourcepack' ? 'addResourcePack' : 'addShader',
      modpackId: instanceId,
    });
    setMode('modpacks');
  }, [instanceId, modpackNavigation, setMode]);

  if (effectiveInstance.status === 'idle' || effectiveInstance.status === 'loading') {
    return (
      <main className="h-full overflow-y-auto px-4 py-6 sm:px-7 lg:px-10" aria-label={text(t, 'play_workspace.title', 'Играть')}>
        <DegradedStateView
          variant="unavailable"
          layout="workspace"
          testId="play-workspace-loading"
          title={text(t, 'play_workspace.loading_title', 'Подготавливаем игру')}
          description={text(t, 'play_workspace.loading_desc', 'Читаем текущую игровую конфигурацию.')}
        >
          <LoadingSpinner size="md" variant="accent" />
        </DegradedStateView>
      </main>
    );
  }

  if (effectiveInstance.status === 'error' || effectiveInstance.status === 'uninitialized') {
    const unavailable = effectiveInstance.status === 'uninitialized';
    return (
      <main className="h-full overflow-y-auto px-4 py-6 sm:px-7 lg:px-10" aria-label={text(t, 'play_workspace.title', 'Играть')}>
        <DegradedStateView
          variant={unavailable ? 'unavailable' : 'error'}
          layout="workspace"
          testId={unavailable ? 'play-workspace-unavailable' : 'play-workspace-error'}
          title={text(t, unavailable ? 'play_workspace.unavailable_title' : 'play_workspace.error_title', unavailable ? 'Игра пока не готова' : 'Не удалось открыть игру')}
          description={unavailable
            ? text(t, 'play_workspace.unavailable_desc', 'Обновите конфигурацию и попробуйте снова.')
            : toDisplayErrorMessage(effectiveInstance.error.message, text(t, 'play_workspace.error_desc', 'Повторите попытку, не закрывая этот экран.'))}
          footer={<Button variant="secondary" size="sm" onClick={retry}>{text(t, 'operations.retry', 'Повторить')}</Button>}
        />
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-auto" aria-label={text(t, 'play_workspace.title', 'Играть')}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
        <header className="next-play-heading">
          <div className="space-y-2">
          <p className="kicker-label">{text(t, 'play_workspace.kicker', 'Minecraft launcher')}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{text(t, 'play_workspace.title', 'Играть')}</h1>
          <p className="text-sm leading-6 text-secondary">{text(t, 'play_workspace.intro', 'Выберите версию и профиль, затем запустите игру.')}</p>
          </div>
          <img src="./burrow-next-landscape.png" alt="" className="next-play-landscape" />
        </header>

        <section className="surface-panel grid gap-5 p-5 sm:p-6" aria-label={text(t, 'play_workspace.launch_title', 'Запуск игры')}>
          <div className="next-launch-fields">
            <Select
              label={text(t, 'modpacks.minecraft_version', 'Версия Minecraft')}
              value={launch.version}
              onChange={(event) => updateVersion(event.target.value)}
              disabled={busy}
              data-testid="play-workspace-version"
            >
              {launch.version && !launch.versions.some((version) => version.id === launch.version) && <option value={launch.version}>{launch.version}</option>}
              {launch.versions.map((version) => (
                <option key={version.id} value={version.id}>{version.id}</option>
              ))}
            </Select>
            <Input
              label={text(t, 'general.nickname', 'Никнейм')}
              value={launch.nickname}
              onChange={(event) => launch.setNickname(event.target.value)}
              disabled={busy}
              placeholder="Steve"
              data-testid="play-workspace-nickname"
            />
          <div className="min-w-0">
            <Button
              variant="primary"
              size="md"
              onClick={runtime.onLaunch}
              disabled={!canLaunch}
              progress={showProgress ? runtime.progress : undefined}
              className="w-full"
              data-testid="play-workspace-launch"
            >
              <Play className="h-5 w-5" fill="currentColor" />
              {busy ? actionLabel : text(t, 'general.play', 'Играть')}
            </Button>
          </div>
          </div>
          {launch.isOffline ? <p className="text-right text-xs text-secondary">{text(t, 'general.offline', 'Офлайн')}</p> : null}
          <fieldset className="min-w-0" data-testid="play-workspace-loader">
            <legend className="control-label mb-2">{text(t, 'general.modloader', 'Загрузчик модов')}</legend>
            <div className="next-loader-switch">
              {(['vanilla', 'fabric', 'forge', 'neoforge'] as const).map((loader) => {
                const supported = isLoaderSupported({
                  loaderType: loader, mcVersion: launch.version,
                  forgeVersions: launch.supportedVersions.forge.length ? launch.supportedVersions.forge : forgeVersions,
                  fabricVersions: launch.supportedVersions.fabric.length ? launch.supportedVersions.fabric : fabricVersions,
                  neoForgeVersions: launch.supportedVersions.neoForge.length ? launch.supportedVersions.neoForge : neoForgeVersions,
                });
                return <button key={loader} type="button" aria-pressed={launch.loaderType === loader}
                  disabled={busy || !supported} onClick={() => updateLoader(loader)}>
                  {loader === 'vanilla' ? text(t, 'play_workspace.vanilla', 'Vanilla') : loader === 'neoforge' ? 'NeoForge' : loader[0].toUpperCase() + loader.slice(1)}
                </button>;
              })}
            </div>
          </fieldset>
        </section>

        {!loaderSupported ? (
          <p className="border-l-2 border-border px-3 text-sm leading-6 text-secondary" role="status">
            {text(t, 'play_workspace.loader_unsupported', 'Выбранный загрузчик не поддерживает эту версию Minecraft. Выберите другой загрузчик или версию.')}
          </p>
        ) : null}

        {runtime.statusText || runtime.statusDetail ? (
          <section className="border-y border-border/70 py-4" aria-live="polite" aria-label={text(t, 'dashboard.launch_status', 'Статус запуска')}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-medium text-foreground">{runtime.statusText || stageTitle}</p>
              {runtime.canForceRestart && <RestartGameButton />}
            </div>
            {runtime.statusDetail ? <p className="mt-1 text-sm leading-6 text-secondary">{runtime.statusDetail}</p> : null}
            {showProgress ? <ProgressBar className="mt-4" value={runtime.progress ?? 0} valueLabel={`${Math.round(runtime.progress ?? 0)}%`} /> : null}
          </section>
        ) : null}

        <section className="order-last border-t border-border/70 pt-6">
          <button type="button" className="next-disclosure-trigger" aria-expanded={advancedOpen}
            aria-controls={advancedId} onClick={() => setAdvancedOpen((open) => !open)}>
            <ChevronDown className={advancedOpen ? 'rotate-180' : ''} aria-hidden="true" />
            {text(t, 'play_workspace.advanced_title', 'Расширенные настройки')}
          </button>
          <div id={advancedId} className="next-disclosure" data-open={advancedOpen} data-motion={!disableAnimations} inert={!advancedOpen}>
          <div className="min-h-0 overflow-hidden"><div className="pt-5">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="kicker-label">{text(t, 'play_workspace.configuration_kicker', 'Configuration')}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={actions.onShowSettings} disabled={busy}>{text(t, 'general.settings', 'Настройки')}</Button>
          </div>
          <GameTab
            modpackConfig={config}
            setMemoryGb={(value) => dispatchInstanceConfigCommand(configCommands.setMemoryGb(value))}
            setMinMemoryGb={(value) => dispatchInstanceConfigCommand(configCommands.setMinMemoryGb(value))}
            setVmOptions={(value) => dispatchInstanceConfigCommand(configCommands.setVmOptions(value))}
            setGameExtraArgs={(value) => dispatchInstanceConfigCommand(configCommands.setGameExtraArgs(value))}
            setGameResolution={(value) => dispatchInstanceConfigCommand(configCommands.setGameResolution(value))}
            setAutoConnectServer={(value) => dispatchInstanceConfigCommand(configCommands.setAutoConnectServer(value))}
            t={t}
            getAccentStyles={getAccentStyles}
            isReadOnly={busy}
          />
          <div className="mt-4">
            <OptifineToggle
              isOptiFineSupported={launch.supportedVersions.optiFine.includes(launch.version)}
              useForge={launch.useForge}
              useOptiFine={launch.useOptiFine}
              setUseOptiFine={launch.setUseOptiFine}
              disabled={busy}
              t={t}
              getAccentStyles={getAccentStyles}
            />
          </div>
          </div></div></div>
        </section>

        {runtimeSummary ? (
          <section className="border-t border-border/70 pt-6" aria-labelledby="play-workspace-content">
            <div className="mb-4">
              <p className="kicker-label">{text(t, 'play_workspace.content_kicker', 'Library')}</p>
              <h2 id="play-workspace-content" className="mt-1 text-xl font-semibold text-foreground">{text(t, 'dashboard.content', 'Контент')}</h2>
            </div>
            <ClassicContentTabs
              presentation="inline"
              instanceId={effectiveInstance.data.id}
              showMods={Boolean(runtimeSummary.runtime.modLoader)}
              runtimeSummary={runtimeSummary}
              onOpenGuidedContent={openGuidedContent}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
