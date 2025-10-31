
'use client';

import { useMemo } from 'react';
import { addMonths, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import AssetsChart from '@/components/dashboard/assets-chart';
import UpcomingMaintenance from '@/components/dashboard/upcoming-maintenance';
import { assets, assetHistory } from '@/lib/mock-data';

const MAINTENANCE_INTERVAL_MONTHS = 6;

export default function Home() {
  const upcomingMaintenanceList = useMemo(() => {
    const maintenanceTasks = assets
      .filter(asset => asset.category === 'Equipo de cómputo' || asset.category === 'UPS')
      .map(asset => {
        const history = (assetHistory as Record<string, any[]>)[asset.id] || [];
        const lastMaintenance = history
          .filter(entry => entry.type === 'Mantenimiento')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const lastMaintenanceDate = lastMaintenance ? new Date(lastMaintenance.date) : new Date(asset.purchaseDate);
        const nextMaintenanceDate = addMonths(lastMaintenanceDate, MAINTENANCE_INTERVAL_MONTHS);
        const daysUntilMaintenance = differenceInDays(nextMaintenanceDate, new Date());

        return {
          ...asset,
          nextMaintenanceDate,
          daysUntilMaintenance,
          isOverdue: daysUntilMaintenance < 0,
        };
      })
      .filter(asset => asset.daysUntilMaintenance <= (30 * MAINTENANCE_INTERVAL_MONTHS))
      .sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance);
      
    return maintenanceTasks;
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Inicio</h1>
            <SummaryCards openTasks={upcomingMaintenanceList.length} />
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <AssetsChart />
              </div>
              <div className="flex flex-col gap-4 md:gap-8">
                 <UpcomingMaintenance maintenanceList={upcomingMaintenanceList} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
