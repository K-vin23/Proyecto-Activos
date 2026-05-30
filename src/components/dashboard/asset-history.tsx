
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// import { assetHistory as allHistory } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";
import { MaintenanceList } from "@/types/maintenance.type";
import { useEffect, useState } from "react";
import { maintenanceService } from "@/services/maintenance/maintenances.service";
import { Button } from "../ui/button";


interface AssetHistoryProps {
    assetId: number;
    refreshKey?: number;
}

export default function AssetHistory({ assetId, refreshKey }: AssetHistoryProps) {
  const [maintenances, setMaintenances] = useState<MaintenanceList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const history = await maintenanceService.list(assetId, {page});
      setMaintenances(history.data);
      setLastPage(history.meta.last_page);
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  useEffect (() => {
    loadHistory();
  }, [page, assetId, refreshKey]);


  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'PREVENTIVO':
        return 'default';
      case 'CORRECTIVO':
        return 'destructive';
      default:
        return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Historial del Activo</CardTitle>
        <CardDescription>Registro cronológico de eventos y mantenimientos.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">
              Cargando historial...
            </span>
          </div>
        ): (
          <>
            <div className="space-y-6">
              {maintenances.length > 0 ? (
                maintenances.map((maintenance, index) => (
                  <div key={maintenance.maintenanceId}>
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{maintenance.name}</p>
                                <p className="text-xs text-muted-foreground">{String(maintenance.maintenanceDate)}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{maintenance.observations}</p>
                        </div>
                        <Badge variant={getBadgeVariant(maintenance.type)}>{maintenance.type}</Badge>
                    </div>
                    {index < maintenances.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No hay registros de historial para este activo.</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                Anterior
              </Button>

              <span className="text-sm">
                Página {page} de {lastPage}
              </span>

              <Button
                variant="outline"
                disabled={page === lastPage}
                onClick={() => setPage(prev => prev + 1)}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
