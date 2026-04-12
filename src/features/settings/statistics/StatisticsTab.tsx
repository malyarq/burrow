import React, { useEffect, useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { CollapsibleSection } from '../../../components/ui/CollapsibleSection';
import type { StatisticsState } from '@shared/contracts/statistics';

export const StatisticsTab: React.FC = () => {
    const { t } = useSettings();
    const [stats, setStats] = useState<StatisticsState | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await window.api.statistics.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load statistics:', error);
            }
        };
        loadStats();
    }, []);

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    if (!stats) {
        return <div className="p-4 text-center text-zinc-500">{t('stats.loading')}</div>;
    }

    return (
        <div className="space-y-4">
            <CollapsibleSection title={t('stats.global_stats')} defaultExpanded>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('stats.total_play_time')}</div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatTime(stats.global.totalPlayTime)}</div>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('stats.total_launches')}</div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.global.totalLaunches}</div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('stats.instance_stats')} defaultExpanded>
                <div className="space-y-2">
                    {Object.entries(stats.instances).map(([id, instance]) => (
                        <div key={id} className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                            <div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">{instance.name || id}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {t('stats.launches')}: {instance.launches}
                                </div>
                            </div>
                            <div className="font-mono text-zinc-700 dark:text-zinc-300">
                                {formatTime(instance.playTime)}
                            </div>
                        </div>
                    ))}
                    {Object.keys(stats.instances).length === 0 && (
                        <div className="text-center text-zinc-500 py-4">{t('stats.no_instance_stats')}</div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
};
