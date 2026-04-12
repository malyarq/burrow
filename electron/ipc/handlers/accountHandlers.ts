import { ipcMain } from 'electron';
import { AccountService } from '../../services/account/accountService';

export function registerAccountHandlers(deps: { accountService: AccountService }) {
    const { accountService } = deps;

    ipcMain.handle('account:getAccounts', () => {
        return accountService.getAccounts();
    });

    ipcMain.handle('account:getSelectedAccount', () => {
        return accountService.getSelectedAccount();
    });

    ipcMain.handle('account:selectAccount', (_event, accountId: string) => {
        accountService.selectAccount(accountId);
    });

    ipcMain.handle('account:addOffline', async (_event, nickname: string) => {
        return await accountService.addOfflineAccount(nickname);
    });

    ipcMain.handle('account:addThirdParty', async (_event, authServerUrl: string, username: string, password?: string) => {
        return await accountService.addThirdPartyAccount(authServerUrl, username, password);
    });

    ipcMain.handle('account:removeAccount', (_event, accountId: string) => {
        accountService.removeAccount(accountId);
    });
}
