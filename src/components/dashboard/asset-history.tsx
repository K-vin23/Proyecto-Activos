
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data for asset history - In a real app, this would come from an API based on assetId
const historyData = [
    { id: '1', date: '2024-07-29', author: 'John Doe', type: 'Mantenimiento', description: 'Limpieza interna y cambio de pasta térmica.' },
    { id: '2', date: '2024-05-15', author: 'Jane Smith', type: 'Incidente', description: 'El equipo no enciende. Se revisa fuente de poder y se soluciona.' },
    { id: '3', date: '2024-02-01', author: 'John Doe', type: 'Instalación', description: 'Instalación de paquete de Adobe Creative Cloud.' },
    { id: '4', date: '2023-11-20', author: 'Almacén', type: 'Asignación', description: 'Activo asignado a Robert Brown (Ventas).' },
];

interface AssetHistoryProps {
    assetId: string;
}

export default function AssetHistory({ assetId }: AssetHistoryProps) {
  // In a real app, you would fetch the history based on the assetId
  const assetHistory = historyData;

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Mantenimiento':
        return 'default';
      case 'Incidente':
        return 'destructive';
      case 'Instalación':
        return 'secondary';
      case 'Asignación':
        return 'outline';
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
        <div className="space-y-6">
          {assetHistory.length > 0 ? (
            assetHistory.map((entry, index) => (
              <div key={entry.id}>
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{entry.author}</p>
                            <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                    </div>
                    <Badge variant={getBadgeVariant(entry.type)}>{entry.type}</Badge>
                </div>
                {index < assetHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">No hay registros de historial para este activo.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    