import { api } from "@/lib/api.client";
import { Component, LicenseList } from "@/types/catalog.type";
import { DataResponse } from "@/types/paginate.type";
import { CATALOG_PATHS } from "@/services/asset/asset.enpoints";

export const catalogService = {
    search: (search: string) =>
        api.get<any>(CATALOG_PATHS.MODELS, {search}),
    getLicenses: () =>
        api.get<LicenseList[]>(CATALOG_PATHS.LICENSE),
    getMemories: () =>
        api.get<DataResponse<Component>>(CATALOG_PATHS.MEMORY),
    getDisks: () =>
        api.get<DataResponse<Component>>(CATALOG_PATHS.DISK),
};