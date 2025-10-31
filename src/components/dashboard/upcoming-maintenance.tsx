
'use client';

import { useMemo } from 'react';
import { addMonths, differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { assets, assetHistory } from '@/lib/mock-data';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const MAINTENANCE_INTERVAL_MONTHS = 6;

export default function UpcomingMaintenance() {
  const upcomingMaintenanceList = useMemo(() => {
    const maintenanceTasks = assets
      .filter(asset => asset.category === 'Equipo de cómputo' || asset.category === 'UPS')
      .map(asset => {
        const history = (assetHistory as Record<string, any[]>)[asset.id] || [];
        const lastMaintenance = history
          .filter(entry => entry.type === 'Mantenimiento')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        // If no maintenance history, use purchase date as baseline
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
      // Only show items due in the next 6 months or that are overdue
      .filter(asset => asset.daysUntilMaintenance <= (30 * MAINTENANCE_INTERVAL_MONTHS))
      .sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance);
      
    return maintenanceTasks;
  }, []);

  const getStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="destructive">Vencido</Badge>;
    if (days <= 30) return <Badge variant="secondary" className="bg-yellow-500 text-black">Próximo</Badge>;
    return <Badge variant="default">Programado</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Próximos Mantenimientos</CardTitle>
        <CardDescription>Equipos que requieren mantenimiento preventivo.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TooltipProvider>
            {upcomingMaintenanceList.length > 0 ? (
                upcomingMaintenanceList.map((asset) => (
                <div className="flex items-center gap-4" key={asset.id}>
                    {asset.isOverdue && (
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mantenimiento Vencido</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                     {!asset.isOverdue && (
                        <div className="bg-primary rounded-full h-2 w-2 mt-1 shrink-0" />
                     )}
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none truncate">
                            {asset.name} ({asset.id})
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Próximo Mant: {format(asset.nextMaintenanceDate, 'dd LLL, yyyy', { locale: es })}
                        </p>
                    </div>
                    <div className="ml-auto">
                        {getStatusBadge(asset.daysUntilMaintenance)}
                    </div>
                </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center">No hay mantenimientos próximos.</p>
            )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
