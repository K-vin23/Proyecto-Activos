'use client';

import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Pencil,
    Trash2,
} from 'lucide-react';
import type { ModelList } from '@/types/catalog.type';
import ModelForm from '@/components/catalogs/model-form';
import { useTypes } from '@/hooks/useTypes';

interface ModelsCardProps {
  models: ModelList[];
  onRefresh: () => void;
//   onDelete: (componentId: number) => void;
}

export default function ModelsCard({models, onRefresh}: ModelsCardProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<ModelList | null>(null);
    const { types } = useTypes();

    const typeMap = Object.fromEntries(
        types.map(type => [
            type.typeId,
            type
        ])
    );

    return (
        <>
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Modelos</CardTitle>
                        <CardDescription>Catálogo de modelos disponibles.</CardDescription>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Modelo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Crear Modelo
                                </DialogTitle>
                            </DialogHeader>
                            <ModelForm
                                onSaveSuccess={() => {
                                    setIsCreateOpen(false);
                                    onRefresh();
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead> Modelo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {models?.map((model) => {
                            const type = typeMap[model.typeId];
                            return (
                                <TableRow key={model.modelId}>
                                    <TableCell>{type?.assetType ?? "-"}</TableCell>
                                    <TableCell>{model.brandId}</TableCell>
                                    <TableCell>{model.model}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"
                                            onClick={() =>
                                                setEditingModel(model)
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon"
                                            onClick={() =>
                                                // onDelete(model.modelId)
                                                console.log("eliminar")
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {models.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No hay modelos registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        {/* EDITAR */}
        <Dialog open={!!editingModel} onOpenChange={(open) => { if (!open) {setEditingModel(null);}}}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editar Modelo
                    </DialogTitle>
                </DialogHeader>
                {editingModel && (
                    <ModelForm
                        modelToEdit={editingModel}
                        onSaveSuccess={() => {
                            setEditingModel(null);
                            onRefresh();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}