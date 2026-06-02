const BASE = "/users";
const LOCSBASE = `${BASE}/locations`;

export const USER_PATHS = {
    BASE,
    TECHS: `${BASE}/techs`,
    SEARCH: `${BASE}/search`,
    RUD: (id: number) => `${BASE}/${id}`, 
}