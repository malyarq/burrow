import React, { useEffect, useId, useRef, useState } from 'react';

import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { cn } from '../../../../utils/cn';
import type { ModpackConfig } from '../../../../contexts/instances/types';
import { MAX_INSTANCE_MEMORY_GB } from '../../../../contexts/instances/utils/configPatching';
import { javaRuntimeIPC } from '../../../../services/ipc/javaRuntimeIPC';
import type { JavaRuntimeInstallationDto } from '@shared/contracts';
import { getRequiredJavaForMinecraftVersion } from '@shared/minecraftRuntime';

// Helper to get RAM in GB
const getRamGb = (config: ModpackConfig | null, defaultVal: number): number => {
  if (!config?.memory?.maxMb) return defaultVal;
  return config.memory.maxMb / 1024;
};

const getMinRamGb = (config: ModpackConfig | null, defaultVal: number): number => {
  if (!config?.memory?.minMb) return defaultVal;
  return config.memory.minMb / 1024;
};

function translateWithFallback(
  t: (key: string, params?: Record<string, string | number>) => string,
  key: string,
  fallback: string,
  params?: Record<string, string | number>,
) {
  const translated = t(key, params);
  return translated === key ? fallback : translated;
}

export function RuntimeSection(props: {
  modpackConfig: ModpackConfig | null;
  setMemoryGb: (gb: number) => void;
  setMinMemoryGb: (gb: number) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getAccentStyles: (type: 'bg' | 'text' | 'border' | 'ring' | 'hover' | 'accent' | 'title' | 'soft-bg' | 'soft-border') => {
    className?: string;
    style?: React.CSSProperties;
  };
  isReadOnly?: boolean;
}) {
  const { modpackConfig, setMemoryGb, setMinMemoryGb, t, getAccentStyles, isReadOnly = false } = props;
  const [detectedJavas, setDetectedJavas] = useState<readonly JavaRuntimeInstallationDto[]>([]);
  const [selectedInstallationId, setSelectedInstallationId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [memoryInput, setMemoryInput] = useState('');
  const memoryHintId = useId();
  const javaSelectId = useId();
  const minMemorySliderId = useId();
  const javaLoadGeneration = useRef(0);
  const [isSelectingJava, setIsSelectingJava] = useState(false);
  const selectingJavaRef = useRef(false);
  const [sliderRange, setSliderRange] = useState({ id: modpackConfig?.id, max: 32 });

  const loadJava = async (instanceId: string | null, generation: number) => {
    setIsScanning(true);
    try {
      const result = await javaRuntimeIPC.scan();
      if (generation !== javaLoadGeneration.current) return;
      const selection = instanceId ? await javaRuntimeIPC.get({ instanceId }) : { installationId: null };
      if (generation !== javaLoadGeneration.current) return;
      setDetectedJavas(result);
      setSelectedInstallationId(result.some((java) => java.id === selection.installationId) ? selection.installationId : null);
    } catch (err) {
      if (generation === javaLoadGeneration.current) console.error('Failed to scan Java:', err);
    } finally {
      if (generation === javaLoadGeneration.current) setIsScanning(false);
    }
  };

  const scanJava = () => {
    const instanceId = modpackConfig?.id ?? null;
    const generation = ++javaLoadGeneration.current;
    void loadJava(instanceId, generation);
  };

  useEffect(() => {
    const instanceId = modpackConfig?.id;
    const generation = ++javaLoadGeneration.current;
    setDetectedJavas([]);
    setSelectedInstallationId(null);
    void loadJava(instanceId ?? null, generation);
    return () => { javaLoadGeneration.current += 1; };
  }, [modpackConfig?.id]);

  useEffect(() => {
    if (isReadOnly) {
      setShowAdvanced(true);
    }
  }, [isReadOnly]);

  const selectedJava = detectedJavas.find((java) => java.id === selectedInstallationId);

  const currentRam = getRamGb(modpackConfig, 4);
  const sliderMaxGb = Math.max(32, currentRam, sliderRange.id === modpackConfig?.id ? sliderRange.max : 32);
  const retainSliderRange = () => setSliderRange({ id: modpackConfig?.id, max: sliderMaxGb });
  const sliderMidpointGb = sliderMaxGb / 2;
  const requiredJavaVer = getRequiredJavaForMinecraftVersion(modpackConfig?.runtime?.minecraft ?? '1.16.5');

  useEffect(() => {
    setMemoryInput(String(currentRam));
  }, [currentRam]);

  // Warnings
  const warnings: string[] = [];

  // 32-bit check
  if (selectedJava?.arch === 'x86' && currentRam > 1.5) {
    warnings.push(
      translateWithFallback(
        t,
        'settings.warning_32bit_java',
        'You are using 32-bit Java with more than 1.5 GB of RAM. This may cause crashes.',
      ),
    );
  }

  // Java version mismatch
  if (selectedJava && selectedJava.majorVersion !== requiredJavaVer) {
    warnings.push(
      translateWithFallback(
        t,
        'settings.warning_java_version',
        'Minecraft {{version}} requires exactly Java {{required}}. Selected: Java {{selected}}.',
        {
          version: modpackConfig?.runtime?.minecraft ?? '?',
          required: requiredJavaVer,
          selected: selectedJava.majorVersion,
        },
      ),
    );
  }

  // Low RAM
  if (currentRam < 1.0) {
    warnings.push(
      translateWithFallback(t, 'settings.warning_low_ram', 'Less than 1 GB of RAM is allocated. This may cause lag.'),
    );
  }

  const handleJavaChange = async (installationId: string) => {
    const instanceId = modpackConfig?.id;
    if (!instanceId || selectingJavaRef.current) return;
    const generation = javaLoadGeneration.current;
    selectingJavaRef.current = true;
    setIsSelectingJava(true);

    try {
      await javaRuntimeIPC.select({ instanceId, installationId: installationId || null });
      if (generation === javaLoadGeneration.current) setSelectedInstallationId(installationId || null);
    } catch (err) {
      console.error('Failed to select Java runtime:', err);
    } finally {
      selectingJavaRef.current = false;
      setIsSelectingJava(false);
    }
  };

  const applyMemoryInput = () => {
    const requested = Number(memoryInput);
    if (!Number.isFinite(requested) || requested <= 0) {
      setMemoryInput(String(currentRam));
      return;
    }
    const next = Math.min(MAX_INSTANCE_MEMORY_GB, Math.max(1, requested));
    setMemoryInput(String(next));
    setSliderRange({ id: modpackConfig?.id, max: Math.max(32, next) });
    setMemoryGb(next);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Memory Slider (Max) */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="control-label">
              {translateWithFallback(t, 'settings.ram', 'Allocated Memory (RAM)')}
            </label>
            <span className="text-sm font-mono font-semibold text-foreground">
              {currentRam} GB
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => { setSliderRange({ id: modpackConfig?.id, max: 32 }); setMemoryGb(2); }}
            >
              2 GB
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => { setSliderRange({ id: modpackConfig?.id, max: 32 }); setMemoryGb(4); }}
            >
              4 GB
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => { setSliderRange({ id: modpackConfig?.id, max: 32 }); setMemoryGb(8); }}
            >
              8 GB
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-end">
            <div>
              <input
                type="range"
                aria-label={t('settings.ram')}
                onPointerDown={retainSliderRange}
                onKeyDown={retainSliderRange}
                min="1"
                max={sliderMaxGb}
                step="0.5"
                value={currentRam}
                onChange={(e) => setMemoryGb(parseFloat(e.target.value))}
                className={cn('settings-slider', getAccentStyles('accent').className)}
                style={getAccentStyles('accent').style}
              />
              <div className="relative mx-[0.65rem] mt-1 h-5 text-xs text-secondary" aria-hidden="true">
                <span className="absolute left-0">1 GB</span>
                <span data-testid="memory-tick-midpoint" className="absolute -translate-x-1/2" style={{ left: `${(sliderMidpointGb - 1) / (sliderMaxGb - 1) * 100}%` }}>{sliderMidpointGb} GB</span>
                <span className="absolute right-0">{sliderMaxGb} GB</span>
              </div>
            </div>
            <Input
              type="number"
              min="1"
              max={MAX_INSTANCE_MEMORY_GB}
              step="0.5"
              inputMode="decimal"
              label={translateWithFallback(t, 'settings.memory_input', 'Memory in GB')}
              aria-describedby={memoryHintId}
              value={memoryInput}
              onChange={(event) => setMemoryInput(event.target.value)}
              onBlur={applyMemoryInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
            />
          </div>
          <p id={memoryHintId} className="helper-text mt-2">
            {translateWithFallback(t, 'settings.memory_limit_hint', `Enter 1–${MAX_INSTANCE_MEMORY_GB} GB. Burrow starts with 4 GB; leave enough memory for your system.`)}
          </p>
        </div>

        {/* Min Memory Slider (Advanced) */}
        {showAdvanced && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between mb-2">
              <label className="control-label">
                {translateWithFallback(t, 'settings.min_ram', 'Initial Memory (Xms)')}
              </label>
              <span className="text-sm font-mono font-semibold text-foreground">
                {getMinRamGb(modpackConfig, 1)} GB
              </span>
            </div>
            <input
              id={minMemorySliderId}
              type="range"
              aria-label={translateWithFallback(t, 'settings.min_ram', 'Initial Memory (Xms)')}
              min="0.5"
              max={getRamGb(modpackConfig, 4)}
              step="0.5"
              value={getMinRamGb(modpackConfig, 1)}
              onChange={(e) => setMinMemoryGb(parseFloat(e.target.value))}
              className={cn('settings-slider', getAccentStyles('accent').className)}
              style={getAccentStyles('accent').style}
            />
            <div className="helper-text flex justify-between text-[10px]">
              <span>0.5 GB</span>
              <span>{getRamGb(modpackConfig, 4)} GB</span>
            </div>
            <p className="helper-text mt-2">
              {translateWithFallback(t, 'settings.min_ram_explanation', 'Initial memory is reserved when Minecraft starts. It can reduce startup stutter, but uses memory before the game needs it.')}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isReadOnly ? (
            <p className="text-xs text-secondary">
              {translateWithFallback(
                t,
                'settings.runtime_locked',
                'Launch is in progress. These settings stay visible for reference and unlock when the current run finishes.',
              )}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-muted underline transition-colors hover:text-foreground"
            >
              {showAdvanced
                ? translateWithFallback(t, 'general.hide_advanced', 'Hide advanced')
                : translateWithFallback(t, 'general.show_advanced', 'Show advanced')}
            </button>
          )}
        </div>

        {/* Warnings Area */}
        {warnings.length > 0 && (
          <div className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                <span>⚠️</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        <p className="helper-text">{t('settings.java_runtime_help')}</p>

        {/* Java Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={javaSelectId} className="control-label">
              {translateWithFallback(t, 'settings.java_runtime', 'Java runtime')}
            </label>
            <Button size="sm" variant="ghost" onClick={scanJava} disabled={isScanning || isSelectingJava || isReadOnly}>
              {isScanning
                ? translateWithFallback(t, 'general.scanning', 'Scanning...')
                : translateWithFallback(t, 'general.rescan', 'Rescan')}
            </Button>
          </div>

          <Select
            id={javaSelectId}
            value={selectedInstallationId ?? ''}
            onChange={(e) => void handleJavaChange(e.target.value)}
            disabled={isScanning || isSelectingJava || isReadOnly}
          >
            <option value="">{translateWithFallback(t, 'settings.java_auto', 'Auto')}</option>
            {detectedJavas.map((java) => (
              <option key={java.id} value={java.id}>
                Java {java.majorVersion} ({java.version}){java.arch ? ` [${java.arch}]` : ''}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}
