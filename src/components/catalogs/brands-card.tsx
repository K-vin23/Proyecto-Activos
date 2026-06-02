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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import BrandForm from './brand-form';
import type { Brand } from '@/types/catalog.type';
import { useBrands } from '@/hooks/useBrands';

// interface BrandsCardProps {
//   onRefresh: () => void;
//   onDelete: (brandId: string) => void;
// }
// {onRefresh}: BrandsCardProps
export default function BrandsCard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const { brands, fetchBrands  } = useBrands();

  // console.log("BRANDS_IN_COMPONENT:", brands);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Marcas</CardTitle>
          <CardDescription>
            Marcas disponibles para los activos.
          </CardDescription>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Marca
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Registrar Marca
              </DialogTitle>
            </DialogHeader>
            <BrandForm
              onSaveSuccess={async () => {
                setIsCreateOpen(false);
                await fetchBrands();
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.brandId}>
                <TableCell>
                  {brand.brand}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setBrandToEdit(brand)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Editar Marca
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() =>
                            //   onDelete(brand.brandId)
                            console.log("eliminar")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          Eliminar Marca
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog
        open={!!brandToEdit}
        onOpenChange={() => setBrandToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar Marca
            </DialogTitle>
          </DialogHeader>

          <BrandForm
            brandToEdit={brandToEdit}
            onSaveSuccess={async () => {
              setBrandToEdit(null);
              await fetchBrands();
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}