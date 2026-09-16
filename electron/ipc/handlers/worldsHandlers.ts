import { ipcMain, shell } from 'electron';
import { worldsService } from '../../services/worlds/worldService';
import { assertChildName } from '../../security/pathGuards';
import {
    getDefaultRootPath,
    getModpackDir,
    resolveApprovedInstancePath,
    resolveWorldPath,
} from '../../services/instances/paths';
import { validateIdentifier } from '../validation/privilegedPayloads';
import { runContentMutation, type ContentMutationGate } from './contentMutation';

function resolveInstancePath(instanceId: unknown): string {
    const safeInstanceId = assertChildName(
        validateIdentifier(instanceId, 'Instance ID'),
        'Instance ID',
    );
    return resolveApprovedInstancePath(getModpackDir(getDefaultRootPath(), safeInstanceId));
}

export function registerWorldsHandlers(deps: { runContentMutation?: ContentMutationGate } = {}) {
    ipcMain.removeHandler('worlds:listByInstanceId');
    ipcMain.handle('worlds:listByInstanceId', async (_evt, instanceId: unknown) => {
        return await worldsService.list(resolveInstancePath(instanceId));
    });

    ipcMain.removeHandler('worlds:deleteByInstanceId');
    ipcMain.handle('worlds:deleteByInstanceId', async (_evt, folderName: unknown, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        const safeFolderName = assertChildName(validateIdentifier(folderName, 'World name'), 'World name');
        await runContentMutation(deps.runContentMutation, safeInstanceId, async () => {
            await worldsService.delete(safeFolderName, resolveInstancePath(safeInstanceId));
        });
    });

    ipcMain.removeHandler('worlds:backupByInstanceId');
    ipcMain.handle('worlds:backupByInstanceId', async (_evt, folderName: unknown, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        const safeFolderName = assertChildName(validateIdentifier(folderName, 'World name'), 'World name');
        await runContentMutation(deps.runContentMutation, safeInstanceId, async () => {
            await worldsService.backup(safeFolderName, resolveInstancePath(safeInstanceId));
        });
    });

    ipcMain.removeHandler('worlds:duplicateByInstanceId');
    ipcMain.handle('worlds:duplicateByInstanceId', async (_evt, folderName: unknown, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        const safeFolderName = assertChildName(validateIdentifier(folderName, 'World name'), 'World name');
        return await runContentMutation(deps.runContentMutation, safeInstanceId, async () => (
            await worldsService.duplicate(safeFolderName, resolveInstancePath(safeInstanceId))
        ));
    });

    ipcMain.removeHandler('worlds:openFolderByInstanceId');
    ipcMain.handle('worlds:openFolderByInstanceId', async (_evt, folderName: unknown, instanceId: unknown) => {
        const worldPath = resolveWorldPath(
            resolveInstancePath(instanceId),
            assertChildName(validateIdentifier(folderName, 'World name'), 'World name'),
        );
        await shell.openPath(worldPath);
    });
}
