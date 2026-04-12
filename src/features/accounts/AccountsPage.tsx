import React, { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Account } from '@shared/types';
import { Button } from '../../components/ui/Button';
import { AddAccountDialog } from './AddAccountDialog';
import { User, Check, Trash2, Plus, Server } from 'lucide-react';
import clsx from 'clsx';

export const AccountsPage: React.FC = () => {
    const { t } = useSettings();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        const list = await window.account.getAccounts();
        const current = await window.account.getSelectedAccount();
        setAccounts(list);
        setSelectedId(current?.id ?? null);
    };

    const handleSelect = async (id: string) => {
        await window.account.selectAccount(id);
        setSelectedId(id);
    };

    const handleRemove = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(t('accounts.confirmRemove'))) {
            await window.account.removeAccount(id);
            loadAccounts();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('accounts.title')}</h2>
                    <p className="text-zinc-400">{t('accounts.description')}</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                    <Plus size={18} />
                    {t('accounts.addAccount')}
                </Button>
            </div>

            <div className="grid gap-4">
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        onClick={() => handleSelect(account.id)}
                        className={clsx(
                            "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                            selectedId === account.id
                                ? "bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20"
                                : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={clsx(
                                "p-3 rounded-lg",
                                selectedId === account.id ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700/50 text-zinc-400"
                            )}>
                                <User size={24} />
                            </div>
                            <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                    {account.name}
                                    {account.type === 'third-party' && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                            <Server size={10} />
                                            Third Party
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-zinc-500">
                                    {account.type === 'offline' ? 'Offline' : account.user?.id ?? account.id}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedId === account.id && (
                                <div className="flex items-center gap-2 text-emerald-400 mr-2">
                                    <Check size={16} />
                                    <span className="text-sm font-medium">{t('accounts.active')}</span>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleRemove(account.id, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-800/20 rounded-xl border border-dashed border-zinc-700">
                        <User size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{t('accounts.noAccounts')}</p>
                    </div>
                )}
            </div>

            <AddAccountDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdded={loadAccounts}
            />
        </div>
    );
};
