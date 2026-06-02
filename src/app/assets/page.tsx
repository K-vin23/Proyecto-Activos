'use client';

import * as React from 'react';
import { getSession } from '@/lib/session';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Calendar as CalendarIcon, Trash2, RotateCcw, ArrowLeft, ArrowBigLeft, ArrowBigRight, Loader2, Monitor, Zap, Laptop, ClipboardPlus, Eye, Replace, Download, Search, Filter, Pencil, CircleX } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AssetHistory from '@/components/dashboard/asset-history';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { computerService } from '@/services/computer.service';
import { SimpleUser } from '@/types/user.types';
import { usersService } from '@/services/user/users.service';
import { catalogService } from '@/services/asset/catalog.service';
import { mapAssetToFormValues, mapRequestToComputer } from '@/lib/mappers/asset.mapper';
import { useCatalogs } from '@/hooks/useCatalogs';
import { useCompanies } from '@/hooks/useCompanies';
import { useAreas } from '@/hooks/useAreas';
import { useUserSearch } from '@/hooks/useUsers';
import { assetService } from '@/services/asset/assets.service';
import { AssetList, DetailedAsset, RemovedList } from '@/types/asset.type';
import { maintenanceService } from '@/services/maintenance/maintenances.service';
import { Model } from '@/types/catalog.type';
import { AuthResponse } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import ModelSearch from '@/components/catalogs/model-search';
//================= SESSION ====================

//================= FORM SCHEMAS =================
const computerAssetSchema = z.object({
  internalId: z.string().min(1, 'El identificador del activo es requerido.').max(100, 'El identificador no puede ser mayor a 100 caracteres'),
  responsable: z.number().optional(),
  serialNumber: z.string().min(1, 'El número de serie es requerido.').max(100, 'El número de serie no puede ser mayor a 100 caracteres'),
  invoice: z.string().max(50, 'La factura no puede superar los 50 caracteres').optional(),
  purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
  companyId: z.number({ required_error: 'La empresa es requerida.' }),
  areaId: z.number({ required_error: 'El area es requerida.' }),
  categoryId: z.enum(['LAP', 'SFF', 'TORR']),
  modelId: z.number({ required_error: 'El modelo es requerido.'}),
  networkName: z.string().max(50, 'El nombre en red no puede superar los 50 caracteres').optional(),
  ram: z.array(z.number().optional()).min(1).max(3),
  storage: z.array(z.number().optional()).min(1).max(3),
  osLicenseId: z.number({ required_error: 'La licencia de windows es requerida.'}),
  osKey: z.string().max(120, 'La llave del sistema operativo no puede superar los 120 caracteres').optional(),
  officeLicenseId: z.number({ required_error: 'La licencia de office es requerida.'}),
  officeKey: z.string().max(120, 'La llave del office suite no puede superar los 120 caracteres').optional(),
});

const simpleAssetSchema = z.object({
    internalId: z.string().min(1, 'El identificador del activo es requerido.').max(100, 'El identificador no puede ser mayor a 100 caracteres'),
    responsable: z.number().optional(),
    serialNumber: z.string().min(1, 'El número de serie es requerido.').max(100, 'El número de serie no puede ser mayor a 100 caracteres'),
    invoice: z.string().max(50, 'La factura no puede superar los 50 caracteres').optional(),
    purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
    companyId: z.number({ required_error: 'La empresa es requerida.' }),
    areaId: z.number({ required_error: 'El area es requerida.' }),
    categoryId: z.enum(['MON', 'UPS']),
    modelId: z.number({ required_error: 'El modelo es requerido.'}),
    details: z.string().max(100, 'Los detalles del activo no puede superar los 50 caracteres').optional(),
});

const assetSchema = z.discriminatedUnion(
  "categoryId",
  [
    computerAssetSchema,
    simpleAssetSchema
  ]
);

type AssetFormData = z.infer<typeof assetSchema>;

type ComputerForm = z.infer<typeof computerAssetSchema>;

const addHistorySchema = z.object({
    tecId: z.number({required_error: 'El técnico es requerido.'}),
    description: z.string().min(1, 'La descripción es requerida.'),
    type: z.enum(['PREVENTIVO', 'CORRECTIVO'], {
        required_error: 'Debes seleccionar un tipo de registro.',
    }),
});

type AddHistorySchema = z.infer<typeof addHistorySchema>;
//================= END FORM SCHEMAS =================

//================= HISTORY FORM =================
interface AddHistoryFormProps {
  assetId: number;
  onSaveSuccess: () => void;
  technicians: SimpleUser[];
  onMaintenanceCreated?: () => void;
}

function AddHistoryForm({assetId, onSaveSuccess, technicians, onMaintenanceCreated}: AddHistoryFormProps) {
    const { toast } = useToast();    
    const form = useForm<AddHistorySchema>({
        resolver: zodResolver(addHistorySchema),
        defaultValues: {
            tecId: undefined,
            description: '',
            type: 'CORRECTIVO',
        },
    });
    
    function onSubmit(data: AddHistorySchema) {
        try {
            // console.log('New history entry for asset', assetId, data);
            if(assetId !== null){
                maintenanceService.create(assetId, data);

                onMaintenanceCreated?.();
            } else {
                toast({
                    title: 'Error de activo',
                    description: 'El activo obtenido no existe',
                });
            }

            toast({
                title: 'Historial Añadido',
                description: 'El nuevo registro ha sido guardado correctamente.',
            });
            form.reset();
            onSaveSuccess();
        } catch (error) {
            console.error('Error adding history:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo guardar el registro. Inténtalo de nuevo.',
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="tecId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Técnico Responsable</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un técnico" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {technicians.map(tech => (
                                    <SelectItem key={tech.userId} value={tech.userId?.toString()}>{tech.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Tipo de Registro</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="PREVENTIVO" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Mantenimiento</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="CORRECTIVO" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Incidente / Intervención</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción del Trabajo Realizado</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Detalla aquí el mantenimiento, instalación o incidente ocurrido con el equipo..."
                                    className="resize-y min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Guardar Registro</Button>
                </div>
            </form>
        </Form>
    );
}

// ================= ASSET FORM =================
function AssetForm({ typeId, onSaveSuccess, onBack, assetToEdit }: { typeId: 'LAP' | 'SFF' | 'TORR' | 'MON' | 'UPS', onSaveSuccess?: () => void, onBack?: () => void, assetToEdit?: DetailedAsset | null }) {
  const { toast } = useToast();
  const isEditMode = !!assetToEdit;
//   const [catalogQuery, setCatalogQuery] = useState('');
//   const [catalogResults, setCatalogResults] = useState<Model[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const { memories, disks, licenses } = useCatalogs();
  const { companies, companiesLoading } = useCompanies();
  const { areas, areasLoading} = useAreas();
  const {
    query,
    setQuery,
    results,
    isSearching,
    clearResults
  } = useUserSearch();
  
  const isComputer = ['LAP','SFF','TORR'].includes(typeId);

  const schema = isComputer ? computerAssetSchema : simpleAssetSchema;

  const defaultValues: AssetFormData = 
    isComputer ? {
        internalId: '', 
        responsable: undefined, 
        serialNumber: '', 
        invoice: '', 
        purchaseDate: new Date(),
        companyId: undefined as any, 
        areaId: undefined as any, 
        categoryId: typeId as 'LAP' | 'SFF' | 'TORR', 
        modelId: undefined as any, 
        networkName: 'SIN NOMBRE', 
        ram: [undefined], 
        storage: [undefined], 
        osLicenseId: undefined as any, 
        osKey: '',
        officeLicenseId: undefined as any, 
        officeKey: ''
    } : 
    {
        internalId: '', 
        responsable: undefined, 
        serialNumber: '', 
        invoice: '',
        purchaseDate: new Date(),  
        companyId: undefined as any, 
        areaId: undefined as any, 
        categoryId: typeId as 'MON' | 'UPS', 
        modelId: undefined as any, 
        details: ''
    };

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues
  })

  const ram = isComputer ? (form.watch("ram") ?? []) : [];
  const storage = isComputer ? (form.watch("storage") ?? []) : [];

  const canAddMoreRam = ram.length < 3 && ram.every(Boolean);
  const canAddMoreDisk = storage.length < 3 && storage.every(Boolean);

  // Edit
  useEffect(() => {
    if (isEditMode && assetToEdit && companies.length > 0 && areas.length > 0) {
      form.reset(mapAssetToFormValues(assetToEdit));

      setIsSelecting(true);
    //   setCatalogQuery(
    //     assetToEdit.model.model ? `${assetToEdit.model.brand} ${assetToEdit.model.model}` : ''
    //   );
    //   setCatalogResults([]);
    }
  }, [isEditMode, assetToEdit, companies, areas]);


// Catalog models search
//   useEffect(() => { 
//     if (isSelecting) return; 

//     const fetchCatalog = async () => {
//       if (catalogQuery.length < 1) {
//         setCatalogResults([]);
//         return;
//       }

//       try {
//         const res = await catalogService.search(catalogQuery);
//         console.log(res.data);
//         setCatalogResults(res.data); 
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     const delayDebounce = setTimeout(fetchCatalog, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [catalogQuery]);

  useEffect(() => {
  if (!isSelecting) return;

  const timeout = setTimeout(() => {
    setIsSelecting(false);
  }, 200);

  return () => clearTimeout(timeout);
}, [isSelecting]);

 const officeLicenses = licenses.filter(l => l.softwareType === "OFFI");
 const osLicenses = licenses.filter(l => l.softwareType === "SO");

 function isComputerAsset(
    data: AssetFormData
 ): data is ComputerForm {
    return ['LAP', 'SFF', 'TORR'].includes(data.categoryId);
 }

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
        // --Transform
        let cleanData: AssetFormData = data;
        let payload;
        if (isComputerAsset(data)) {
            cleanData = {
                ...data,
                ram: data.ram?.filter(Boolean),
                storage: data.storage?.filter(Boolean),
            };

            payload = mapRequestToComputer(cleanData);
        }else {
            payload = cleanData;
        }

        let display = '';
        switch (typeId) {
            case 'LAP':
                display = 'La laptop';
                break;
            case 'SFF':
                display = 'El mini-PC';
                break;
            case 'TORR':
                display = 'La torre';
                break;
            case 'MON':
                display = 'El monitor';
                break;
            case 'UPS':
                display = 'El UPS';
                break;
            default:
                display = 'Unknwon asset'
                break;
        }

      if (isEditMode) {
        // console.log("DATA TO SEND:", JSON.stringify(payload, null, 2));
        await assetService.update(assetToEdit.assetId, payload);

        toast({
          title: 'Actualización Exitosa',
          description: `${display} ha sido actualizado correctamente.`,
        });
      } else {        
        // console.log('DATA TO SEND:', JSON.stringify(payload, null, 2)); 
        await assetService.create(payload);
        toast({
          title: 'Registro Exitoso',
          description: `${display} ha sido registrado correctamente.`,
        });

        form.reset();
      }
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    }catch (error) {
      console.error('Error during operation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo ${isEditMode ? 'actualizar' : 'registrar'} el activo. Inténtalo de nuevo.`,
      });
    }
  }

  const getPlaceholder = () => {
    switch (typeId) {
        case 'LAP':
            return 'LAPTOP-001';
        case 'SFF':
            return 'SFF-001';
        case 'TORR':
            return 'TORRE-001';
        case 'MON':
            return 'MONITOR-001';
        case 'UPS':
            return 'UPS-001';
    }
  }

  return (
    <>
        {(onBack || isEditMode) && (
            <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
        )}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {console.log("errores en el form: ", errors);})} className="px-6 pb-6">
        {!isEditMode && (
            // RESPONSABLE
            <div className="mb-6">
                 <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Responsable</FormLabel>
                            <FormControl>
                                <Input
                                  placeholder= "Buscar por nombre o ID..."
                                  value={query}
                                  onChange={(e) => {
                                    setQuery(e.target.value);
                                  }}/>
                            </FormControl>
                            {isSearching && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Buscando...
                                </p>
                            )}
                            {/* RESULTADOS */}
                            {results.length > 0 && (
                                <div className="border rounded-md mt-2 max-h-40 overflow-y-auto">
                                    {results.map(user => (
                                        <div
                                            key={user.userId}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                field.onChange(Number(user.userId)); // se guarda el ID
                                                setQuery(user.name);
                                                clearResults();
                                            }}
                                        >
                                            {user.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}
            
            <Separator className="my-4" />

            {/* NOMBRE DE ACTIVO */}
            <div className={`grid grid-cols-1 ${isComputer ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                {/* Common Fields */}
                <FormField
                control={form.control}
                name="internalId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activo / Nombre</FormLabel>
                    <FormControl>
                        <Input placeholder={getPlaceholder()} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* NUMERO DE SERIE */}
                <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Serie</FormLabel>
                    <FormControl>
                        <Input placeholder="DXG-12345-ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* FACTURA */}
                <FormField
                control={form.control}
                name="invoice"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Factura (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="FV-2024-9876" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* FECHA DE COMPRA */}
                <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                    <FormLabel>Fecha de Compra</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PP')
                            ) : (
                                <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* CATALOGO MODELOS ACTIVOS */}
                <FormField
                    control={form.control}
                    name='modelId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modelo de Equipo</FormLabel>
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
                {/* EMPRESA */}
                <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : undefined}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una empresa" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {companies.map((company) => (
                            <SelectItem key={company.companyId} value={String(company.companyId)}>
                                {company.company}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* AREA */}
                <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Area</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : undefined}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un area" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {areas.map((area) => (
                            <SelectItem key={area.areaId} value={String(area.areaId)}>
                                {area.area}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {/* Computer-specific fields */}
                {isComputer && (
                <>

                <FormField
                    control={form.control}
                    name="networkName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre en Red (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="PC-VENTAS-01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                {/* TIPO DE EQUIPO */}
                <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="LAP">PORTATIL</SelectItem>
                        <SelectItem value="SFF">Mini-PC</SelectItem>
                        <SelectItem value="TORR">TORRE</SelectItem>
                        {/* <SelectItem value="MON">MONITOR</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem> */}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* MEMORIAS RAM */}
                <div className="space-y-2">
                    <FormLabel>Memoria RAM</FormLabel>

                    {ram.map((_, index) => (
                    <FormField
                        key={index}
                        control={form.control}
                        name={`ram.${index}`}
                        render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value ? String(field.value) : undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona RAM" />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {memories.map((mem) => (
                                        <SelectItem key={mem.id} value={String(mem.id)}>
                                            {mem.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    ))}

                    {/* BOTONES RAM */}
                    <div className="flex gap-2">
                    {canAddMoreRam && (
                        <button
                            type="button"
                            onClick={() => form.setValue("ram" as any, [...ram, undefined])}
                            className="text-sm text-blue-600"
                        >
                            + Agregar RAM
                        </button>
                    )}

                    {ram.length > 1 && (
                    <button
                    type="button"
                    onClick={() =>
                    form.setValue("ram", ram.slice(0, -1))
                    }
                    className="text-sm text-red-600"
                    >
                    - Quitar
                    </button>
                    )}
                    </div>
                </div>

                {/* DISCOS */}
                <div className="space-y-2">
                    <FormLabel>Disco Duro</FormLabel>

                        {storage.map((_, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`storage.${index}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona Disco" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                        {disks.map((disk) => (
                                        <SelectItem key={disk.id} value={String(disk.id)}>
                                            {disk.name}
                                        </SelectItem>
                                        ))}
                                        </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                        />
                        ))}

                    {/* BOTONES DISCO */}
                    <div className="flex gap-2">
                        {canAddMoreDisk && (
                            <button
                                type="button"
                                onClick={() => form.setValue("storage" as any, [...storage, undefined])}
                                className="text-sm text-blue-600"
                            >
                                + Agregar disco
                            </button>
                        )}

                    {storage.length > 1 && (
                    <button
                    type="button"
                    onClick={() =>
                    form.setValue("storage", storage.slice(0, -1))
                    }
                    className="text-sm text-red-600"
                    >
                    - Quitar
                    </button>
                    )}
                    </div>
                </div>
                
                {/* LICENCIAS */}
                <div className="md:col-span-3" />
                <FormField
                    control={form.control}
                    name="officeLicenseId"
                    render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Versión de Office</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una versión" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {officeLicenses.map((lic) => (
                            <SelectItem
                                key={lic.licenseId}
                                value={lic.licenseId?.toString()} 
                            >
                                {lic.software} {lic.sofVersion}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    <FormMessage />
                    </FormItem>
  )}
/>
                <FormField
                control={form.control}
                name="officeKey"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de Office (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="osLicenseId"
                    render={({ field }) => (
                        <FormItem className="md:col-span-1">
                        <FormLabel>Sistema Operativo</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un S.O." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {osLicenses.map((lic) => (
                                <SelectItem
                                    key={lic.licenseId}
                                    value={lic.licenseId?.toString()} 
                                >
                                {lic.software} {lic.sofVersion}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="osKey"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de S.O. (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </>
                )}

                {/* Simple form specific fields */}
                {!isComputer && (
                    <>
                    <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Detalles</FormLabel>
                        <FormControl>
                            <Input placeholder="Especificaciones" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </>
                )}


                <div className={`${isComputer ? "md:col-span-3" : "md:col-span-2"} pt-4`}>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    {isEditMode ? 'Guardar Cambios' : 'Registrar Activo'}
                </Button>
                </div>
            </div>
        </form>
        </Form>
    </>
  );
}

function AssetTypeSelector({ onSelect, onCancel }: { onSelect: (type: 'LAP' | 'SFF' | 'TORR' | 'MON' | 'UPS') => void, onCancel: () => void }) {
    return (
        <div className="p-6">
            <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-headline text-center">Selecciona un tipo de activo</DialogTitle>
                <DialogDescription className="text-center">
                    Elige la categoría del activo que deseas registrar.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('LAP')}>
                    <Laptop className="h-8 w-8 text-primary" />
                    <span>Computador</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('MON')}>
                    <Monitor className="h-8 w-8 text-primary" />
                    <span>Monitor</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('UPS')}>
                    <Zap className="h-8 w-8 text-primary" />
                    <span>UPS</span>
                </Button>
            </div>
             <DialogClose asChild>
                <Button variant="ghost" onClick={onCancel} className="w-full mt-4">Cancelar</Button>
            </DialogClose>
        </div>
    );
}

function ActivosPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  //   Dialog tabs config
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isChangeOwnerOpen, setIsChangeOwnerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'deleted'>('all');
  const [selectedResponsable, setSelectedResponsable] = useState<SimpleUser | null>(null);
  const {
    query: ownerQuery,
    setQuery: setOwnerQuery,
    results: ownerResults,
    isSearching: ownerSearching,
    clearResults
  } = useUserSearch();
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  //    Assets
  const [assets, setAssets] = useState<AssetList[]>([]);
  const [removedAssets, setRemovedAssets] = useState<RemovedList[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<DetailedAsset | null>(null);
  const [assetCache, setAssetCache] = useState<Record<number, any>>({});
  const [assetToEdit, setAssetToEdit] = useState<DetailedAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<AssetList | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<'LAP' | 'SFF' | 'TORR' | 'MON' | 'UPS' | null>(null);
  const [removalReason, setRemovalReason] = useState('');
  //    Catalogs
  const { companies, companiesLoading } = useCompanies();
  const { areas, areasLoading } = useAreas();
  const [technicians, setTechnicians] = useState<SimpleUser[]>([]);
  const { memories, disks, licenses, loading } = useCatalogs();
  //    Configs
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRemoved, setIsLoadingRemoved] = useState(true);
//   const [removedLoaded, setRemovedLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    companyId: '',
    areaId: '',
    status: '',
    typeId: '',
    // search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [remcurrentPage, setRemCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [remPagination, setRemPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const[session, setSession] = useState<AuthResponse | null>(null);
  
  useEffect(()=>{
    setSession(getSession());
  }, []);
  
 //=================== FETCH FROM API ===================
  // Fetch assets
  const loadAssets = async () => {
    try {
        setIsLoading(true);
        const assets = await assetService.list({
            page: currentPage,
            companyId: advancedFilters.companyId ? Number(advancedFilters.companyId) : undefined,
            search: debouncedSearch,
            areaId: advancedFilters.areaId ? Number(advancedFilters.areaId) : undefined,
            status: advancedFilters.status,
            typeId: advancedFilters.typeId
        });
        setAssets(assets.data);
        setPagination(assets.meta);
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron cargar los activos',
        });
    } finally{
        setIsLoading(false);
    }
  }
  // Fecth inactive assets
  const loadRemovedAssets = async () => {
    try{
        setIsLoadingRemoved(true);

        const removed = await assetService.listRemoved({
            search: debouncedSearch,
            page: remcurrentPage
        });

        setRemovedAssets(removed.data);
        setRemPagination(removed.meta);
    }catch (e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron cargar los activos eliminados',
        });
    } finally {
        setIsLoadingRemoved(false);
    }
  }

  // Load assets from url param
  useEffect(() => {
    const openAssetId = searchParams.get('openAssetId');

    if (!openAssetId || isDetailDialogOpen) return;

    handleOpenDetailDialog(Number(openAssetId));

    const params = new URLSearchParams(searchParams);
    params.delete('openAssetId');

    router.replace('/assets');
}, [searchParams, router, isDetailDialogOpen]);

  // Load assets
  useEffect(() => {   
    loadAssets();
  }, [currentPage, debouncedSearch, advancedFilters]);

  // Load removed assets
  useEffect(() => {
    if(activeTab === 'deleted') {
        loadRemovedAssets();
        // setRemovedLoaded(true);
    }
  }, [activeTab, remcurrentPage, debouncedSearch]);

 // Fecth technicians list
    useEffect(() => {
      const fetchTechnicians = async () => {
        setIsLoading(true);
  
        try {
          const response = await usersService.listTechnicians();
  
          setTechnicians(response.data);
        } catch {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron cargar los tecnicos.',
          });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchTechnicians();
    }, []);

//=================== HANDLES FUNCS ===================
  const handleCreateDialogChange = (open: boolean) => {
    if (!open) {
        setSelectedAssetType(null);
    }
    setIsCreateDialogOpen(open);
  }

  const handleDetailDialogChange = (open: boolean) => {
    if (!open) {
        setSelectedAsset(null);
    }
    setIsDetailDialogOpen(open);
  };

  const handleOpenDetailDialog = async (assetId: number) => {
    try {
        if (assetCache[assetId]) {
            setSelectedAsset(assetCache[assetId]);
            setIsDetailDialogOpen(true);
            return;
        }
        const res = await assetService.get(assetId);
        setAssetCache(prev => ({
            ...prev,
            [assetId]: res.data
        }));
        setSelectedAsset(res.data);
        setIsDetailDialogOpen(true);
    } catch (error) {
        console.error(error);

        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo cargar el activo.'
        });
    }
  };

  const handleHistoryDialogChange = (open: boolean) => {
    if (open) {
        setIsDetailDialogOpen(false);
    } else if (selectedAsset) {
        setIsDetailDialogOpen(true);
    }
    setIsHistoryDialogOpen(open);
  }

  const handleChangeOwnerDialogChange = (open: boolean) => {
    if (open) {
        setIsDetailDialogOpen(false);
    } else if (selectedAsset) {
        setIsDetailDialogOpen(true);

        setOwnerQuery('');
        setSelectedResponsable(null);
        clearResults();
    }
    setIsChangeOwnerOpen(open);
  }
  
  const handleEditDialogChange = (open: boolean) => {
      if (!open) {
          setAssetToEdit(null);
          if (selectedAsset) {
            setIsDetailDialogOpen(true);
          }
      } else {
        setIsDetailDialogOpen(false);
      }
      setIsEditDialogOpen(open);
  }

  const handleOpenHistoryDialog = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleOpenChangeOwnerDialog = () => {
    setIsChangeOwnerOpen(true);
  }

  const handleOpenEditDialog = (asset: any) => {
      setAssetToEdit(asset);
      setIsEditDialogOpen(true);
  }

  const handleSaveSuccess = async () => {
    setIsCreateDialogOpen(false);
    setSelectedAssetType(null);
    setIsEditDialogOpen(false);
    setAssetToEdit(null);

    await loadAssets();

    if(selectedAsset) {
        const res = await assetService.get(selectedAsset.assetId);
        setSelectedAsset(res.data);
    }
  }

  const handleDeleteAsset = async () => {
    if (!assetToDelete) {
        console.log("no asset to delete");
        return
    };
    try{
        // console.log("motivo: ", removalReason, "activo: ", assetToDelete.assetId);
        
        await assetService.delete(assetToDelete.assetId, removalReason);
        setIsDetailDialogOpen(false);
        setSelectedAsset(null);
        setRemovalReason('');
        await loadAssets();
        await loadRemovedAssets();

        toast({
            title: 'Activo Dado de Baja',
            description: `El activo ${assetToDelete.internalId} ${assetToDelete.model} ha sido eliminado.`
        });
    } catch(error) {
        console.error(error);

            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo dar de baja el activo',
            });
    }
  }

  const handleRestoreAsset = async (assetId: number) => {
    try {
        await assetService.restore(assetId);

        await loadRemovedAssets();
        await loadAssets();

        toast({
            title: "Activo Restaurado",
            description: "El activo fue restaurado correctamente."
        });
    } catch(e) {
        console.error(e);

        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo restaurar el activo."
        });
    }
  }
  
  const handleAdvancedFilterChange = (key: string, value: any) => {
    setCurrentPage(1);
    setAdvancedFilters((prev) => ({
        ...prev, 
        [key]: value || undefined,
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({companyId: '', areaId: '', status: '', typeId: ''});
  };

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timeout = setTimeout(() => {
        setDebouncedSearch(searchTerm);
    }, 600); 

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const ASSET_TYPE_LABELS = {
    LAP: 'Laptop',
    SFF: 'Mini-PC',
    TORR: 'Torre',
    MON: 'Monitor',
    UPS: 'UPS'
  } as const;

  const isStandardUser = session?.user.rol === 'PER';

  // RAM
  const rams = selectedAsset?.ram?.map(ram => ram.name) ?? [];

  // DISK
  const storage = selectedAsset?.storage?.map(disk => disk.name) ?? [];

  // LICENSES
  const getLicenseById = (id?: number) => {
    return licenses.find(l => l.licenseId === id);
  };

  const osLicenseData = selectedAsset?.osLicense
  ? getLicenseById(selectedAsset.osLicense.licenseId)
  : null;

  const officeLicenseData = selectedAsset?.officeLicense
  ? getLicenseById(selectedAsset.officeLicense.licenseId)
  : null;

  const truncate = (text: string) =>
   text.length > 20 ? text.slice(0, 20) + '...' : text;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px] p-6 gap-6">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Activos</h1>
            {!isStandardUser && (
              <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Activo
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto p-0">
                  {!selectedAssetType ? (
                      <AssetTypeSelector onSelect={setSelectedAssetType} onCancel={() => handleCreateDialogChange(false)} />
                  ) : (
                      <>
                      <DialogHeader className="pt-12 px-6">
                          <DialogTitle className="text-2xl font-headline text-center">Registrar nuevo {selectedAssetType.toLowerCase()}</DialogTitle>
                          <DialogDescription className="text-center">
                              Introduce los datos para registrar el activo en el sistema.
                          </DialogDescription>
                      </DialogHeader>
                      <AssetForm 
                          typeId={selectedAssetType} 
                          onSaveSuccess={handleSaveSuccess}
                          onBack={() => setSelectedAssetType(null)} 
                      />
                      </>
                  )}
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <span className="sr-only">Close</span>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'deleted')}>
            <TabsList className={`grid w-full ${isStandardUser ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <TabsTrigger value="all">Listado de Activos</TabsTrigger>
                {!isStandardUser && <TabsTrigger value="deleted">Activos Eliminados</TabsTrigger>}
            </TabsList>
            <TabsContent value="all">
                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Activos</CardTitle>
                        <div className="space-y-4 pt-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                type="search"
                                placeholder="Buscar activo por ID o nombre"
                                className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                                value={searchTerm}
                                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value);}}
                                />
                            </div>
                            {!isStandardUser && (
                              <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="advanced-search">
                                      <AccordionTrigger>
                                          <div className="flex items-center gap-2">
                                              <Filter className="h-4 w-4" />
                                              Búsqueda Avanzada
                                          </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="pt-4">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              <Select value={advancedFilters.companyId  || ""} onValueChange={(value) => handleAdvancedFilterChange('companyId', value)}>
                                                  <SelectTrigger><SelectValue placeholder="Empresa" /></SelectTrigger>
                                                  <SelectContent>
                                                      {companies.map(comp => <SelectItem key={comp.companyId} value={String(comp.companyId)}>{comp.company}</SelectItem>)}
                                                  </SelectContent>
                                              </Select>
                                              <Select value={advancedFilters.areaId || ""} onValueChange={(value) => handleAdvancedFilterChange('areaId', value)}>
                                                  <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
                                                  <SelectContent>
                                                        {areas.map(ar => <SelectItem key={ar.areaId} value={String(ar.areaId)}>{ar.area}</SelectItem>)}
                                                  </SelectContent>
                                              </Select>
                                              <Select value={advancedFilters.status} onValueChange={(value) => handleAdvancedFilterChange('status', value)}>
                                                  <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="Asignado">Asignado</SelectItem>
                                                      <SelectItem value="Almacen">En Almacén</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                              <Select value={advancedFilters.typeId} onValueChange={(value) => handleAdvancedFilterChange('typeId', value)}>
                                                  <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="LAP">Laptop</SelectItem>
                                                      <SelectItem value="SFF">SFF</SelectItem>
                                                      <SelectItem value="TORR">Torre</SelectItem>
                                                      <SelectItem value="MON">Monitor</SelectItem>
                                                      <SelectItem value="UPS">UPS</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                          </div>
                                          <div className="pt-4 flex justify-end">
                                              <Button variant="ghost" onClick={clearAdvancedFilters}>Limpiar filtros</Button>
                                          </div>
                                      </AccordionContent>
                                  </AccordionItem>
                              </Accordion>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>ID Activo</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                                    <Loader2 className="h-12 w-12 animate-spin" />
                                    <span className="mt-3 text-muted-foreground">
                                        Cargando activos...
                                    </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ): assets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No hay activos registrados.
                                </TableCell>
                            </TableRow>
                        ): (
                            assets.map((asset) => {
                                return (
                                    <TableRow key={asset.assetId}>
                                        <TableCell className="font-medium">{asset.internalId}</TableCell>
                                        <TableCell>{asset.model}</TableCell>
                                        <TableCell>{asset.category}</TableCell>
                                        <TableCell>{asset.company}</TableCell>
                                        <TableCell>
                                            <Badge variant={asset.status === 'Asignado' ? 'default' : 'secondary'}>
                                                {asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => handleOpenDetailDialog(asset.assetId)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ver Equipo</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                        
                                                {!isStandardUser && (
                                                    <AlertDialog>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="destructive" size="icon" onClick={() => setAssetToDelete(asset)}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Dar de Baja</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción moverá el activo <span className="font-semibold">{asset.internalId} {asset.model}</span> a la lista de activos eliminados. 
                                                                    Introduce el motivo de la baja.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <Textarea 
                                                                value={removalReason}
                                                                onChange={(e) => setRemovalReason(e.target.value)}
                                                                placeholder="Motivo de la baja (ej: dañado, obsoleto, etc.)" />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteAsset()} disabled={!removalReason.trim()}>Confirmar Baja</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                        </TableBody>
                        </Table>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Página {pagination.current_page} de {pagination.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={pagination.current_page === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                                    <ArrowBigLeft className="mr-2 h-4 w-4"/>
                                    Anterior
                                </Button>
                                <Button variant="outline" disabled={pagination.current_page === pagination.last_page} onClick={() => setCurrentPage((prev) => prev + 1)}>
                                    Siguiente
                                    <ArrowBigRight className="mr-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
            {!isStandardUser && (
              <TabsContent value="deleted">
                  <Card>
                      <CardHeader>
                          <CardTitle>Activos Eliminados</CardTitle>
                          <div className="relative mt-2">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                              type="search"
                              placeholder="Buscar en activos eliminados..."
                              className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              />
                          </div>
                      </CardHeader>
                      <CardContent>
                      <div className="overflow-x-auto">
                          <Table>
                          <TableHeader>
                              <TableRow>
                              <TableHead>ID Activo</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Categoría</TableHead>
                              <TableHead>Fecha de Baja</TableHead>
                              <TableHead>Motivo</TableHead>
                              <TableHead>Acciones</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                           {isLoading ? (
                                <TableRow>
                                <TableCell colSpan={6}>
                                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                                    <Loader2 className="h-12 w-12 animate-spin" />
                                    <span className="mt-3 text-muted-foreground">
                                        Cargando activos eliminados...
                                    </span>
                                    </div>
                                </TableCell>
                                </TableRow>
                            ): removedAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6">
                                        No hay activos eliminados registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                            removedAssets.map((asset) => (
                                    <TableRow key={asset.assetId}>
                                        <TableCell className="font-medium">{asset.internalId}</TableCell>
                                        <TableCell>{asset.model}</TableCell>
                                        <TableCell>{asset.category}</TableCell>
                                        <TableCell>{String(asset.removalDate)}</TableCell>
                                        <TableCell>{truncate(asset.reason)}</TableCell>
                                        <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleRestoreAsset(asset.assetId)}>
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Restaurar
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                          </TableBody>
                          </Table>
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Página {remPagination.current_page} de {remPagination.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={remPagination.current_page === 1} onClick={() =>setRemCurrentPage((prev) => prev - 1)}>
                                    <ArrowBigLeft className="mr-2 h-4 w-4"/>
                                    Anterior
                                </Button>
                                <Button variant="outline" disabled={pagination.current_page === pagination.last_page} onClick={() => setRemCurrentPage((prev) => prev + 1)}>
                                    Siguiente
                                    <ArrowBigRight className="mr-2 h-4 w-4"/>
                                </Button>
                            </div>
                          </div>
                      </div>
                      </CardContent>
                  </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>

       {/* Asset Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogChange}>
        <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
            {selectedAsset && ( 
            <>
                <DialogHeader className='pr-12'>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-headline">Detalles del Activo: {selectedAsset.internalId} {selectedAsset.model.model}</DialogTitle>
                            <DialogDescription>
                                Información completa y registros de mantenimiento.
                            </DialogDescription>
                        </div>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Button>
                    </div>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Especificaciones Técnicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="md:col-span-1"><span className="font-semibold">ID Activo: </span>{selectedAsset.internalId}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Categoría: </span>{selectedAsset.category}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Estado: </span>{selectedAsset.status}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Empresa: </span>{selectedAsset.company.company}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Responsable: </span>{selectedAsset.responsable ? `${selectedAsset.responsable.name}` : 'Sin asignar' }</div>
                                <div className="md:col-span-1"><span className="font-semibold">Nº de Serie: </span>{selectedAsset.serialNumber}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Fecha Compra: </span>{format(new Date(selectedAsset.purchaseDate), "dd/MM/yyyy")}</div>
                                {selectedAsset.invoice && <div className="md:col-span-1"><span className="font-semibold">Nº Factura: </span>{selectedAsset.invoice}</div>}
                                <div className="md:col-span-1"><span className="font-semibold">Marca: </span>{selectedAsset.model.brand}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Modelo: </span>{selectedAsset.model.model}</div>
                                <div className="md:col-span-1"><span className="font-semibold">Area: </span>{selectedAsset.area.area}</div>
                                {selectedAsset.processor && <div className="md:col-span-1"><span className="font-semibold">Procesador: </span>{selectedAsset.processor?.name}</div>}
                                {selectedAsset.details && <div className="md:col-span-1"><span className="font-semibold">Detalles: </span>{selectedAsset.details}</div>}

                                {rams.length > 0 && (
                                <div className="md:col-span-1">
                                    <span className="font-semibold">RAM: </span>
                                    {rams.join(', ')}
                                </div>
                                )}
                                {storage.length > 0 && (
                                <div className="md:col-span-1">
                                    <span className="font-semibold">Almacenamiento: </span>
                                    {storage.join(', ')}
                                </div>
                                )}
                            </div>

                            {(selectedAsset.osLicense || selectedAsset.officeLicense) && (<Separator className="my-4" />)}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {selectedAsset.osLicense && osLicenseData && (
                                    <div className="space-y-1">
                                        <div className="font-semibold">Sistema Operativo</div>
                                        <div>
                                            {osLicenseData.software} ({osLicenseData.sofVersion})
                                            <div>
                                                <span className="font-semibold">Licencia: </span>
                                                {selectedAsset.osLicense.licenseKey}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedAsset.officeLicense && officeLicenseData && (
                                    <div className="space-y-1">
                                        <div className="font-semibold">Office</div>
                                        <div>
                                            {officeLicenseData.software} ({officeLicenseData.sofVersion})
                                            <div>
                                                <span className="font-semibold">Licencia: </span>
                                                {selectedAsset.officeLicense.licenseKey}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <AssetHistory assetId={selectedAsset.assetId} refreshKey={historyRefreshKey}/>
                </div>
                {!isStandardUser && (
                  <DialogFooter className="border-t pt-4 flex-wrap justify-start gap-2">
                      <Button variant="secondary" onClick={handleOpenHistoryDialog}>
                          <ClipboardPlus className="mr-2 h-4 w-4" />
                          Añadir Historial
                      </Button>
                      <Button variant="secondary" onClick={handleOpenChangeOwnerDialog}>
                          <Replace className="mr-2 h-4 w-4" />
                          Cambiar Responsable
                      </Button>
                      <Button variant="outline" onClick={() => handleOpenEditDialog(selectedAsset)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                      </Button>
                  </DialogFooter>
                )}
            </>
            )}
        </DialogContent>
      </Dialog>


      {/* Add History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={handleHistoryDialogChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-xl rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Añadir Registro al Historial</DialogTitle>
                    <DialogDescription>
                        Registra un nuevo mantenimiento o incidente para el activo {selectedAsset?.internalId}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {selectedAsset && (
                        <AddHistoryForm 
                            assetId={selectedAsset.assetId} 
                            onSaveSuccess={() => {
                                setIsHistoryDialogOpen(false);
                                if (selectedAsset) setIsDetailDialogOpen(true);
                            }}
                            onMaintenanceCreated = {() => setHistoryRefreshKey(prev => prev + 1)}
                            technicians={technicians}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>

        {/* Change Owner Dialog */}
        <Dialog open={isChangeOwnerOpen} onOpenChange={handleChangeOwnerDialogChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Cambiar Responsable</DialogTitle>
                    <DialogDescription>
                        Selecciona el nuevo responsable para el activo {selectedAsset?.internalId}. 
                        El responsable actual es {selectedAsset?.responsable?.name ?? ''}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Buscar por nombre o ID..."
                            value={ownerQuery}
                            onChange={(e) => {
                                setOwnerQuery(e.target.value);
                            }}
                        />

                        {ownerSearching && (
                            <p className="text-sm text-muted-foreground">
                                Buscando...
                            </p>
                        )}

                        {ownerResults.length > 0 && (
                            <div className="border rounded-md max-h-40 overflow-y-auto">
                                {ownerResults.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedResponsable(user);

                                            setOwnerQuery(
                                                `${user.name}`
                                            );

                                            clearResults();
                                        }}
                                    >
                                        {user.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedResponsable && (
                            <p className="text-sm text-muted-foreground">
                                Responsable seleccionado:
                                <span className="font-medium ml-1">
                                    {selectedResponsable.name}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleChangeOwnerDialogChange(false)}>Cancelar</Button>
                    <Button
                        onClick={async () => {
                            if (!selectedResponsable || !selectedAsset) return;  
                            await assetService.setResponsable(
                                selectedAsset?.assetId,
                                selectedResponsable.userId
                            );

                            setSelectedAsset(prev => prev ? {
                                ...prev,
                                responsable: {userId: selectedResponsable.userId, name: selectedResponsable.name}
                            } : null);
                            await loadAssets();
                            toast({
                                title: "Responsable Cambiado",
                                description: "El responsable del activo ha sido actualizado."
                            });

                            handleChangeOwnerDialogChange(false);
                        }}
                    >
                        Guardar Cambio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Edit Asset Dialog*/} 
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="pt-12 px-6">
                    <DialogTitle className="text-2xl font-headline text-center">{assetToEdit ? `Editar Activo: ${assetToEdit.internalId} - ${assetToEdit.model.brand} ${assetToEdit.model.model}` : `Editar Activo`}</DialogTitle>
                    <DialogDescription className="text-center">
                        Modifica los datos del activo. El responsable no se puede cambiar aquí.
                    </DialogDescription>
                </DialogHeader>
                {assetToEdit?.categoryId && (
                        <AssetForm 
                            typeId={assetToEdit.categoryId} 
                            onSaveSuccess={handleSaveSuccess}
                            assetToEdit={assetToEdit}
                            onBack={() => handleEditDialogChange(false)}
                        />
                )}
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}

// Wrapping the component that uses `useSearchParams` in a Suspense boundary
// is recommended, but for simplicity we'll wrap the page export itself.
// This is not ideal for performance but works for this case.
export default function ActivosPage() {
    return (
        <React.Suspense fallback={<div>Cargando...</div>}>
            <ActivosPageComponent />
        </React.Suspense>
    );
}
