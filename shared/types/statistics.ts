export interface GlobalStatistics {
    totalPlayTime: number; // in milliseconds
    totalLaunches: number;
    lastPlayed?: number; // timestamp
}

export interface InstanceStatistics {
    [instanceId: string]: {
        name?: string;
        playTime: number;
        launches: number;
        lastPlayed: number;
    };
}

export interface StatisticsState {
    global: GlobalStatistics;
    instances: InstanceStatistics;
}
