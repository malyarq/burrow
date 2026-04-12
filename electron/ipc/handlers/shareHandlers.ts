import { ipcMain } from 'electron';
import { ShareService } from '../../services/sharing/shareService';

export function registerShareHandlers(deps: { shareService: ShareService }) {
    const { shareService } = deps;

    ipcMain.handle('share:generateCode', async (_evt, modpackId: string) => {
        return await shareService.generateShareCode(modpackId);
    });

    ipcMain.handle('share:importCode', async (_evt, code: string) => {
        return await shareService.resolveShareCode(code);
    });
}
