import { api } from "@/lib/api.client";
import { Brand, Component, ComponentCategory, ComponentList, ComponentType, LicenseList, Model, ModelList, Type } from "@/types/catalog.type";
import { DataResponse, DataResponse2, PaginatedResponse } from "@/types/paginate.type";
import { CATALOG_PATHS } from "@/services/asset/asset.enpoints";

export const catalogService = {
    search: (search: string) =>
        api.get<any>(CATALOG_PATHS.MODELS, {search}),

    getBrands: () => api.get<Brand[]>(CATALOG_PATHS.BRANDS),

    getTypes: () => api.get<Type[]>(`${CATALOG_PATHS.CAT_BASE}/types`),

    getCategories: () => api.get<ComponentCategory[]>(`${CATALOG_PATHS.CAT_BASE}/component/categories`),

    getComponentTypes: () => api.get<ComponentType[]>(`${CATALOG_PATHS.CAT_BASE}/component/types`),

    getModels: (params?:{
        search: string,
        page: number,
    }) => api.get<PaginatedResponse<ModelList>>(CATALOG_PATHS.MODELS, params),

    getModel: (id: number) => api.get<DataResponse2<ModelList>>(`${CATALOG_PATHS.MODELS}/${id}`),

    assignComponent: (modelId: number, data: any) => api.post(`${CATALOG_PATHS.MODELS}/assign/${modelId}`, data),

    createModel: (data: any) =>
        api.post(CATALOG_PATHS.MODELS, data),

    createBrand: (data:any) =>
        api.post(CATALOG_PATHS.BRANDS, data),

    getLicenses: () =>
        api.get<LicenseList[]>(CATALOG_PATHS.LICENSE),

    getMemories: () =>
        api.get<DataResponse<Component>>(CATALOG_PATHS.MEMORY),

    getDisks: () =>
        api.get<DataResponse<Component>>(CATALOG_PATHS.DISK),

    getProcessors: () =>
        api.get<DataResponse<Component>>(CATALOG_PATHS.PROCESSOR),

    getAllComponents: () =>
        api.get<ComponentList[]>(`${CATALOG_PATHS.CAT_BASE}/component`),

    createComponent: (data: any) =>
        api.post(`${CATALOG_PATHS.CAT_BASE}/component`, data),
    
    // createLicenses: (data: any) =>
    //     api.post(CATALOG_PATHS.LICENSE, data)
};