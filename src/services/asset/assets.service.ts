import { api } from "@/lib/api.client";
import { AssetList, DetailedAsset, RemovedList } from "@/types/asset.type";
import { DataResponse2, PaginatedResponse } from "@/types/paginate.type";
import { ASSET_PATHS } from "@/services/asset/asset.enpoints";

export const assetService = {
    list: (params?: {
        companyId?: number;
        areaId?: number;
        search?: string;
        status?: string;
        typeId?: string;
        page?: number;
    }) => api.get<PaginatedResponse<AssetList>>(ASSET_PATHS.BASE, params),

    listRemoved: (params?: {
        search?: string;
        page?: number;
    }) => api.get<PaginatedResponse<RemovedList>>(ASSET_PATHS.BASE_REMOVED, params),

    get: (id: number) => api.get<DataResponse2<DetailedAsset>>(ASSET_PATHS.RUD(id)),
    
    create: (data: any) =>
        api.post<any>(ASSET_PATHS.BASE, data),

    update: (id: number, data: any) =>
        api.patch<any>(ASSET_PATHS.RUD(id), data),

    setResponsable: (id: number, responsable: number) =>
        api.post<any>(ASSET_PATHS.ASSIGN(id), {responsable}),

    delete: (id: number, removalReason: string) =>
        api.delete(ASSET_PATHS.RUD(id), { removalReason }),

    restore: (id: number) =>
        api.post<any>(`${ASSET_PATHS.BASE_REMOVED}/restore/${id}`),
};