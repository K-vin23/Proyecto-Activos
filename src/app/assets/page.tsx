
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
import { Textarea } from '@/components/ui/textarea';
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

// Mock data for companies and users to populate select inputs
const companies = [
    { id: '1', name: 'Soluciones Tech SAS' },
    { id: '2', name: 'Innovatec Colombia' },
];

const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
];


const assetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional(),
  serialNumber: z.string().min(1, 'El número de serie es requerido.'),
  purchaseDate: z.date({
    required_error: 'La fecha de compra es requerida.',
  }),
  purchaseValue: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "El valor debe ser un número.",
  }),
  status: z.enum(['En uso', 'En almacén', 'En reparación', 'De baja']),
  category: z.enum(['Hardware', 'Software', 'Mobiliario', 'Otro']),
  location: z.string().min(1, 'La ubicación es requerida.'),
  companyId: z.string().min(1, 'La empresa es requerida.'),
  responsibleUserId: z.string().min(1, 'El usuario responsable es requerido.'),
});

type AssetSchema = z.infer<typeof assetSchema>;

function AssetForm({ onRegisterSuccess }: { onRegisterSuccess?: () => void }) {
  const { toast } = useToast();

  const form = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      description: '',
      serialNumber: '',
      purchaseValue: '',
      location: '',
      companyId: '',
      responsibleUserId: '',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Activo</FormLabel>
              <FormControl>
                <Input placeholder="Laptop Dell XPS 15" {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Número de serie, modelo, especificaciones..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Compra</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
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
                            date > new Date() || date < new Date("1900-01-01")
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
            name="purchaseValue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Valor de Compra</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1500.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Mobiliario">Mobiliario</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del Activo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="En uso">En uso</SelectItem>
                  <SelectItem value="En almacén">En almacén</SelectItem>
                  <SelectItem value="En reparación">En reparación</SelectItem>
                  <SelectItem value="De baja">De baja</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                    <Input placeholder="Oficina 201, Bodega B, etc." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Empresa Propietaria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una empresa" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="responsibleUserId"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>Usuario Responsable</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 md:col-span-2">
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
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
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
