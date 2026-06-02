import { ASSET_PATHS } from "@/services/asset/asset.enpoints";

const BASE = `${ASSET_PATHS.BASE}/maintenances`;

export const MAINTENANCE_PATHS = {
    BASE: (id: number) => `${BASE}/${id}` 
}