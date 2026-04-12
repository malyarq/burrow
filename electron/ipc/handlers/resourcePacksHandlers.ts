
import { ipcMain, shell, dialog } from 'electron';
import { resourcePacksService } from '../../services/resourcePacks/resourcePackService';
import * as path from 'path';
import * as fs from 'fs';

export function registerResourcePacksHandlers() {
    ipcMain.handle('resourcePacks:list', async (_, instancePath: string) => {
        return await resourcePacksService.list(instancePath);
    });

    ipcMain.handle('resourcePacks:enable', async (_, fileName: string, instancePath: string) => {
        const ok = await resourcePacksService.enable(fileName, instancePath);
        return { ok };
    });

    ipcMain.handle('resourcePacks:disable', async (_, fileName: string, instancePath: string) => {
        const ok = await resourcePacksService.disable(fileName, instancePath);
        return { ok };
    });

    ipcMain.handle('resourcePacks:reorder', async (_, fileNames: string[], instancePath: string) => {
        const ok = await resourcePacksService.reorder(fileNames, instancePath);
        return { ok };
    });

    ipcMain.handle('resourcePacks:import', async (_, filePath: string, instancePath: string) => {
        const ok = await resourcePacksService.import(filePath, instancePath);
        return { ok };
    });

    ipcMain.handle('resourcePacks:delete', async (_, fileName: string, instancePath: string) => {
        const ok = await resourcePacksService.delete(fileName, instancePath);
        return { ok };
    });

    ipcMain.handle('resourcePacks:openFolder', async (_, instancePath: string) => {
        const folder = path.join(instancePath || '', 'resourcepacks');
        // Ensure folder exists? shell.openPath doesn't create it, but usually it exists if game ran.
        // We could create it if not exists using fs/promises but let's assume existence or handle error.

        if (!fs.existsSync(folder)) {
            try { fs.mkdirSync(folder, { recursive: true }); } catch (e) {
                console.error('Failed to create resourcepacks folder', e);
            }
        }
        await shell.openPath(folder);
        return { ok: true };
    });
    ipcMain.handle('resourcePacks:add', async (_, instancePath: string) => {

        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Resource Packs', extensions: ['zip'] }]
        });

        if (canceled || filePaths.length === 0) return false;

        const folder = path.join(instancePath || '', 'resourcepacks');
        if (!fs.existsSync(folder)) {
            try { fs.mkdirSync(folder, { recursive: true }); } catch (e) {
                console.error('Failed to create resourcepacks folder', e);
                return false;
            }
        }

        let success = true;
        for (const filePath of filePaths) {
            try {
                const fileName = path.basename(filePath);
                const destPath = path.join(folder, fileName);
                fs.copyFileSync(filePath, destPath);
            } catch (err) {
                console.error('Failed to copy resource pack', err);
                success = false;
            }
        }

        return success;
    });
}
