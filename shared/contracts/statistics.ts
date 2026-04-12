import type { StatisticsState } from '../types/statistics';
export type { StatisticsState };

export interface StatisticsAPI {
    getStats: () => Promise<StatisticsState>;
}
