import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import type { StatisticsState } from '@shared/types/statistics';

export class StatisticsService {
    private statsFile: string;
    private state: StatisticsState;

    constructor() {
        const userDataPath = app.getPath('userData');
        this.statsFile = path.join(userDataPath, 'statistics.json');
        this.state = this.loadStats();
    }

    private loadStats(): StatisticsState {
        try {
            if (fs.existsSync(this.statsFile)) {
                const data = fs.readFileSync(this.statsFile, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
        return {
            global: {
                totalPlayTime: 0,
                totalLaunches: 0,
            },
            instances: {},
        };
    }

    private saveStats() {
        try {
            fs.writeFileSync(this.statsFile, JSON.stringify(this.state, null, 2));
        } catch (error) {
            console.error('Failed to save statistics:', error);
        }
    }

    public getStats(): StatisticsState {
        return this.state;
    }

    public recordLaunch(instanceId?: string, name?: string) {
        this.state.global.totalLaunches++;
        this.state.global.lastPlayed = Date.now();

        if (instanceId) {
            if (!this.state.instances[instanceId]) {
                this.state.instances[instanceId] = {
                    playTime: 0,
                    launches: 0,
                    lastPlayed: 0,
                    name: name,
                };
            }
            this.state.instances[instanceId].launches++;
            this.state.instances[instanceId].lastPlayed = Date.now();
            if (name) {
                this.state.instances[instanceId].name = name;
            }
        }

        this.saveStats();
    }

    public recordPlayTime(durationMs: number, instanceId?: string) {
        if (durationMs <= 0) return;

        this.state.global.totalPlayTime += durationMs;

        if (instanceId && this.state.instances[instanceId]) {
            this.state.instances[instanceId].playTime += durationMs;
        }

        this.saveStats();
    }
}
