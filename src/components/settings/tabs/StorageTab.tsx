import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { ModpacksIPC } from '../../../services/ipc/modpacksIPC';
import { formatSize } from '../../../utils/format';
import { cn } from '../../../utils/cn';

interface StorageStats {
    totalSize: number;
    dedupedSize: number;
    totalFiles: number;
    storedFiles: number;
}

interface StorageSettingsProps {
    t: (key: string) => string;
    getAccentStyles: (type: 'bg' | 'text' | 'border') => { className?: string; style?: React.CSSProperties };
    modpacksIPC: ModpacksIPC;
}

export const StorageSettings: React.FC<StorageSettingsProps> = ({ t, getAccentStyles, modpacksIPC }) => {
    const [stats, setStats] = useState<StorageStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [cleanupResult, setCleanupResult] = useState<{ freedSize: number; deletedFiles: number } | null>(null);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await modpacksIPC.getContentStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load storage stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleCleanup = async () => {
        if (!confirm(t('settings.storage.cleanupConfirm'))) return;

        setLoading(true);
        try {
            const result = await modpacksIPC.cleanupContent();
            setCleanupResult(result);
            await loadStats(); // Reload stats after cleanup
        } catch (error) {
            console.error('Failed to cleanup content:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {t('settings.storage.title')}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t('settings.storage.description')}
                </p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            {t('settings.storage.totalSize')}
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {formatSize(stats.totalSize)}
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            {t('settings.storage.savedSize')}
                        </div>
                        <div
                            className={cn("text-2xl font-bold", getAccentStyles('text').className)}
                            style={getAccentStyles('text').style}
                        >
                            {formatSize(stats.dedupedSize)}
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            {t('settings.storage.storedFiles')}
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {stats.storedFiles}
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            {t('settings.storage.totalLogicalFiles')}
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {stats.totalFiles}
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                            {t('settings.storage.cleanup')}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {t('settings.storage.cleanupDesc')}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={handleCleanup}
                        disabled={loading}
                    >
                        {loading ? t('common.loading') : t('settings.storage.cleanupBtn')}
                    </Button>
                </div>

                {cleanupResult && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md border border-green-200 dark:border-green-800/50">
                        {t('settings.storage.cleanupResult')
                            .replace('{size}', formatSize(cleanupResult.freedSize))
                            .replace('{count}', cleanupResult.deletedFiles.toString())}
                    </div>
                )}
            </div>
        </div>
    );
};
