'use client';

import { object, z } from "zod";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ModelList } from "@/types/catalog.type";
import { useToast } from '@/hooks/use-toast';
import { useBrands } from "@/hooks/useBrands";
import { useTypes } from "@/hooks/useTypes";
import { catalogService } from "@/services/asset/catalog.service";
// import { catalogService } from "@/services/asset/catalog.service";

const modelSchema = z.object({
  typeId: z.string({
    required_error: 'Seleccione un tipo de activo',
  }),
  brandId: z.string({
    required_error: 'Seleccione una marca',
  }),
  model: z.string().min(1, 'El modelo es requerido'),
});

type ModelSchema = z.infer<typeof modelSchema>;

interface ModelFormProps {
  onSaveSuccess?: () => void;
  modelToEdit?: ModelList | null;
}

export default function ModelForm({onSaveSuccess, modelToEdit}: ModelFormProps) {
  const { toast } = useToast();
  const { brands } = useBrands();
  const { types } = useTypes();

  const isEditMode = !!modelToEdit;

  const form = useForm<ModelSchema>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      typeId: modelToEdit?.typeId,
      brandId: modelToEdit?.brandId,
      model: modelToEdit?.model ?? '',
    },
  });

    async function onSubmit(data: ModelSchema) {
      try {
        if (isEditMode && modelToEdit) {

          console.log(modelToEdit.modelId, "datos:", data);

          // await catalogService.update(
          //   modelToEdit.modelId,
          //   data
          // );

          toast({
            title: 'Actualización exitosa',
            description:
              'El modelo fue actualizado correctamente.',
          });
        } else {
          console.log("crear:", data);

          await catalogService.createModel(data);

          toast({
            title: 'Registro exitoso',
            description:
              'El modelo fue creado correctamente.',
          });

        }

        onSaveSuccess?.();

        form.reset();

      } catch (error) {

        console.error(error);

        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'No se pudo guardar el modelo.',
        });
      }
    }

    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* TIPO DE ACTIVO */}
        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tipo de activo
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem
                      key={type.typeId}
                      value={type.typeId}
                    >
                      {type.assetType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* MARCA */}
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Marca
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una marca" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem
                      key={brand.brandId}
                      value={brand.brandId}
                    >
                      {brand.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* MODELO */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Modelo
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Latitude 5420"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEditMode
            ? 'Guardar Cambios'
            : 'Registrar Modelo'}
        </Button>
      </form>
    </Form>
  );
}


