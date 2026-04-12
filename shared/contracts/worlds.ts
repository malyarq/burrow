export interface WorldInfo {
    name: string;
    folderName: string;
    lastPlayed?: number;
    sizeBytes?: number;
}

export interface WorldsAPI {
    list: (instancePath: string) => Promise<WorldInfo[]>;
    delete: (folderName: string, instancePath: string) => Promise<void>;
    backup: (folderName: string, instancePath: string) => Promise<string>;
    duplicate: (folderName: string, instancePath: string) => Promise<string>;
    getWorldPath: (folderName: string, instancePath: string) => string;
}
