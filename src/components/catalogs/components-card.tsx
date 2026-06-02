'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Link2,
  Pencil,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import ComponentForm from '@/components/catalogs/component-form';
import type { ComponentList } from '@/types/catalog.type';
import { useCategories } from '@/hooks/useCategories';
import { useComponentTypes } from '@/hooks/useComponentTypes';
import AssignComponentForm from '@/components/catalogs/assign-component-form';

interface ComponentsCardProps {
  components: ComponentList[];
  onRefresh: () => void;
//   onDelete: (componentId: number) => void;
}

export default function ComponentsCard({components, onRefresh}: ComponentsCardProps) {
//   console.log("components props", components)
  const [componentToAssign, setComponentToAssign] = useState<ComponentList | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<ComponentList | null>(null);
  const { categories } = useCategories();
  const { componentTypes } = useComponentTypes();

  const categoryMap = Object.fromEntries(
    categories.map(category => [
        category.categoryId,
        category.category
    ])
  );

  const typeMap = Object.fromEntries(
    componentTypes.map(type => [
        type.ctypeId,
        type
    ])
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Componentes</CardTitle>
          <CardDescription>
            Catálogo de componentes reutilizables.
          </CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Componente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Registrar componente
              </DialogTitle>
            </DialogHeader>
            <ComponentForm
              onSaveSuccess={() => {
                setIsCreateOpen(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead className="text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {components?.map(component => {
                const type = typeMap[component.ctypeId];
                return (
                    <TableRow key={component.componentId}>
                        <TableCell>
                            {type ? categoryMap[type.categoryId] : "-"}
                        </TableCell>
                        <TableCell>
                            {type?.compType ?? "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                            {component.component}
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon"
                                    onClick={() =>
                                        setComponentToEdit(component)
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setComponentToAssign(component)
                                    }
                                >
                                    <Link2 className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon"
                                    onClick={() =>
                                        // onDelete(component.componentId)
                                        console.log("eliminar")
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })}
            {components.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground">
                    No hay componentes registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!componentToEdit} onOpenChange={() => setComponentToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar componente
            </DialogTitle>
          </DialogHeader>

          <ComponentForm
            componentToEdit={componentToEdit}
            onSaveSuccess={() => {
              setComponentToEdit(null);
              onRefresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!componentToAssign} onOpenChange={(open) => {if (!open) { setComponentToAssign(null);}}}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Asignar componente a un modelo
                </DialogTitle>
            </DialogHeader>
            {componentToAssign && (
                <AssignComponentForm
                    component={componentToAssign}
                    onSaveSuccess={() => {
                        setComponentToAssign(null);
                        onRefresh();
                    }}
                />
            )}
            </DialogContent>
        </Dialog>
    </Card>
  );
}