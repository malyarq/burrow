import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import { ModpackService } from '../instanceService';
import { ModpackService as AdvancedModpackService } from '../../modpacks/modpackService';
import type { ModLoaderType } from '../types';

export class InstanceImporterService {
    constructor(
        private modpackService: ModpackService,
        private advancedModpackService: AdvancedModpackService
    ) { }

    /**
     * Import instance from file
     * @returns The ID of the imported instance
     */
    public async importInstance(
        rootPath: string,
        filePath: string,
        targetName?: string
    ): Promise<string> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const ext = path.extname(filePath).toLowerCase();

        // Check if it's a MultiMC/Prism zip
        const zip = new AdmZip(filePath);
        const mmcPack = zip.getEntry('mmc-pack.json');
        // Also check if found deeper
        const mmcPackDeep = zip.getEntries().find(e => e.entryName.endsWith('mmc-pack.json') && !e.entryName.includes('__MACOSX'));

        if (mmcPack || mmcPackDeep) {
            return this.importMultiMC(rootPath, zip, targetName || path.basename(filePath, ext));
        }

        // Check if it's a CurseForge/Modrinth modpack
        const format = this.advancedModpackService.getModpackInfoFromFile(filePath).format;
        if (format) {
            const result = await this.advancedModpackService.importModpack(rootPath, filePath, undefined);
            return result.id;
        }

        throw new Error('Unsupported format');
    }

    private async importMultiMC(
        rootPath: string,
        zip: AdmZip,
        name: string
    ): Promise<string> {
        // Determine zip root (where mmc-pack.json is)
        let mmcPackEntry = zip.getEntry('mmc-pack.json');
        let zipRoot = '';

        if (!mmcPackEntry) {
            const found = zip.getEntries().find(e => e.entryName.endsWith('mmc-pack.json') && !e.entryName.includes('__MACOSX'));
            if (found) {
                mmcPackEntry = found;
                zipRoot = path.dirname(found.entryName);
                if (zipRoot === '.') zipRoot = '';
            } else {
                throw new Error('Invalid MultiMC pack: missing mmc-pack.json');
            }
        }

        // 1. Create new instance
        const { id, config } = this.modpackService.createModpack(rootPath, name, {
            runtime: { minecraft: '1.20.1', modLoader: undefined } // Temporary
        });

        const instanceDir = this.modpackService.getModpackDir(rootPath, id);

        // 2. Parse mmc-pack.json
        const mmcPack = JSON.parse(mmcPackEntry.getData().toString('utf8'));

        const components = mmcPack.components || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mcComponent = components.find((c: any) => c.uid === 'net.minecraft');

        if (mcComponent) {
            config.runtime.minecraft = mcComponent.version;
        }

        // Find modloader
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const forge = components.find((c: any) => c.uid === 'net.minecraftforge');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fabric = components.find((c: any) => c.uid === 'net.fabricmc.fabric-loader');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const quilt = components.find((c: any) => c.uid === 'org.quiltmc.quilt-loader');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const neoforge = components.find((c: any) => c.uid === 'net.neoforged.neoforge');

        if (forge) config.runtime.modLoader = { type: 'forge' as ModLoaderType, version: forge.version };
        if (fabric) config.runtime.modLoader = { type: 'fabric' as ModLoaderType, version: fabric.version };
        if (quilt) config.runtime.modLoader = { type: 'quilt' as ModLoaderType, version: quilt.version };
        if (neoforge) config.runtime.modLoader = { type: 'neoforge' as ModLoaderType, version: neoforge.version };

        this.modpackService.saveModpackConfig(rootPath, config);

        // 3. Extract files
        const entries = zip.getEntries();

        let minecraftDirPrefix = '.minecraft/';
        if (zipRoot) {
            minecraftDirPrefix = `${zipRoot}/.minecraft/`;
        }

        for (const entry of entries) {
            if (entry.isDirectory) continue;

            if (entry.entryName.startsWith(minecraftDirPrefix)) {
                const relPath = entry.entryName.substring(minecraftDirPrefix.length);
                const targetPath = path.join(instanceDir, relPath);

                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.writeFileSync(targetPath, entry.getData());
            }
        }

        return id;
    }
}
