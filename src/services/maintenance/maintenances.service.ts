import { api } from "@/lib/api.client";
import { MaintenanceList } from "@/types/maintenance.type";
import { PaginatedResponse } from "@/types/paginate.type";
import { MAINTENANCE_PATHS } from "@/services/maintenance/maintenance.enpoints";

export const maintenanceService = {
    list: (id: number, params?: {page?: number}) => api.get<PaginatedResponse<MaintenanceList>>(MAINTENANCE_PATHS.BASE(id), params),

    create: (assetId: number, data: Partial<MaintenanceList>) =>
        api.post<Partial<MaintenanceList>>(MAINTENANCE_PATHS.BASE(assetId), data),
};