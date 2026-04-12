import { Mirror, MirrorState } from '@shared/types';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

import { net as electronNet } from 'electron';

const DEFAULT_MIRRORS: Mirror[] = [
    {
        id: 'official',
        name: 'Official (Mojang)',
        type: 'official',
        rootUrl: 'https://launchermeta.mojang.com',
        isActive: true,
    },
    {
        id: 'bmcl',
        name: 'BMCLAPI',
        type: 'bmcl',
        rootUrl: 'https://bmclapi2.bangbang93.com',
        isActive: false,
    },
];

export class MirrorsService {
    private state: MirrorState = {
        mirrors: [...DEFAULT_MIRRORS],
        selectedMirrorId: 'official',
        autoSelect: false,
    };
    private accountsFile: string;

    constructor() {
        const userDataPath = app.getPath('userData');
        this.accountsFile = path.join(userDataPath, 'mirrors.json');
        this.loadMirrors();
    }

    private loadMirrors() {
        try {
            if (fs.existsSync(this.accountsFile)) {
                const data = fs.readFileSync(this.accountsFile, 'utf-8');
                const savedState = JSON.parse(data) as Partial<MirrorState>;

                // Merge saved mirrors with defaults, ensuring defaults always exist
                const customMirrors = (savedState.mirrors || []).filter(m => m.type === 'custom');

                this.state = {
                    mirrors: [...DEFAULT_MIRRORS, ...customMirrors],
                    selectedMirrorId: savedState.selectedMirrorId || 'official',
                    autoSelect: savedState.autoSelect || false,
                };

                // Update isActive flags based on selected ID
                this.updateActiveFlags();
            }
        } catch (error) {
            console.error('Failed to load mirrors:', error);
        }
    }

    private saveMirrors() {
        try {
            // Don't save default mirrors in the JSON to keep it clean, or save everything?
            // Saving everything is safer for state consistency.
            fs.writeFileSync(this.accountsFile, JSON.stringify(this.state, null, 2));
        } catch (error) {
            console.error('Failed to save mirrors:', error);
        }
    }

    private updateActiveFlags() {
        this.state.mirrors.forEach(m => {
            m.isActive = m.id === this.state.selectedMirrorId;
        });
    }

    public getMirrors(): Mirror[] {
        return this.state.mirrors;
    }

    public getSelectedMirror(): Mirror | undefined {
        return this.state.mirrors.find(m => m.id === this.state.selectedMirrorId);
    }

    public async addCustomMirror(name: string, rootUrl: string): Promise<Mirror> {
        const mirror: Mirror = {
            id: randomUUID(),
            name,
            type: 'custom',
            rootUrl,
            isActive: false,
        };

        this.state.mirrors.push(mirror);
        this.saveMirrors();
        return mirror;
    }

    public async removeMirror(id: string): Promise<void> {
        const mirror = this.state.mirrors.find(m => m.id === id);
        if (!mirror) return;

        if (mirror.type !== 'custom') {
            throw new Error('Cannot remove default mirrors');
        }

        this.state.mirrors = this.state.mirrors.filter(m => m.id !== id);

        if (this.state.selectedMirrorId === id) {
            this.state.selectedMirrorId = 'official';
            this.updateActiveFlags();
        }

        this.saveMirrors();
    }

    public async selectMirror(id: string): Promise<void> {
        const mirror = this.state.mirrors.find(m => m.id === id);
        if (!mirror) throw new Error('Mirror not found');

        this.state.selectedMirrorId = id;
        this.updateActiveFlags();
        this.saveMirrors();
    }

    public async testSpeed(url: string): Promise<number> {
        const start = Date.now();
        try {
            await electronNet.fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
            return Date.now() - start;
        } catch (e) {
            console.error('Mirror speed test failed:', e);
            return -1;
        }
    }

    public async setAutoSelect(enabled: boolean): Promise<void> {
        this.state.autoSelect = enabled;
        this.saveMirrors();
        if (enabled) {
            await this.autoSelectBestMirror();
        }
    }

    public async isAutoSelectEnabled(): Promise<boolean> {
        return this.state.autoSelect;
    }

    public async autoSelectBestMirror(): Promise<void> {
        console.log('Starting auto-selection of best mirror...');
        const results = await Promise.all(this.state.mirrors.map(async (mirror) => {
            const latency = await this.testSpeed(mirror.rootUrl);
            return { id: mirror.id, latency };
        }));

        const validResults = results.filter(r => r.latency !== -1);

        if (validResults.length === 0) {
            console.warn('No reachable mirrors found during auto-selection.');
            return;
        }

        validResults.sort((a, b) => a.latency - b.latency);
        const bestMirrorId = validResults[0].id;

        console.log(`Auto-selected mirror: ${bestMirrorId} with latency ${validResults[0].latency}ms`);
        await this.selectMirror(bestMirrorId);
    }
}
