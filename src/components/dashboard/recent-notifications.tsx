import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  export default function RecentNotifications() {
    const notifications = [
      { title: "Mantenimiento requerido", description: "Laptop #1023 requiere revisión de batería." },
      { title: "Nuevo activo asignado", description: "Monitor Dell a John Doe (Ventas)." },
      { title: "Alerta de software", description: "Licencia de Adobe Creative Cloud expira en 15 días." },
      { title: "Reporte generado", description: "Reporte mensual de depreciación listo." },
    ];
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notificaciones Recientes</CardTitle>
          <CardDescription>Actividad y alertas importantes del sistema.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notifications.map((notification, index) => (
            <div className="flex items-start gap-4" key={index}>
                <div className="bg-primary rounded-full h-2 w-2 mt-1.5 shrink-0" />
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                    {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    {notification.description}
                    </p>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
