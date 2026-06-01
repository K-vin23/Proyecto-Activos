import { api } from '@/lib/api.client';
import { UpcomingMaintenance, type DashboardResponse } from '@/types/dashboard.types';
import { DataResponse2, DataResponse } from '@/types/paginate.type';

export const dashboardService = {
  get: (params?:{
    companyId?: number;
    status?: string;
  }) =>api.get<DataResponse2<DashboardResponse>>('/dashboard', params),

  getMaintenances:(params?:{
    companyId?: number;
    maintenanceDays?: number;
  }) =>api.get<DataResponse<UpcomingMaintenance>>('/dashboard/upcomings', params),
};