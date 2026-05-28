import { api } from "@/lib/api.client";
import { Company } from "@/types/company.types";
import { COMPANY_PATHS } from "@/services/company/company.enpoints";

export const companiesService = {
    list: () => api.get<Company[]>(COMPANY_PATHS.BASE),
 
    create: (data: Partial<Company>) =>
        api.post<Company>(COMPANY_PATHS.BASE, data),

    update: (companyId: number, data: Partial<Company>) =>
        api.patch<Company>(COMPANY_PATHS.UD(companyId), data),
    
    delete: (companyId: number) =>
        api.delete(COMPANY_PATHS.UD(companyId)),
};