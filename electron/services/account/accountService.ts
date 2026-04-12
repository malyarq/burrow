import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import type { Account, AccountState } from '@shared/types';
import { YggdrasilClient } from './yggdrasil';

export class AccountService {
    private accountsFile: string;
    private state: AccountState;

    constructor(userDataPath: string) {
        this.accountsFile = path.join(userDataPath, 'accounts.json');
        this.state = this.loadAccounts();
    }

    private loadAccounts(): AccountState {
        try {
            if (fs.existsSync(this.accountsFile)) {
                const data = fs.readFileSync(this.accountsFile, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load accounts:', error);
        }
        return { accounts: [], selectedAccountId: null };
    }

    private saveAccounts() {
        try {
            fs.writeFileSync(this.accountsFile, JSON.stringify(this.state, null, 2));
        } catch (error) {
            console.error('Failed to save accounts:', error);
        }
    }

    public getAccounts(): Account[] {
        return this.state.accounts;
    }

    public getSelectedAccount(): Account | null {
        if (!this.state.selectedAccountId) return null;
        return this.state.accounts.find(a => a.id === this.state.selectedAccountId) || null;
    }

    public getSelectedAccountId(): string | null {
        return this.state.selectedAccountId;
    }

    public async addOfflineAccount(nickname: string): Promise<Account> {
        const account: Account = {
            id: randomUUID(),
            type: 'offline',
            name: nickname,
        };
        this.state.accounts.push(account);
        if (!this.state.selectedAccountId) {
            this.state.selectedAccountId = account.id;
        }
        this.saveAccounts();
        return account;
    }

    public async addThirdPartyAccount(authServerUrl: string, username: string, password?: string): Promise<Account> {
        const client = new YggdrasilClient(authServerUrl);
        const result = await client.authenticate(username, password);

        // Check if account already exists (by UUID or name+authServer)
        const existingIndex = this.state.accounts.findIndex(
            (a) => a.type === 'third-party' &&
                a.authServerUrl === authServerUrl &&
                (a.id === result.selectedProfile.id || a.name === result.selectedProfile.name)
        );

        const account: Account = {
            id: result.selectedProfile.id, // Use UUID from server
            type: 'third-party',
            name: result.selectedProfile.name,
            authServerUrl,
            accessToken: result.accessToken,
            clientToken: result.clientToken,
            user: result.user,
        };

        if (existingIndex !== -1) {
            this.state.accounts[existingIndex] = account;
        } else {
            this.state.accounts.push(account);
        }

        this.state.selectedAccountId = account.id;
        this.saveAccounts();
        return account;
    }

    public selectAccount(accountId: string): void {
        if (this.state.accounts.some(a => a.id === accountId)) {
            this.state.selectedAccountId = accountId;
            this.saveAccounts();
        }
    }

    public removeAccount(accountId: string): void {
        this.state.accounts = this.state.accounts.filter(a => a.id !== accountId);
        if (this.state.selectedAccountId === accountId) {
            this.state.selectedAccountId = this.state.accounts.length > 0 ? this.state.accounts[0].id : null;
        }
        this.saveAccounts();
    }

    // Refresh token for selected account if needed
    public async ensureActiveAccountValid(): Promise<Account | null> {
        const account = this.getSelectedAccount();
        if (!account) return null;

        if (account.type === 'offline') return account;

        if (account.type === 'third-party' && account.authServerUrl && account.accessToken && account.clientToken) {
            const client = new YggdrasilClient(account.authServerUrl);
            try {
                const isValid = await client.validate(account.accessToken, account.clientToken);
                if (!isValid) {
                    console.log('[AccountService] Token invalid, refreshing...');
                    const result = await client.refresh(account.accessToken, account.clientToken);
                    // Update account with new token
                    const updatedAccount: Account = {
                        ...account,
                        accessToken: result.accessToken,
                        clientToken: result.clientToken,
                        user: result.user || account.user
                    };

                    // Update in state
                    const index = this.state.accounts.findIndex(a => a.id === account.id);
                    if (index !== -1) {
                        this.state.accounts[index] = updatedAccount;
                        this.saveAccounts();
                    }
                    return updatedAccount;
                }
            } catch (e) {
                console.error('[AccountService] Failed to refresh token:', e);
                // Could throw error or return null to indicate login required
                // For now, return account but it might fail later in launcher
            }
        }
        return account;
    }
}
