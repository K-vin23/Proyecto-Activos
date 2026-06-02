'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ModelSearch from '@/components/catalogs/model-search';

import { useToast } from '@/hooks/use-toast';
import { ComponentList } from '@/types/catalog.type';
import { catalogService } from '@/services/asset/catalog.service';

interface AssignComponentFormProps {
    component: ComponentList;
    onSaveSuccess?: () => void;
}

const assignSchema = z.object({
    modelId: z.number({required_error: "Seleccione un modelo"})
});

type FormSchema = z.infer<typeof assignSchema>;

export default function AssignationForm({onSaveSuccess, component}: AssignComponentFormProps) {
    const { toast } = useToast();
    const form = useForm<FormSchema>({
        resolver: zodResolver(assignSchema),
        defaultValues: {
            modelId: undefined
        }
    });

    async function onSubmit(data: FormSchema) {
        try {
            // console.log('create:', component.componentId, {componentId: data.modelId});
            await catalogService.assignComponent(data.modelId, {componentId: component.componentId});

            toast({
                title: "Asignación exitosa",
                description: "El componente fue asociado al modelo."
            });

            onSaveSuccess?.();
        } catch (error) {
            console.error(error);

            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo asignar el componente."
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* MODELO */}
                <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                                <ModelSearch
                                    value={field.value}
                                    onChange={(modelId) =>
                                        field.onChange(modelId)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Asignar Componente
                </Button>
            </form>
        </Form>
    )
}