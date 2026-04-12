import type { WorldsAPI } from '../../../shared/contracts/worlds';

// Use the preload bridge instead of importing ipcRenderer directly (context isolation)
const ipc = () => window.api.ipcRenderer;

export const worldsIPC: WorldsAPI = {
    list: (instancePath) => ipc().invoke('worlds:list', instancePath),
    delete: (folderName, instancePath) => ipc().invoke('worlds:delete', folderName, instancePath),
    backup: (folderName, instancePath) => ipc().invoke('worlds:backup', folderName, instancePath),
    duplicate: (folderName, instancePath) => ipc().invoke('worlds:duplicate', folderName, instancePath),
    getWorldPath: (folderName, instancePath) => {
        // This is a sync function on the backend, but we'll handle it via invoke
        ipc().invoke('worlds:openFolder', folderName, instancePath);
        return ''; // The backend opens the folder directly
    },
};

// Add a dedicated openFolder function
export const openWorldFolder = (folderName: string, instancePath: string) => {
    return ipc().invoke('worlds:openFolder', folderName, instancePath);
};
