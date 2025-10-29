
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
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

// Mock data for assets
const assets = [
  {
    id: 'LAP-001',
    name: 'Laptop Dell XPS 15',
    category: 'Computadores',
    status: 'Asignado',
    company: 'Soluciones Tech SAS',
  },
  {
    id: 'MON-002',
    name: 'Monitor LG UltraWide 29"',
    category: 'Monitores',
    status: 'En Almacén',
    company: 'Innovatec Colombia',
  },
  {
    id: 'SFT-003',
    name: 'Licencia Adobe Creative Cloud',
    category: 'Software',
    status: 'Asignado',
    company: 'Soluciones Tech SAS',
  },
];

const deletedAssets = [
    {
      id: 'LAP-000',
      name: 'Laptop HP Probook',
      category: 'Computadores',
      deletionDate: '2023-10-29',
      reason: 'Dañado sin reparación',
    },
];

const assetSchema = z.object({
  serialNumber: z.string().min(1, 'El número de serie es requerido.'),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
  assetName: z.string().min(1, 'El nombre del activo es requerido.'),
  networkName: z.string().optional(),
  equipmentType: z.enum(['micro', 'portatil', 'servidor', 'sff', 'todo en uno', 'torre', 'ups']),
  brand: z.string().min(1, 'La marca es requerida.'),
  model: z.string().min(1, 'El modelo es requerido.'),
  processor: z.string().min(1, 'El procesador es requerido.'),
  ram: z.string().min(1, 'La memoria RAM es requerida.'),
  storage: z.string().min(1, 'El disco duro es requerido.'),
  officeVersion: z.enum([
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2007',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2010',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2013',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2016',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2019',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES'
  ]),
  officeKey: z.string().optional(),
  os: z.enum(['Windows 10 Pro', 'Windows 11 Pro']),
  osKey: z.string().optional(),
});


type AssetSchema = z.infer<typeof assetSchema>;

function AssetForm({ onRegisterSuccess }: { onRegisterSuccess?: () => void }) {
  const { toast } = useToast();

  const form = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      serialNumber: '',
      invoiceNumber: '',
      assetName: '',
      networkName: '',
      brand: '',
      model: '',
      processor: '',
      ram: '',
      storage: '',
      officeKey: '',
      osKey: '',
    },
  });

  function onSubmit(data: AssetSchema) {
    try {
      console.log('Asset data submitted:', data);
      toast({
        title: 'Registro Exitoso',
        description: 'El activo ha sido registrado correctamente.',
      });
      form.reset();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: 'No se pudo registrar el activo. Inténtalo de nuevo.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="assetName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activo / Nombre</FormLabel>
              <FormControl>
                <Input placeholder="LAPTOP-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="invoiceNumber"
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
                        format(field.value, 'PPP')
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
                    selected={field.value}
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
        <FormField
          control={form.control}
          name="equipmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Equipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="portatil">Portátil</SelectItem>
                  <SelectItem value="servidor">Servidor</SelectItem>
                  <SelectItem value="sff">SFF</SelectItem>
                  <SelectItem value="todo en uno">Todo en Uno</SelectItem>
                  <SelectItem value="torre">Torre</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input placeholder="Dell, HP, Lenovo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Latitude 5420, ThinkPad T14..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="processor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procesador</FormLabel>
              <FormControl>
                <Input placeholder="Intel Core i5-1135G7" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memoria RAM</FormLabel>
              <FormControl>
                <Input placeholder="16 GB DDR4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="storage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disco Duro</FormLabel>
              <FormControl>
                <Input placeholder="512 GB SSD NVMe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="officeVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión de Office</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una versión" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2007">Office 2007</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2010">Office 2010</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2013">Office 2013</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2016">Office 2016</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">Office 2019</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">Office 2021</SelectItem>
                  <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES">Office 2024</SelectItem>
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
          name="os"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistema Operativo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un S.O." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                  <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
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

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 md:col-span-3">
          Registrar Activo
        </Button>
      </form>
    </Form>
  );
}

export default function ActivosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Activos</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Activo
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center pt-12">Registrar nuevo activo</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar un nuevo activo en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <AssetForm onRegisterSuccess={() => setIsDialogOpen(false)} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Listado de Activos</TabsTrigger>
                <TabsTrigger value="deleted">Activos Eliminados</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <Card>
                    <CardHeader>
                    <CardTitle>Listado de Activos</CardTitle>
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
                            <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.id}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.company}</TableCell>
                                <TableCell>
                                <Badge variant={asset.status === 'Asignado' ? 'default' : 'secondary'}>
                                    {asset.status}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                <Button variant="outline" size="sm">
                                    Ver Detalles
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="deleted">
                 <Card>
                    <CardHeader>
                        <CardTitle>Activos Eliminados</CardTitle>
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
                            {deletedAssets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.id}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.deletionDate}</TableCell>
                                <TableCell>{asset.reason}</TableCell>
                                <TableCell>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Restaurar
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
