import { useSettings } from '../../contexts/SettingsContext';
import { getLaunchStageTitle, type LaunchStage } from '../../features/launcher/services/launcherService';
import { cn } from '../../utils/cn';
import { ProgressBar } from '../ui/ProgressBar';

export interface ClassicLaunchRailProps {
  isLaunching: boolean;
  progress?: number;
  launchStage?: LaunchStage;
  statusText?: string;
  statusDetail?: string;
  minecraftVersion: string;
  loaderLabel: string;
  ramGb: number;
  isOffline: boolean;
}

function translateWithFallback(t: (key: string) => string, key: string, fallback: string) {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

function InfoCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn('min-w-0 border-l border-border px-4 py-1 first:border-l-0 first:pl-0', highlight && 'border-amber-500/30 bg-amber-500/10')}>
      <p className="truncate text-xs font-medium text-muted">{label}</p>
      <p className={cn('mt-0.5 truncate text-sm font-semibold text-foreground', highlight && 'text-amber-700 dark:text-amber-300')}>
        {value}
      </p>
    </div>
  );
}

export function ClassicLaunchRail({
  isLaunching,
  progress,
  launchStage,
  statusText,
  statusDetail,
  minecraftVersion,
  loaderLabel,
  ramGb,
  isOffline,
}: ClassicLaunchRailProps) {
  const { t } = useSettings();
  const stage = launchStage ?? (isLaunching ? 'launching' : 'idle');
  const statusTitle = statusText || getLaunchStageTitle(stage, t);
  const detail = statusDetail || '';
  const showStatus = stage !== 'idle' || Boolean(statusTitle) || Boolean(detail);
  const progressValue = typeof progress === 'number' ? progress : null;
  const showProgress = isLaunching && stage === 'downloading' && progressValue !== null;
  const statusTone = stage === 'failed'
    ? 'border-red-500/30 bg-red-500/10'
    : stage === 'running'
      ? 'border-emerald-500/30 bg-emerald-500/10'
      : 'border-border/70 bg-card/82';
  const launchStatusLabel = translateWithFallback(t, 'dashboard.launch_status', 'Launch status');

  return (
    <>
      {showStatus ? (
        <section
          className={cn('surface-panel mb-5 w-full border p-5', statusTone)}
          aria-label={launchStatusLabel}
          aria-busy={isLaunching}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="kicker-label">{launchStatusLabel}</p>
              {statusTitle ? <h2 className="text-lg font-semibold text-foreground">{statusTitle}</h2> : null}
              {detail ? <p className="text-sm leading-6 text-secondary">{detail}</p> : null}
            </div>
            {showProgress ? (
              <ProgressBar
                value={progressValue}
                label={statusTitle || (t('status.download_progress') || 'Downloading')}
                valueLabel={`${Math.round(progressValue)}%`}
                className="w-full"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mb-6 w-full" aria-label={t('dashboard.info_panel') || 'Current settings'}>
        <h2 className="sr-only">
          {t('dashboard.current_settings') || 'Current settings'}
        </h2>
        <div className="grid min-w-0 grid-cols-2 gap-y-5 border-b border-border pb-6 sm:grid-cols-4">
          <InfoCard label={t('modpacks.minecraft_version') || 'Minecraft version'} value={minecraftVersion} />
          <InfoCard label={t('general.modloader') || 'Modloader'} value={loaderLabel} />
          <InfoCard label={t('dashboard.ram') || 'RAM'} value={`${ramGb} GB`} />
          <InfoCard
            label={t('dashboard.connection') || 'Connection'}
            value={isOffline ? (t('general.offline') || 'Offline') : (t('dashboard.online') || 'Online')}
            highlight={isOffline}
          />
        </div>
      </section>
    </>
  );
}
