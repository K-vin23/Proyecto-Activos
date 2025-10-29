import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wrench } from "lucide-react";

export default function QuickAccess() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                <Button variant="secondary">
                    <FileText className="mr-2 h-4 w-4" /> Consultar Reportes
                </Button>
                <Button variant="secondary">
                    <Wrench className="mr-2 h-4 w-4" /> Asistencia Técnica
                </Button>
            </CardContent>
        </Card>
    );
}
