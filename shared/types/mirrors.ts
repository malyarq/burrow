export type MirrorType = 'official' | 'bmcl' | 'custom';

export interface Mirror {
    id: string;
    name: string;
    type: MirrorType;
    rootUrl: string; // The base URL for the mirror (e.g. https://bmclapi2.bangbang93.com)
    isActive: boolean;
}

export interface MirrorState {
    mirrors: Mirror[];
    selectedMirrorId: string;
    autoSelect: boolean;
}
