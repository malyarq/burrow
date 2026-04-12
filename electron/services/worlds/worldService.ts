import path from 'node:path';
import fs from 'node:fs/promises';
import AdmZip from 'adm-zip';

export interface WorldInfo {
    name: string;
    folderName: string;
    lastPlayed?: number;
    gameMode?: number;
    difficulty?: number;
    sizeBytes?: number;
}

export class WorldsService {
    /**
     * Get the saves directory path for an instance.
     */
    private getSavesDir(instancePath: string): string {
        return path.join(instancePath, 'saves');
    }

    /**
     * Parse level.dat to extract world metadata.
     * level.dat is NBT format, but we can extract basic info without full NBT parsing.
     */
    private async getWorldMetadata(worldPath: string): Promise<Partial<WorldInfo>> {
        const levelDatPath = path.join(worldPath, 'level.dat');
        try {
            await fs.access(levelDatPath);
            // level.dat exists - this is a valid world
            // For now, return basic info. Full NBT parsing would require additional library.
            const stat = await fs.stat(levelDatPath);
            return {
                lastPlayed: stat.mtimeMs,
            };
        } catch {
            return {};
        }
    }

    /**
     * Calculate total size of a directory recursively.
     */
    private async getDirectorySize(dirPath: string): Promise<number> {
        let totalSize = 0;
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    totalSize += await this.getDirectorySize(fullPath);
                } else {
                    const stat = await fs.stat(fullPath);
                    totalSize += stat.size;
                }
            }
        } catch {
            // Ignore errors
        }
        return totalSize;
    }

    /**
     * List all worlds in the instance's saves folder.
     */
    async list(instancePath: string): Promise<WorldInfo[]> {
        const savesDir = this.getSavesDir(instancePath);

        let entries: string[] = [];
        try {
            entries = await fs.readdir(savesDir);
        } catch {
            // Directory doesn't exist
            return [];
        }

        const worlds: WorldInfo[] = [];

        for (const entry of entries) {
            const worldPath = path.join(savesDir, entry);
            const stat = await fs.stat(worldPath);

            if (stat.isDirectory()) {
                // Check if it has level.dat (valid world)
                const levelDatPath = path.join(worldPath, 'level.dat');
                try {
                    await fs.access(levelDatPath);

                    const metadata = await this.getWorldMetadata(worldPath);
                    const sizeBytes = await this.getDirectorySize(worldPath);

                    worlds.push({
                        name: entry, // World folder name (often matches in-game name)
                        folderName: entry,
                        lastPlayed: metadata.lastPlayed,
                        sizeBytes,
                    });
                } catch {
                    // Not a valid world (no level.dat)
                }
            }
        }

        // Sort by last played (newest first)
        worlds.sort((a, b) => (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0));

        return worlds;
    }

    /**
     * Delete a world from the instance.
     */
    async delete(folderName: string, instancePath: string): Promise<void> {
        const savesDir = this.getSavesDir(instancePath);
        const worldPath = path.join(savesDir, folderName);

        await fs.rm(worldPath, { recursive: true, force: true });
    }

    /**
     * Backup a world to a zip file.
     * @returns The path to the created backup file.
     */
    async backup(folderName: string, instancePath: string): Promise<string> {
        const savesDir = this.getSavesDir(instancePath);
        const worldPath = path.join(savesDir, folderName);

        // Create backup in the same saves folder with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const backupName = `${folderName}_backup_${timestamp}.zip`;
        const backupPath = path.join(savesDir, backupName);

        const zip = new AdmZip();
        zip.addLocalFolder(worldPath, folderName);
        zip.writeZip(backupPath);

        return backupPath;
    }

    /**
     * Duplicate a world.
     */
    async duplicate(folderName: string, instancePath: string): Promise<string> {
        const savesDir = this.getSavesDir(instancePath);
        const worldPath = path.join(savesDir, folderName);

        // Find a unique name
        let copyIndex = 1;
        let newName = `${folderName}_copy`;
        while (true) {
            const testPath = path.join(savesDir, newName);
            try {
                await fs.access(testPath);
                copyIndex++;
                newName = `${folderName}_copy_${copyIndex}`;
            } catch {
                break; // Name is available
            }
        }

        const newPath = path.join(savesDir, newName);
        await fs.cp(worldPath, newPath, { recursive: true });

        return newName;
    }

    /**
     * Open the world folder in file explorer.
     */
    getWorldPath(folderName: string, instancePath: string): string {
        return path.join(this.getSavesDir(instancePath), folderName);
    }
}

// Singleton export
export const worldsService = new WorldsService();
