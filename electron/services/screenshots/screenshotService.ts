import { shell } from 'electron';
import path from 'path';
import fs from 'fs/promises';


export interface Screenshot {
    name: string;
    path: string;
    url: string; // file:// url for frontend
    createdAt: number;
    size: number;
}

export class ScreenshotService {
    constructor() { }

    private getScreenshotsDir(instancePath: string): string {
        return path.join(instancePath, 'screenshots');
    }

    async listScreenshots(instancePath: string): Promise<Screenshot[]> {
        const dir = this.getScreenshotsDir(instancePath);
        try {
            await fs.access(dir);
        } catch {
            return [];
        }

        const files = await fs.readdir(dir);
        const screenshots: Screenshot[] = [];

        for (const file of files) {
            if (!file.toLowerCase().endsWith('.png') && !file.toLowerCase().endsWith('.jpg')) continue;

            const filePath = path.join(dir, file);
            try {
                const stats = await fs.stat(filePath);
                screenshots.push({
                    name: file,
                    path: filePath,
                    url: `file://${filePath}`,
                    createdAt: stats.birthtimeMs,
                    size: stats.size,
                });
            } catch (e) {
                console.error(`Failed to stat screenshot ${file}:`, e);
            }
        }

        return screenshots.sort((a, b) => b.createdAt - a.createdAt);
    }

    async deleteScreenshot(instancePath: string, filename: string): Promise<void> {
        const dir = this.getScreenshotsDir(instancePath);
        const filePath = path.join(dir, filename);
        await fs.unlink(filePath);
    }

    async renameScreenshot(instancePath: string, oldName: string, newName: string): Promise<void> {
        const dir = this.getScreenshotsDir(instancePath);
        const oldPath = path.join(dir, oldName);
        const newPath = path.join(dir, newName);

        // Simple validation
        if (!newName.toLowerCase().endsWith('.png') && !newName.toLowerCase().endsWith('.jpg')) {
            if (oldName.endsWith('.png') && !newName.endsWith('.png')) newName += '.png';
            if (oldName.endsWith('.jpg') && !newName.endsWith('.jpg')) newName += '.jpg';
        }

        await fs.rename(oldPath, newPath);
    }

    async openScreenshotFolder(instancePath: string): Promise<void> {
        const dir = this.getScreenshotsDir(instancePath);
        await fs.mkdir(dir, { recursive: true });
        await shell.openPath(dir);
    }

}

export const screenshotService = new ScreenshotService();
