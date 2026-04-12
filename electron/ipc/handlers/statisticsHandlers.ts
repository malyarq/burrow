import { ipcMain } from 'electron';
import { StatisticsService } from '../../services/stats/statisticsService';

export function registerStatisticsHandlers({ statisticsService }: { statisticsService: StatisticsService }) {
    ipcMain.handle('stats:get', async () => {
        return statisticsService.getStats();
    });
}
