'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CalendarClock, Loader2 } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { UpcomingMaintenance as Upcoming } from '@/types/dashboard.types';

interface TopUpcomingMaint {
    assetId: number,
    internalId: string;
    model: string;
    nextMaintenance: Date;
    daysUntilMaintenance: number;
}

interface UpcomingMaintenanceProps {
        companyId: string,
}

export default function UpcomingMaintenance({companyId}: UpcomingMaintenanceProps) {
  const [loadingMaintenances, setLoadingMaintenances] = useState(true);
  const [maintenanceDays, setManintenanceDays] = useState(30);
  const [maintenances, setManintenances] = useState<Upcoming[]>([]);

  const router = useRouter();
  
  const handleAssetClick = (assetId: string) => {
    router.push(`/assets?openAssetId=${assetId}`);
  };

  const loadUpcomingMaintenances = async () => {
    try {
        setLoadingMaintenances(true);
        const mnts = await dashboardService.getMaintenances({
            companyId: companyId !== 'all' ? Number(companyId) : undefined,
            maintenanceDays: maintenanceDays
        });
        setManintenances(mnts.data);
    } catch (error) {
        console.error(error);
    }finally{
        setLoadingMaintenances(false);
    }
  }

  useEffect(() => {
      loadUpcomingMaintenances();
  }, [companyId, maintenanceDays]);
  
  const getStatusBadge = (days: number) => {
    if (days <= 7) return <Badge variant="destructive">Urgente</Badge>;
    if (days <= 30) return <Badge variant="secondary" className="bg-yellow-500 text-black">Próximo</Badge>;
    return <Badge variant="default">Programado</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <CalendarClock className="h-8 w-8 text-muted-foreground"/>
            <CardTitle className="font-headline">Próximos Mantenimientos</CardTitle>
        </div>
            <CardDescription>Equipos que requieren mantenimiento preventivo en los próximos {maintenanceDays} días.</CardDescription>
        <div className="pt-2">
            <Select
                value={String(maintenanceDays)}
                onValueChange={(value) => setManintenanceDays(Number(value))}
            >
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="15">Próximos 15 días</SelectItem>
                <SelectItem value="30">Próximos 30 días</SelectItem>
                <SelectItem value="60">Próximos 60 días</SelectItem>
                <SelectItem value="90">Próximos 90 días</SelectItem>
                <SelectItem value="180">Próximos 180 días</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <TooltipProvider>
            {loadingMaintenances ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-16 w-16 animate-spin" />
                    <p className="text-sm text-muted-foreground text-center">Buscando...</p>
                </div>
            ) : maintenances.length > 0 ? (
                maintenances.map((asset) => (
                <Button variant="ghost" className="h-auto justify-start p-2" key={asset.assetId} onClick={() => handleAssetClick(String(asset.assetId))}>
                    <div className="flex items-center gap-4 w-full">
                        <div className="grid gap-1 flex-1 text-left">
                            <p className="text-sm font-medium leading-none truncate">
                                {asset.internalId} ({asset.model})
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Restante: {asset.daysUntilMaintenance} dias
                            </p>
                        </div>
                        <div className="ml-auto">
                            {getStatusBadge(asset.daysUntilMaintenance)}
                        </div>
                    </div>
                </Button>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center">No hay mantenimientos próximos.</p>
            )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
