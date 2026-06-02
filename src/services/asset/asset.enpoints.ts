const BASE = "/assets";
const CAT_BASE = `${BASE}/catalog`;

export const ASSET_PATHS = {
    BASE,
    BASE_REMOVED: `${BASE}/removed`,
    RUD: (id: number) => `${BASE}/${id}`, 
    ASSIGN: (id: number) => `${BASE}/assign/${id}`
}

export const CATALOG_PATHS = {
    CAT_BASE,
    BRANDS: `${CAT_BASE}/brands`,
    MODELS:  `${CAT_BASE}/models`,
    LICENSE: `${CAT_BASE}/licenses`,
    MEMORY:  `${CAT_BASE}/memories`,
    DISK:  `${CAT_BASE}/disks`,
    PROCESSOR: `${CAT_BASE}/processors`
}