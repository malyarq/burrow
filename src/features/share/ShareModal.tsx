import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Share2, Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    modpackId: string;
}

export function ShareModal({ isOpen, onClose, modpackId }: ShareModalProps) {
    const { t } = useSettings();
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && modpackId) {
            setLoading(true);
            setError(null);
            window.api.share.generateCode(modpackId)
                .then(setCode)
                .catch(err => {
                     
                    console.error(err);
                    setError(t('share.error_desc') || 'Ошибка генерации кода');
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, modpackId, t]);

    const handleCopy = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    {t('share.title')}
                </div>
            }
        >

            <div className="space-y-4 py-4">
                <p className="text-sm text-zinc-400">
                    {t('share.desc')}
                </p>

                {loading ? (
                    <div className="flex justify-center p-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-900/20 text-red-400 rounded-md text-sm border border-red-900/50">
                        {error}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value={code}
                            className="font-mono text-xs bg-zinc-950 border-zinc-800"
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <Button
                            onClick={handleCopy}
                            variant="secondary"
                            className={cn(
                                "min-w-[100px] transition-all duration-200",
                                copied ? "bg-green-600 hover:bg-green-700 text-white" : ""
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    {t('error.copied')}
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    {t('share.copy')}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
