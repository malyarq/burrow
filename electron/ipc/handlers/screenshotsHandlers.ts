import { ipcMain } from 'electron';
import { screenshotService } from '../../services/screenshots/screenshotService';

export function registerScreenshotsHandlers() {
    ipcMain.handle('screenshots:list', async (_, instancePath: string) => {
        return await screenshotService.listScreenshots(instancePath);
    });

    ipcMain.handle('screenshots:delete', async (_, fileName: string, instancePath: string) => {
        await screenshotService.deleteScreenshot(instancePath, fileName);
        return { ok: true };
    });

    ipcMain.handle('screenshots:rename', async (_, oldName: string, newName: string, instancePath: string) => {
        await screenshotService.renameScreenshot(instancePath, oldName, newName);
        return { ok: true };
    });

    ipcMain.handle('screenshots:openFolder', async (_, instancePath: string) => {
        await screenshotService.openScreenshotFolder(instancePath);
        return { ok: true };
    });
}
