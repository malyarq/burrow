import type { Account } from '../types';

export interface AccountAPI {
    getAccounts(): Promise<Account[]>;
    getSelectedAccount(): Promise<Account | null>;
    addOfflineAccount(nickname: string): Promise<Account>;
    addThirdPartyAccount(authServerUrl: string, username: string, password?: string): Promise<Account>;
    removeAccount(accountId: string): Promise<void>;
    selectAccount(accountId: string): Promise<void>;
}
