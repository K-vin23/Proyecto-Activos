import { api } from "@/lib/api.client";
import { CompanyList, CreateCompany } from "@/types/company.types";
import { COMPANY_PATHS } from "@/services/company/company.enpoints";
import { PaginatedResponse } from "@/types/paginate.type";

export const companiesService = {
    list: (params?: {
        search?: string,
        status?: string,
        city?: string,
    }) => api.get<PaginatedResponse<CompanyList>>(COMPANY_PATHS.BASE, params),
 
    create: (data: CreateCompany) =>
        api.post(COMPANY_PATHS.BASE, data),

    update: (companyId: number, data: Partial<CompanyList>) =>
        api.patch<CompanyList>(COMPANY_PATHS.UD(companyId), data),
    
    delete: (companyId: number) =>
        api.delete(COMPANY_PATHS.UD(companyId)),

    restore: (companyId: number, data: {restoreAll: boolean}) =>
        api.post(`${COMPANY_PATHS.BASE}/restore/${companyId}`, data),
};