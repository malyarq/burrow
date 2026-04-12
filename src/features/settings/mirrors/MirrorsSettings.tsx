import React, { useEffect, useState } from 'react';
import { Mirror } from '../../../../shared/types/mirrors';
import { Button } from '../../../components/ui/Button';
import { Plus, Trash, Globe, Wifi } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../../../contexts/SettingsContext';

export const MirrorsSettings: React.FC = () => {
    const { t } = useSettings();
    const [mirrors, setMirrors] = useState<Mirror[]>([]);
    const [testResults, setTestResults] = useState<Record<string, number | null>>({});
    const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});

    // Dialog state for adding custom mirror
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newMirrorName, setNewMirrorName] = useState('');
    const [newMirrorUrl, setNewMirrorUrl] = useState('');

    const [autoSelect, setAutoSelect] = useState(false);

    // ... existing state ...

    useEffect(() => {
        loadMirrors();
    }, []);

    const loadMirrors = async () => {
        try {
            const list = await window.api.mirrors.getMirrors();
            setMirrors(list);
            const isAuto = await window.api.mirrors.isAutoSelectEnabled();
            setAutoSelect(isAuto);
        } catch (error) {
            console.error('Failed to load mirrors:', error);
        }
    };

    const handleAutoSelectChange = async (enabled: boolean) => {
        try {
            setAutoSelect(enabled); // Optimistic update
            await window.api.mirrors.setAutoSelect(enabled);
            // Reload mirrors to reflect any changes in active status
            await loadMirrors();
        } catch (error) {
            console.error('Failed to set auto-select:', error);
            setAutoSelect(!enabled); // Revert on error
        }
    };

    const handleSelectMirror = async (id: string) => {
        try {
            await window.api.mirrors.selectMirror(id);
            await loadMirrors();
        } catch (error) {
            console.error('Failed to select mirror:', error);
        }
    };

    const handleRemoveMirror = async (id: string) => {
        if (!confirm(t('mirrors.confirmRemove'))) return;
        try {
            await window.api.mirrors.removeMirror(id);
            await loadMirrors();
        } catch (error) {
            console.error('Failed to remove mirror:', error);
        }
    };

    const handleAddMirror = async () => {
        if (!newMirrorName || !newMirrorUrl) return;
        try {
            await window.api.mirrors.addCustomMirror(newMirrorName, newMirrorUrl);
            setNewMirrorName('');
            setNewMirrorUrl('');
            setIsDialogOpen(false);
            await loadMirrors();
        } catch (error) {
            console.error('Failed to add mirror:', error);
        }
    };

    const runSpeedTest = async (mirror: Mirror) => {
        setIsTesting(prev => ({ ...prev, [mirror.id]: true }));
        try {
            // Test root URL or a known file? 
            // For now passing rootUrl, the backend handles the logic
            const latency = await window.api.mirrors.testSpeed(mirror.rootUrl);
            setTestResults(prev => ({ ...prev, [mirror.id]: latency }));
        } catch (error) {
            console.error('Speed test failed:', error);
            setTestResults(prev => ({ ...prev, [mirror.id]: -1 }));
        } finally {
            setIsTesting(prev => ({ ...prev, [mirror.id]: false }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-100">{t('settings.downloads')}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {t('mirrors.description')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none hover:text-white transition-colors">
                        <input
                            type="checkbox"
                            checked={autoSelect}
                            onChange={(e) => handleAutoSelectChange(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 cursor-pointer"
                        />
                        {t('mirrors.autoSelect')}
                    </label>
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                        <Plus size={18} />
                        {t('mirrors.addCustom')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {mirrors.map((mirror) => (
                    <div
                        key={mirror.id}
                        className={clsx(
                            "group relative p-4 rounded-xl border transition-all duration-200",
                            mirror.isActive
                                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                : "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={clsx(
                                    "p-3 rounded-lg",
                                    mirror.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/50 text-gray-400"
                                )}>
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-100">{mirror.name}</h3>
                                        {mirror.isActive && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">
                                                {t('mirrors.current')}
                                            </span>
                                        )}
                                        {mirror.type === 'official' && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20">
                                                Official
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500 font-mono break-all">
                                        {mirror.rootUrl}
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        {testResults[mirror.id] !== undefined && (
                                            <div className={clsx(
                                                "text-xs font-medium flex items-center gap-1.5",
                                                testResults[mirror.id] === -1 ? "text-red-400" :
                                                    (testResults[mirror.id]! < 100 ? "text-emerald-400" :
                                                        (testResults[mirror.id]! < 300 ? "text-yellow-400" : "text-red-400"))
                                            )}>
                                                <Wifi size={14} />
                                                {testResults[mirror.id] === -1 ? "Failed" : `${testResults[mirror.id]}ms`}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => runSpeedTest(mirror)}
                                            disabled={isTesting[mirror.id]}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                        >
                                            {isTesting[mirror.id] ? (
                                                <span className="animate-pulse">Testing...</span>
                                            ) : (
                                                "Test Speed"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!mirror.isActive && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleSelectMirror(mirror.id)}
                                        disabled={autoSelect}
                                        className={clsx(autoSelect && "opacity-50 cursor-not-allowed")}
                                    >
                                        {t('mirrors.use')}
                                    </Button>
                                )}
                                {mirror.type === 'custom' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveMirror(mirror.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                    >
                                        <Trash size={18} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Custom Mirror Dialog - Simple implementation for now */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4">{t('mirrors.addCustomTitle')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    {t('mirrors.name')}
                                </label>
                                <input
                                    type="text"
                                    value={newMirrorName}
                                    onChange={(e) => setNewMirrorName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="My Custom Mirror"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    {t('mirrors.rootUrl')}
                                </label>
                                <input
                                    type="text"
                                    value={newMirrorUrl}
                                    onChange={(e) => setNewMirrorUrl(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://bmclapi2.bangbang93.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be a BMCLAPI-compatible mirror URL.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleAddMirror} disabled={!newMirrorName || !newMirrorUrl}>
                                {t('common.add')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
