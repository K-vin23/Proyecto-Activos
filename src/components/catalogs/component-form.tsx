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
import { toast, useToast } from '@/hooks/use-toast';
import { ComponentList } from "@/types/catalog.type";
import { catalogService } from "@/services/asset/catalog.service";
import { useComponentTypes } from "@/hooks/useComponentTypes";
import ModelSearch from "@/components/catalogs/model-search";

const componentSchema = z.object({
  ctypeId: z.number({required_error: 'Seleccione un tipo',}),
  component: z.string().min(1,'El componente es requerido'),
});

type ComponentSchema = z.infer<typeof componentSchema>;

interface ComponentFormProps {
  onSaveSuccess?: () => void;
  componentToEdit?: ComponentList | null;
}

export default function ComponentForm({onSaveSuccess, componentToEdit}: ComponentFormProps) {
    const { toast } = useToast();
    const { componentTypes } = useComponentTypes()
    const isEditMode = !!componentToEdit;

    const form = useForm<ComponentSchema>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
          ctypeId: componentToEdit?.ctypeId,
          component: componentToEdit?.component ?? '',
        },
    });
    async function onSubmit(data: ComponentSchema) {
    try {

      if (isEditMode && componentToEdit) {

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

        console.log("data to send:", data);
        await catalogService.createComponent(data);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Tipo de componente */}
                <FormField
                    control={form.control}
                    name="ctypeId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>
                            Tipo de componente
                        </FormLabel>

                        <Select
                            value={field.value?.toString()}
                            onValueChange={(value) =>
                            field.onChange(Number(value))
                            }
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                            {componentTypes.map(type => (
                                <SelectItem key={type.ctypeId} value={String(type.ctypeId)}>
                                    {type.compType}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>

                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Componente */}
                <FormField
                    control={form.control}
                    name="component"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>
                            Componente
                        </FormLabel>

                        <FormControl>
                            <Input
                            placeholder="Core i5-12400"
                            {...field}
                            />
                        </FormControl>

                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {isEditMode ? 'Guardar Cambios' : 'Registrar Componente'}
                </Button>
            </form>
        </Form>
    )
}
