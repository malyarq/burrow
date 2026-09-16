import { dialog, ipcMain, shell } from 'electron';
import * as fs from 'fs';
import type { ShaderPackAcquisitionResult } from '../../../shared/contracts/shaders';
import { assertChildName } from '../../security/pathGuards';
import {
    getDefaultRootPath,
    getModpackDir,
    resolveApprovedInstancePath,
    resolveShaderPacksDir,
} from '../../services/instances/paths';
import { shadersService } from '../../services/shaders/shaderService';
import { validateIdentifier } from '../validation/privilegedPayloads';
import { runContentMutation, type ContentMutationGate } from './contentMutation';

function resolveInstancePath(instanceId: unknown): string {
    const safeInstanceId = assertChildName(
        validateIdentifier(instanceId, 'Instance ID'),
        'Instance ID',
    );
    return resolveApprovedInstancePath(getModpackDir(getDefaultRootPath(), safeInstanceId));
}

function validateShaderPackName(value: unknown): string {
    return assertChildName(
        validateIdentifier(value, 'Shader pack name'),
        'Shader pack name',
    );
}

function summarizeShaderPackAcquisition(
    results: ShaderPackAcquisitionResult[],
): ShaderPackAcquisitionResult {
    const importedFileNames = results.flatMap((result) => result.importedFileNames);
    const issues = results.flatMap((result) => result.issues);

    if (importedFileNames.length === 0 && issues.length === 0) {
        return { status: 'cancelled', importedFileNames, issues };
    }

    if (importedFileNames.length > 0 && issues.length === 0) {
        return { status: 'success', importedFileNames, issues };
    }

    if (importedFileNames.length > 0) {
        return { status: 'partial-success', importedFileNames, issues };
    }

    if (issues.every((issue) => issue.status === 'duplicate')) {
        return { status: 'duplicate', importedFileNames, issues };
    }

    if (issues.every((issue) => issue.status === 'invalid-archive')) {
        return { status: 'invalid-archive', importedFileNames, issues };
    }

    if (issues.every((issue) => issue.status === 'runtime-blocked')) {
        return { status: 'runtime-blocked', importedFileNames, issues };
    }

    return { status: 'failure', importedFileNames, issues };
}

export function registerShadersHandlers(deps: { runContentMutation?: ContentMutationGate } = {}) {
    ipcMain.removeHandler('shaders:list');
    ipcMain.handle('shaders:list', async (_evt, instanceId: unknown) => {
        const safeInstancePath = resolveInstancePath(instanceId);
        return await shadersService.list(safeInstancePath);
    });

    ipcMain.removeHandler('shaders:setActive');
    ipcMain.handle('shaders:setActive', async (_evt, shaderName: unknown, instanceId: unknown) => {
        const safeShaderName = validateShaderPackName(shaderName);
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        return await runContentMutation(deps.runContentMutation, safeInstanceId, async () => (
            await shadersService.setActiveShader(safeShaderName, resolveInstancePath(safeInstanceId))
        ));
    });

    ipcMain.removeHandler('shaders:disable');
    ipcMain.handle('shaders:disable', async (_evt, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        return await runContentMutation(deps.runContentMutation, safeInstanceId, async () => (
            await shadersService.disable(resolveInstancePath(safeInstanceId))
        ));
    });

    ipcMain.removeHandler('shaders:delete');
    ipcMain.handle('shaders:delete', async (_evt, fileName: unknown, instanceId: unknown) => {
        const safeFileName = validateShaderPackName(fileName);
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        return await runContentMutation(deps.runContentMutation, safeInstanceId, async () => (
            await shadersService.delete(safeFileName, resolveInstancePath(safeInstanceId))
        ));
    });

    ipcMain.removeHandler('shaders:openFolder');
    ipcMain.handle('shaders:openFolder', async (_evt, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');
        await runContentMutation(deps.runContentMutation, safeInstanceId, async () => {
            const folder = resolveShaderPacksDir(resolveInstancePath(safeInstanceId));
            if (!fs.existsSync(folder)) {
                try {
                    fs.mkdirSync(folder, { recursive: true });
                } catch (e) {
                    console.error('Failed to create shaderpacks folder', e);
                }
            }
            await shell.openPath(folder);
        });
    });

    ipcMain.removeHandler('shaders:add');
    ipcMain.handle('shaders:add', async (_evt, instanceId: unknown) => {
        const safeInstanceId = assertChildName(validateIdentifier(instanceId, 'Instance ID'), 'Instance ID');

        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Shader Packs', extensions: ['zip'] }],
        });

        if (canceled || filePaths.length === 0) {
            return summarizeShaderPackAcquisition([]);
        }

        return await runContentMutation(deps.runContentMutation, safeInstanceId, async () => {
        const safeInstancePath = resolveInstancePath(safeInstanceId);
        const folder = resolveShaderPacksDir(safeInstancePath);
        if (!fs.existsSync(folder)) {
            try {
                fs.mkdirSync(folder, { recursive: true });
            } catch (e) {
                console.error('Failed to create shaderpacks folder', e);
                return {
                    status: 'failure',
                    importedFileNames: [],
                    issues: [
                        {
                            fileName: 'shaderpacks',
                            status: 'failure',
                            message: 'Burrow could not prepare the shaderpacks folder for imports.',
                        },
                    ],
                };
            }
        }

        const results = await Promise.all(
            filePaths.map((filePath) => shadersService.import(filePath, safeInstancePath)),
        );
        return summarizeShaderPackAcquisition(results);
        });
    });
}
