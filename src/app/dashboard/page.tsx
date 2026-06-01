
'use client';

import type { DashboardResponse } from '@/types/dashboard.types';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import AssetsChart from '@/components/dashboard/assets-chart';
import UpcomingMaintenance from '@/components/dashboard/upcoming-maintenance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboardService } from '@/services/dashboard.service';
import { getAuthToken } from '@/lib/session';
import { useCompanies } from '@/hooks/useCompanies';
import { Loader2 } from 'lucide-react';


export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { companies, companiesLoading } = useCompanies();

  // Fetch dashboard from API
   const loadDashboard = async () => {
      setLoadingDashboard(true);
      try {
        const data = await dashboardService.get({
          companyId: selectedCompany !== "all" ? Number(selectedCompany) : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          // maintenanceDays: maintenanceDays
        });
        setDashboard(data.data);
      } catch (e) {
        console.error('error al cargar dashboard', e)
      } finally {
        setLoadingDashboard(false);
      }
    };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    loadDashboard();
  }, [selectedCompany, selectedStatus]);


  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {loadingDashboard ? (
            <div className="flex h-full min-h-[70vh] items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 animate-spin" />
                <p className="mt-4 text-xl text-muted-foreground">
                  Cargando dashboard...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <h1 className="text-2xl font-bold font-headline tracking-tight">Inicio</h1>
                <div className="ml-auto flex gap-3 w-full sm:w-auto">
                  <div className='w-full sm:w-64'>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las Empresas</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.companyId} value={String(company.companyId)}>
                            {company.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='w-full sm:w-64'>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Operativos</SelectItem> 
                        <SelectItem value='inactive'>En baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {dashboard && (
              <SummaryCards 
                totals={dashboard.totals}
              />
              )}
              <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  {dashboard && (
                  <AssetsChart data={dashboard.assetsByArea} />
                  )}
                </div>
                <div className="flex flex-col gap-4 md:gap-8">
                  {dashboard && (
                  <UpcomingMaintenance companyId={selectedCompany}/>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
