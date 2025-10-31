
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Users, ClipboardList } from "lucide-react"

interface SummaryCardsProps {
  totalAssets: number;
  totalUsers: number;
  openTasks: number;
}

export default function SummaryCards({ totalAssets, totalUsers, openTasks }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Activos Totales
          </CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <p className="text-xs text-muted-foreground">
            Activos en la empresa seleccionada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Usuarios en la empresa seleccionada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tareas Abiertas
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openTasks}</div>
          <p className="text-xs text-muted-foreground">
            Mantenimientos pendientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
