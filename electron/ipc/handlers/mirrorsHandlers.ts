import { ipcMain } from 'electron';
import { MirrorsService } from '../../services/mirrors/mirrorsService';

export function registerMirrorsHandlers({ mirrorsService }: { mirrorsService: MirrorsService }) {
    ipcMain.handle('mirrors:getMirrors', async () => {
        return mirrorsService.getMirrors();
    });

    ipcMain.handle('mirrors:getSelectedMirror', async () => {
        return mirrorsService.getSelectedMirror();
    });

    ipcMain.handle('mirrors:addCustomMirror', async (_, name: string, rootUrl: string) => {
        return await mirrorsService.addCustomMirror(name, rootUrl);
    });

    ipcMain.handle('mirrors:removeMirror', async (_, id: string) => {
        await mirrorsService.removeMirror(id);
    });

    ipcMain.handle('mirrors:selectMirror', async (_, id: string) => {
        await mirrorsService.selectMirror(id);
    });

    ipcMain.handle('mirrors:testSpeed', async (_, url: string) => {
        return await mirrorsService.testSpeed(url);
    });

    ipcMain.handle('mirrors:setAutoSelect', async (_, enabled: boolean) => {
        return await mirrorsService.setAutoSelect(enabled);
    });

    ipcMain.handle('mirrors:isAutoSelectEnabled', async () => {
        return await mirrorsService.isAutoSelectEnabled();
    });
}
