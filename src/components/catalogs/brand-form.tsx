'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
// import { useCatalogs } from '@/hooks/useCatalogs';
import type { Brand } from '@/types/catalog.type';
import { catalogService } from '@/services/asset/catalog.service';

const brandSchema = z.object({
  brand: z
    .string()
    .min(1, 'La marca es requerida')
    .max(100, 'La marca es demasiado larga'),
});

type BrandSchema = z.infer<typeof brandSchema>;

interface BrandFormProps {
  onSaveSuccess?: () => void;
  brandToEdit?: Brand | null;
}

export default function BrandForm({
  onSaveSuccess,
  brandToEdit,
}: BrandFormProps) {

  const { toast } = useToast();

  const isEditMode = !!brandToEdit;

  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brand: brandToEdit?.brand ?? '',
    },
  });

    async function onSubmit(data: BrandSchema) {
    try {
      if (isEditMode && brandToEdit) {
        // await catalogService.update(
        //   brandToEdit.brandId,
        //   data
        // );
        toast({
          title: 'Actualización exitosa',
          description: 'La marca fue actualizada correctamente.',
        });

      } else {
        // console.log("DATA TO SEND", data.brand);
        await catalogService.createBrand(data);

        toast({
          title: 'Registro exitoso',
          description: 'La marca fue creada correctamente.',
        });
      }
      await onSaveSuccess?.();
      form.reset();

    } catch (error) {

      console.error(error);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la marca.',
      });

    }
  }

    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>

              <FormControl>
                <Input
                  placeholder="Dell"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
        >
          {isEditMode
            ? 'Guardar Cambios'
            : 'Registrar Marca'}
        </Button>
      </form>
    </Form>
  );
}