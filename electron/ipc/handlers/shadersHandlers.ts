import { ipcMain, shell, dialog } from 'electron';
import { shadersService } from '../../services/shaders/shaderService';
import * as path from 'path';
import * as fs from 'fs';

export function registerShadersHandlers() {
    ipcMain.removeHandler('shaders:list');
    ipcMain.handle('shaders:list', async (_evt, instancePath: string) => {
        return await shadersService.list(instancePath);
    });

    ipcMain.removeHandler('shaders:setActive');
    ipcMain.handle('shaders:setActive', async (_evt, shaderName: string, instancePath: string) => {
        return await shadersService.setActiveShader(shaderName, instancePath);
    });

    ipcMain.removeHandler('shaders:disable');
    ipcMain.handle('shaders:disable', async (_evt, instancePath: string) => {
        return await shadersService.disable(instancePath);
    });

    ipcMain.removeHandler('shaders:delete');
    ipcMain.handle('shaders:delete', async (_evt, fileName: string, instancePath: string) => {
        return await shadersService.delete(fileName, instancePath);
    });

    ipcMain.removeHandler('shaders:openFolder');
    ipcMain.handle('shaders:openFolder', async (_evt, instancePath: string) => {

        const folder = path.join(instancePath || '', 'shaderpacks');


        if (!fs.existsSync(folder)) {
            try { fs.mkdirSync(folder, { recursive: true }); } catch (e) {
                console.error('Failed to create shaderpacks folder', e);
            }
        }

        await shell.openPath(folder);
    });

    ipcMain.removeHandler('shaders:add');
    ipcMain.handle('shaders:add', async (_evt, instancePath: string) => {

        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Shader Packs', extensions: ['zip'] }]
        });

        if (canceled || filePaths.length === 0) return false;

        const folder = path.join(instancePath || '', 'shaderpacks');
        if (!fs.existsSync(folder)) {
            try { fs.mkdirSync(folder, { recursive: true }); } catch (e) {
                console.error('Failed to create shaderpacks folder', e);
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
                console.error('Failed to copy shader pack', err);
                success = false;
            }
        }

        return success;
    });
}
