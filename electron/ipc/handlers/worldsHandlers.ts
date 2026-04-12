import { ipcMain, shell } from 'electron';
import { worldsService } from '../../services/worlds/worldService';

export function registerWorldsHandlers() {
    ipcMain.removeHandler('worlds:list');
    ipcMain.handle('worlds:list', async (_evt, instancePath: string) => {
        return await worldsService.list(instancePath);
    });

    ipcMain.removeHandler('worlds:delete');
    ipcMain.handle('worlds:delete', async (_evt, folderName: string, instancePath: string) => {
        return await worldsService.delete(folderName, instancePath);
    });

    ipcMain.removeHandler('worlds:backup');
    ipcMain.handle('worlds:backup', async (_evt, folderName: string, instancePath: string) => {
        return await worldsService.backup(folderName, instancePath);
    });

    ipcMain.removeHandler('worlds:duplicate');
    ipcMain.handle('worlds:duplicate', async (_evt, folderName: string, instancePath: string) => {
        return await worldsService.duplicate(folderName, instancePath);
    });

    ipcMain.removeHandler('worlds:openFolder');
    ipcMain.handle('worlds:openFolder', async (_evt, folderName: string, instancePath: string) => {
        const worldPath = worldsService.getWorldPath(folderName, instancePath);
        await shell.openPath(worldPath);
    });
}
