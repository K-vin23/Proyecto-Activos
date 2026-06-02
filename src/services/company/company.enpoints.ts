const BASE = "/companies";
const LOCSBASE = `${BASE}/locations`;

export const COMPANY_PATHS = {
    BASE,
    UD: (id: number) => `${BASE}/${id}`, 
    LOCS_CRUD: (id: number) => `${LOCSBASE}/${id}`,
}