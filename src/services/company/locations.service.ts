import { Location } from "@/types/location.type";
import { api } from "@/lib/api.client";
import { DataResponse } from "@/types/paginate.type";
import { COMPANY_PATHS } from "@/services/company/company.enpoints";

export const locationService = {
   list: (companyId: number, cityId: string) => api.get<DataResponse<Location>>(COMPANY_PATHS.LOCS_CRUD(companyId), {city: cityId }),

   get: (companyId: number) => api.get<DataResponse<Location>>(COMPANY_PATHS.LOCS_CRUD(companyId)),
   
   create: (companyId: number, data: Partial<Location>) => 
    api.post<Location>(COMPANY_PATHS.LOCS_CRUD(companyId), data),
   
   update: (id: number, data: Partial<Location>) => 
    api.patch<Location>(COMPANY_PATHS.LOCS_CRUD(id), data),

   delete: (id: number) =>
    api.delete(COMPANY_PATHS.LOCS_CRUD(id)),
};