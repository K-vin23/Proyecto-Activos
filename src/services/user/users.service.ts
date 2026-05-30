import { api } from "@/lib/api.client";
import { AuthUser, AuthResponse, logUser } from "@/types/auth.types";
import { DetailedUser, ListUser, SimpleUser } from "@/types/user.types";
import { DataResponse, DataResponse2, PaginatedResponse } from "@/types/paginate.type";
import { USER_PATHS } from "@/services/user/user.enpoints";


export const usersService = {
    login: (data: logUser) => api.post<AuthResponse>('/login', data),

    // getMe: () => api.get<AuthUser>('/users/me'),

    list: (params?: {
        companyId?: number;
        areaId?: number;
        rolId?: string,
        locationId?: number;
        search?: string;
        status?: string;
        page?: number;
    }) => api.get<PaginatedResponse<ListUser>>(USER_PATHS.BASE, params),

    listTechnicians: () => api.get<DataResponse<SimpleUser>>(USER_PATHS.TECHS),

    search: (query: string) => api.get<DataResponse<SimpleUser>>(USER_PATHS.SEARCH, { search: query}),

    get: (id: number) => api.get<DataResponse2<DetailedUser>>(USER_PATHS.RUD(id)),

    create: (data: any) => api.post<any>(USER_PATHS.BASE, data),

    // getById: (userId: string) => api.get<AuthUser>(`/users/${userId}`),

    delete: (userId: number) => api.delete(USER_PATHS.RUD(userId))
};